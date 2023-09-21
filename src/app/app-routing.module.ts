import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/main/1-home/home.component';
import { OrdersComponent } from './modules/main/2-orders/orders.component';
import { UsersComponent } from './modules/main/3-users/users.component';
import { ResponsibleComponent } from './modules/main/5-restaurant/responsible/responsible.component';
import { TagsComponent } from './modules/main/4-dishes/tags/tags.component';
import { DishListComponent } from './modules/main/4-dishes/dish-list/dish-list.component';
import { AddDishComponent } from './modules/main/4-dishes/add-dish/add-dish.component';
import { DeliveryHoursComponent } from './modules/main/5-restaurant/delivery-hours/delivery-hours.component';

const routes: Routes = [
  { path: 'home', title: 'Home | MyCRM', component: HomeComponent },
  {
    path: 'dishes',
    children: [
      {
        path: 'tags',
        title: 'Tags | MyCRM',
        component: TagsComponent,
      },
      {
        path: 'list',
        title: 'Dishes | MyCRM',
        component: DishListComponent,
      },
      {
        path: 'list/edit',
        title: 'Edit dish | MyCRM',
        component: AddDishComponent,
      },

      {
        path: 'add-dish',
        title: 'Add new dish | MyCRM',
        component: AddDishComponent,
      },
    ],
  },
  { path: 'orders', component: OrdersComponent },
  { path: 'users', component: UsersComponent },
  {
    path: 'restaurant',
    children: [
      {
        path: 'responsible',
        title: 'Restaurant Settings | MyCRM',
        component: ResponsibleComponent,
      },
      {
        path: 'hours',
        title: 'Restaurant Opening Hours | MyCRM',
        component: DeliveryHoursComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
