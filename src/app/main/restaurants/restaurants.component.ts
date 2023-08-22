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
    const coll = collection(
      this.firestore,
      'restaurants/QBJwLfo5q5D2Hap2ctJu/dishes'
    );
    this.restaurants$ = collectionData(coll) as Observable<RestaurantProfile[]>;
  }
}

export interface RestaurantProfile {
  id: string;
  name: string;
  likes: { ratio: number; amount: number };
  min: string;
  time: string;
  costs: string;
  dishes: {};
}
