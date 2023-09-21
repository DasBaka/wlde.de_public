import { AfterViewInit, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Restaurant } from 'src/models/classes/restaurant.class';
import { RestaurantProfile } from 'src/models/interfaces/restaurant-profile.interface';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss'],
})
export class ResponsibleComponent implements AfterViewInit {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  restaurant!: RestaurantProfile;
  dataToEdit = new Restaurant();

  private fb = inject(FormBuilder);
  newRestaurantForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getEditable();
    this.initForm();
  }

  initForm() {
    this.newRestaurantForm = this.fb.group({
      responsible: this.responsibleGroup(this.dataToEdit),
      address: this.addressGroup(this.dataToEdit),
      contact: this.contactGroup(this.dataToEdit),
      hours: this.dataToEdit.hours,
    });
  }

  async getEditable() {
    this.dataToEdit = new Restaurant(
      (await this.dataService.getDocData(
        'restaurant/restaurant-data'
      )) as RestaurantProfile
    );
  }

  responsibleGroup(data: Restaurant) {
    return this.fb.group({
      firstname: [data.responsible.firstname, Validators.required],
      lastname: [data.responsible.lastname, Validators.required],
    });
  }

  addressGroup(data: Restaurant) {
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

  contactGroup(data: Restaurant) {
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
    if (this.newRestaurantForm.valid) {
      await this.dataService.update(
        'restaurant/restaurant-data',
        this.newRestaurantForm.value
      );
    }
  }
}
