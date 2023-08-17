import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './main/frontpage/frontpage.component';
import { RestaurantsComponent } from './main/restaurants/restaurants.component';

const routes: Routes = [
  {
    path: 'frontpage',
    component: FrontpageComponent,
  },
  {
    path: 'restaurants',
    component: RestaurantsComponent,
  },
  {
    path: '',
    redirectTo: 'frontpage',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
