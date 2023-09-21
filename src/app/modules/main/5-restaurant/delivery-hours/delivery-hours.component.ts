import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Restaurant } from 'src/models/classes/restaurant.class';
import { RestaurantProfile } from 'src/models/interfaces/restaurant-profile.interface';

@Component({
  selector: 'app-delivery-hours',
  templateUrl: './delivery-hours.component.html',
  styleUrls: ['./delivery-hours.component.scss'],
})
export class DeliveryHoursComponent {
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
      hours: [this.dataToEdit.hours],
    });
  }

  async getEditable() {
    this.dataToEdit = new Restaurant(
      (await this.dataService.getDocData(
        'restaurant/restaurant-data'
      )) as RestaurantProfile
    );
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
