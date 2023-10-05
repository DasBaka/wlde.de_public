import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './modules/main/main.component';

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
    title: 'Deine Bestellung | wlde.de',
    component: MainComponent,
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
