import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CartItem } from '../main.component';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss'],
})
export class DishesComponent implements OnChanges {
  selectedTags = [];
  filteredObservable$!: Observable<any[]>;
  disabled = false;
  orderStorage = '';
  ordered = false;

  @ViewChild('tagWrapper') tagDiv!: ElementRef;

  @Input() dataService!: FirestoreDataService;
  @Input() cart: CartItem[] = [];
  @Input() loggedInUser!: (CustomerProfile & { id: string }) | null;

  @Output() calc: EventEmitter<CartItem> = new EventEmitter<CartItem>();
  @Output() reroute: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.currentlyOrdered();
    this.missingAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes['loggedInUser'].isFirstChange() ||
      changes['loggedInUser'].currentValue !== undefined
    ) {
      if (this.loggedInUser !== null) {
        this.missingAddress();
      }
    }
  }

  cooldown() {
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, 300);
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

  selection(tags: []) {
    let a: boolean[] = [];
    this.selectedTags.forEach((tag) => {
      a.push(tags.includes(tag));
    });
    return a.some((v) => {
      return v;
    });
  }

  addToCart(dish: CartItem) {
    if (this.cart.includes(dish)) {
      this.cart[this.cart.indexOf(dish)].count += 1;
    } else {
      dish.count = 1;
      this.cart.push(dish);
    }
    this.calc.emit(dish);
  }

  missingAddress() {
    let a = this.loggedInUser?.address;
    let c = this.loggedInUser?.contact;
    let d = this.loggedInUser?.customer;
    return [
      a?.house,
      a?.city,
      a?.postalCode,
      a?.street,
      c?.phone,
      d?.firstname,
      d?.lastname,
    ].some((value) => {
      return !value;
    });
  }

  currentlyOrdered() {
    if (localStorage.getItem('orderId') != null) {
      this.orderStorage = localStorage.getItem('orderId') ?? '';
      this.ordered = true;
      return;
    }
    this.ordered = false;
  }

  emitRoute(s: string) {
    this.reroute.emit(s);
  }

  toggleLogin() {
    this.toggle.emit();
  }
}
