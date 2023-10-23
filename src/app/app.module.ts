import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainComponent } from './modules/main/main.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { CheckoutComponent } from './modules/order-stepper/checkout/checkout.component';
import { OrderStepperComponent } from './modules/order-stepper/order-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AddressComponent } from './modules/order-stepper/address/address.component';
import { DoneComponent } from './modules/order-stepper/done/done.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartComponent } from './modules/main/cart/cart.component';
import { LoginComponent } from './modules/main/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DishesComponent } from './modules/main/dishes/dishes.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteComponent } from './modules/order-stepper/address/delete/delete.component';
import { ResetPasswordComponent } from './modules/main/reset-password/reset-password.component';
import { ImprintComponent } from './modules/main/imprint/imprint.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CheckoutComponent,
    OrderStepperComponent,
    AddressComponent,
    DoneComponent,
    CartComponent,
    LoginComponent,
    DishesComponent,
    DeleteComponent,
    ResetPasswordComponent,
    ImprintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatStepperModule,
    MatProgressBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseCrm)),
    provideFirebaseApp(() => initializeApp(environment.firebaseClone, 'clone')),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
