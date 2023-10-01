import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { CartItem } from '../../main/main.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  @Input() customer!: CustomerProfile;
  @Input() order!: CartItem[];
  @Input() price!: string;
  @Output() onOrder = new EventEmitter<boolean>();

  placeOrder() {
    this.onOrder.emit(true);
  }
}
