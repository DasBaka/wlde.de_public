import { Injectable } from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import { collectionData } from '@angular/fire/firestore';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDataService {
  fs!: Firestore;
  dishColl$!: Observable<any[]>;
  orderColl$!: Observable<any[]>;
  restaurantColl$!: Observable<any[]>;
  tagColl$!: Observable<any[]>;

  constructor(private allFirebaseApps: FirebaseApps) {
    let app = this.findApp();
    if (app) {
      this.fs = getFirestore(app);
      this.dishColl$ = collectionData(this.coll('dishes')) as Observable<any[]>;
      this.orderColl$ = collectionData(this.coll('orders')) as Observable<
        any[]
      >;
      this.restaurantColl$ = collectionData(
        this.coll('restaurant')
      ) as Observable<any[]>;
      this.tagColl$ = collectionData(this.coll('tags')) as Observable<any[]>;
    }
  }

  findApp() {
    let app = this.allFirebaseApps.find((obj) => obj.name === '[DEFAULT]');
    return app;
  }

  coll(coll: string) {
    return collection(this.fs, coll);
  }

  async getDocData(id: string) {
    const docRef = this.getDocRef(id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  getDocRef(id: string) {
    return doc(this.fs, id);
  }

  async update(refId: string, data: any) {
    return await updateDoc(this.getDocRef(refId), data);
  }

  async deleteDoc(id: string) {
    await deleteDoc(this.getDocRef(id));
  }
}
