import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  withDisabledInitialNavigation,
} from '@angular/router';
import { MainComponent } from './modules/main/main.component';
import { CheckoutComponent } from './modules/order-stepper/checkout/checkout.component';
import { AddressComponent } from './modules/order-stepper/address/address.component';
import { OrderStepperComponent } from './modules/order-stepper/order-stepper.component';
import { DoneComponent } from './modules/order-stepper/done/done.component';

const routes: Routes = [
  {
    path: '',
    title: 'Du bestellst, wir liefern | wlde.de',
    component: MainComponent,
  },
  {
    path: 'order',
    title: 'Du bestellst, wir liefern | wlde.de',
    component: OrderStepperComponent,
  },
  {
    path: 'your-order/:id',
    title: 'Du bestellst, wir liefern | wlde.de',
    component: DoneComponent,
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
