import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Customer } from 'src/models/classes/customer.class';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { DeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnChanges {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  authService: AuthService = inject(AuthService);
  dataToEdit = new Customer();
  @Input() loggedInUser: (CustomerProfile & { id: string }) | null = null;
  @Input() params!: { [key: string]: any };
  @Output() controlAddress = new EventEmitter<FormGroup>();
  private fb = inject(FormBuilder);
  customerForm!: FormGroup;

  constructor(private router: Router, public dialog: MatDialog) {
    if (this.loggedInUser && this.loggedInUser !== null) {
      this.dataToEdit = new Customer(this.loggedInUser);
    }
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes['loggedInUser'].isFirstChange() ||
      changes['loggedInUser'].currentValue !== undefined
    ) {
      if (this.loggedInUser !== null) {
        this.dataToEdit = new Customer(this.loggedInUser);
        this.initForm();
      }
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
        { value: data.contact.mail, disabled: data.contact.mail !== null },
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
      switch (this.params['page']) {
        case 'data':
          try {
            this.dataService.update(
              'users/' + this.loggedInUser?.id,
              this.customerForm.value
            );
          } catch (error) {
            console.log(error);
          } finally {
            this.router.navigate(['']);
          }
          break;

        default:
          this.controlAddress.emit(this.customerForm);
          break;
      }
    }
  }

  async deleteAccount() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe((onNoClick) => {
      if (!onNoClick) {
        this.authService.deleteAccount().then(() => {
          this.router.navigate(['']);
        });
      }
    });
  }
}
