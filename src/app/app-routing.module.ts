import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './modules/main/main.component';
import { ResetPasswordComponent } from './modules/main/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    title: 'Du bestellst, wir liefern | wlde.de',
    component: MainComponent,
  },

  {
    path: 'your-order/:id',
    title: 'Deine Bestellung | wlde.de',
    component: MainComponent,
  },
  {
    path: 'your-data',
    title: 'Deine Daten | wlde.de',
    component: MainComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'reset-password/:id',
    title: 'Passwort zurücksetzen | wlde.de',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
