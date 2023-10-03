import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../main.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @Input() cart: CartItem[] = [];
  @Output() adjust: EventEmitter<CartItem> = new EventEmitter<CartItem>();

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
      this.adjust.emit(dish);
    }
  }
}
