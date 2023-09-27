import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';
import { CurrencyFormatterService } from 'src/app/core/services/currency-formatter.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  currencyService: CurrencyFormatterService = inject(CurrencyFormatterService);
  cart: CartItem[] = [];
  selectedTags = [];
  filteredObservable$!: Observable<any[]>;

  @ViewChild('tagWrapper') tagDiv!: ElementRef;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.getTimeFromLS() + 30 * 60 * 1000 < Date.now()) {
      localStorage.clear();
    }
    if (localStorage.getItem('cart') !== null) {
      this.cart = this.getCartFromLS();
    }
  }

  scrolled() {
    if (this.tagDiv) {
      this.tagDiv.nativeElement.scrollLeft;
    }
  }

  scrollTags(move: number) {
    this.tagDiv.nativeElement.scrollLeft =
      this.tagDiv.nativeElement.scrollLeft +
      0.2 *
        move *
        (this.tagDiv.nativeElement.scrollWidth -
          this.tagDiv.nativeElement.offsetWidth);
  }

  addToCart(dish: CartItem) {
    if (this.cart.includes(dish)) {
      this.cart[this.cart.indexOf(dish)].count += 1;
    } else {
      dish.count = 1;
      this.cart.push(dish);
    }
    this.calcPrice(dish);
    this.setCartToLS();
  }

  adjustCount(dish: CartItem, add: number) {
    let i = this.cart.indexOf(dish);
    let d = this.cart[i];
    d.count += add;
    if (d.count == 0) {
      this.cart.splice(i, 1);
      if (this.cart.length == 0) {
        localStorage.clear();
      }
    } else {
      this.calcPrice(dish);
    }
  }

  calcPrice(dish: CartItem) {
    let num = this.currencyService.num(dish.cost ?? '');
    let price = num * dish.count;
    this.cart[this.cart.indexOf(dish)].price =
      this.currencyService.price(price);
  }

  sumOfItems() {
    if (this.cart.length > 0) {
      let sum: number = 0;
      this.cart.forEach((item) => {
        sum += item.count;
      });
      return sum;
    }
    return;
  }

  priceOfItems() {
    if (this.cart.length > 0) {
      let sum: number = 0;
      this.cart.forEach((item) => {
        sum += this.currencyService.num(item.price);
      });
      return this.currencyService.price(sum);
    }
    return;
  }

  selection(tags: []) {
    let a: boolean[] = [];
    this.selectedTags.forEach((tag) => {
      a.push(tags.includes(tag));
    });
    return a.some((v) => {
      return v;
    });
  }

  setCartToLS() {
    localStorage.setItem('time', Date.now().toString());
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCartFromLS() {
    return JSON.parse(localStorage.getItem('cart') ?? '');
  }
  getTimeFromLS() {
    return parseInt(localStorage.getItem('time') ?? '');
  }

  toCheckout() {
    this.router.navigate(['order/address'], {
      relativeTo: this.route,
      state: { cart: this.cart, price: this.priceOfItems() },
    });
  }
}

export type CartItem = DishProfile & {
  count: number;
  price: string;
};
