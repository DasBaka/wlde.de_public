import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';
import { CurrencyFormatterService } from 'src/app/core/services/currency-formatter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  authService = inject(AuthService);
  userSub!: Subscription;
  currencyService: CurrencyFormatterService = inject(CurrencyFormatterService);
  cart: CartItem[] = [];
  items = 0;
  currentUser: User | null = null;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.checkLSForOrder();
    this.userSub = this.authService.user$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    if (this.getTimeFromLS() + 30 * 60 * 1000 < Date.now()) {
      localStorage.clear();
    }
    if (localStorage.getItem('cart') !== null) {
      this.cart = this.getCartFromLS();
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  checkLSForOrder() {
    if (localStorage.getItem('timestamp')) {
      let t = JSON.parse(localStorage.getItem('timestamp') || '');
      let h = 3600000;
      if (Date.now() - parseInt(t) > h) {
        localStorage.clear();
        return;
      } else {
        this.navigateToOrder();
      }
    }
  }

  navigateToOrder() {
    if (localStorage.getItem('orderId')) {
      let ls = localStorage.getItem('orderId');
      this.router.navigate(['your-order/' + ls]);
    }
  }

  calcPrice(dish: CartItem) {
    let num = this.currencyService.num(dish.cost ?? '');
    let price = num * dish.count;
    this.cart[this.cart.indexOf(dish)].price =
      this.currencyService.price(price);
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

  sumOfItems() {
    if (this.cart.length > 0) {
      let sum: number = 0;
      this.cart.forEach((item) => {
        sum += item.count;
      });
      this.items = sum;
    } else {
      this.items = 0;
    }
    this.setCartToLS();
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
    this.router.navigate(['order'], {
      relativeTo: this.route,
      state: { cart: this.cart, price: this.priceOfItems() },
    });
  }

  toggleLogin(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(LoginComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

export type CartItem = DishProfile & {
  count: number;
  price: string;
};
