import { Injectable } from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import { addDoc, collectionData } from '@angular/fire/firestore';
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Customer } from 'src/models/classes/customer.class';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { OrderProfile } from 'src/models/interfaces/order-profile';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDataService {
  fs!: Firestore;
  dishColl$!: Observable<any[]>;
  orderColl$!: Observable<any[]>;
  restaurantColl$!: Observable<any[]>;
  tagColl$!: Observable<any[]>;
  private userData!:
    | (CustomerProfile & {
        id: string;
      })
    | null;

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

  async createNewUserDoc(id: string, mail: any) {
    let user: CustomerProfile = this.newUser(mail);
    let u = new Customer(user);
    await setDoc(this.getDocRef(id), user);
    let uid = this.getDocRef(id).id;
    await this.update(id, {
      id: uid,
    }).then(() => {
      let userData = { ...u, id: uid } as CustomerProfile & {
        id: string;
      };
      this.userData = userData;
    });
  }

  newUser(mail?: any) {
    return {
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
        mail: mail ?? null,
        phone: null,
      },
    };
  }

  async loadUserData(id?: string, mail?: any) {
    let s = 'users/' + id;
    this.userData = null;
    try {
      if (id) {
        const docSnap = await getDoc(this.getDocRef(s));
        if (docSnap.exists()) {
          await this.getUserData(s);
        } else {
          await this.createNewUserDoc(s, mail);
        }
      }
    } finally {
      return this.userData;
    }
  }

  async getUserData(id: string) {
    let data = (await this.getDocData(id)) as CustomerProfile & {
      id: string;
    };
    this.userData = data;
  }

  async syncOrder(doc: DocumentReference, user: any) {
    let id = doc.id;
    try {
      updateDoc(doc, { id: id });
      let data: any;
      await getDoc(doc).then((ds: DocumentSnapshot) => {
        data = ds.data() as OrderProfile;
        delete data.user;
      });
      if (user) {
        addDoc(collection(this.getDocRef('users/' + user.id), 'orders'), data);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
