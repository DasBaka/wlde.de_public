import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { CartItem } from '../main/main.component';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { OrderProfile } from 'src/models/interfaces/order-profile';
import { DocumentReference, addDoc, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.scss'],
})
export class OrderStepperComponent {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  controlAddress = this._formBuilder.group({});
  controlCheck = this._formBuilder.group({});
  @ViewChild('stepper') stepper!: MatStepper;

  customerData: CustomerProfile;
  order: CartItem[];
  price: string;

  constructor(private _formBuilder: FormBuilder, private router: Router) {
    this.order = window.history.state.cart;
    this.price = window.history.state.price;
    if (this.order == null || this.price == null) {
      this.router.navigate(['']);
    }
    this.customerData = {
      customer: {
        firstname: null,
        lastname: null,
        company: null,
      },
      address: {
        city: null,
        house: null,
        postalCode: null,
        street: null,
      },
      contact: {
        mail: null,
        phone: null,
      },
    };
  }

  nextStep(fg: FormGroup) {
    switch (this.stepper.selectedIndex) {
      case 0:
        this.controlAddress = fg;
        this.customerData = this.controlAddress.value as CustomerProfile;
        break;
      case 1:
        this.controlCheck = fg;
        break;
    }
    if (this.controlAddress.valid) {
      this.stepper.next();
    }
  }

  orderData() {
    let data: OrderProfile = {
      id: '',
      timestamp: Date.now(),
      user: { id: '', data: this.customerData as CustomerProfile },
      cart: { order: this.order, price: this.price },
    };

    return data;
  }

  async placeOrder() {
    await addDoc(this.dataService.coll('orders'), this.orderData()).then(
      (doc: DocumentReference) => {
        let id = doc.id;
        updateDoc(doc, { id: id });
        this.setOrderToLS(id);
      }
    );
    this.changeState();
    this.stepper.next();
  }

  setOrderToLS(id: string) {
    localStorage.clear();
    localStorage.setItem('orderId', id);
    localStorage.setItem('timestamp', Date.now().toString());
  }

  changeState() {
    window.history.replaceState(
      {
        cart: null,
        price: null,
      },
      ''
    );
  }
}
