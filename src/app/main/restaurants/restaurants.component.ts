import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss'],
})
export class RestaurantsComponent {
  private firestore: Firestore = inject(Firestore);
  restaurants$: Observable<RestaurantProfile[]>;

  constructor() {
    const coll = collection(this.firestore, 'restaurants');
    this.restaurants$ = collectionData(coll) as Observable<RestaurantProfile[]>;
  }
}

export interface RestaurantProfile {
  general: {
    mail: string;
    owner: string;
    phone: string;
    restaurant: string;
  };
  address: {
    city: string;
    house: string;
    postalCode: string;
    street: string;
  };
  delivery: {
    costs: number;
    min: string; // TO-DO!
  };
  hours: [];
  id: string;
  likes: { ratio: number; amount: number };
}
