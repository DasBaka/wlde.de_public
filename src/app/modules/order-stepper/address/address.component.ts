import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { User, user } from '@angular/fire/auth';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Customer } from 'src/models/classes/customer.class';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnChanges {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  dataToEdit = new Customer();
  @Input() loggedInUser!: CustomerProfile & { id: string };
  @Output() controlAddress = new EventEmitter<FormGroup>();
  private fb = inject(FormBuilder);
  customerForm!: FormGroup;

  constructor() {
    if (this.loggedInUser) {
      this.dataToEdit = new Customer(this.loggedInUser);
    }
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes['loggedInUser'].isFirstChange() ||
      changes['loggedInUser'].currentValue !== undefined
    ) {
      this.dataToEdit = this.loggedInUser;
      this.initForm();
    }
  }

  initForm() {
    this.customerForm = this.fb.group({
      customer: this.customerGroup(this.dataToEdit),
      address: this.addressGroup(this.dataToEdit),
      contact: this.contactGroup(this.dataToEdit),
    });
  }

  customerGroup(data: Customer) {
    return this.fb.group({
      firstname: [data.customer.firstname, Validators.required],
      lastname: [data.customer.lastname, Validators.required],
      company: [data.customer.company],
    });
  }

  addressGroup(data: Customer) {
    return this.fb.group({
      street: [data.address.street, Validators.required],
      house: [data.address.house, Validators.required],
      city: [data.address.city, Validators.required],
      postalCode: [
        data.address.postalCode,
        [Validators.required, Validators.pattern('[0-9]{5,5}')],
      ],
    });
  }

  contactGroup(data: Customer) {
    return this.fb.group({
      mail: [
        data.contact.mail,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      phone: [
        data.contact.phone,
        Validators.compose([Validators.required, Validators.pattern('[0-9]*')]),
      ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.customerForm.valid) {
      this.controlAddress.emit(this.customerForm);
    }
  }
}
