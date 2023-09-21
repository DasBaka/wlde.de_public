import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            title: 'Orders',
            icon: 'dashboard',
            link: '',
            cols: 1,
            rows: 1,
            text: [
              'Organize current orders',
              'Get a grasp of the current statistics',
            ],
          },
          {
            title: 'Users',
            icon: 'manage_accounts',
            link: '',
            cols: 1,
            rows: 1,
            text: ['Edit reigstered users', 'Analyze their orders'],
          },
          {
            title: 'Dishes',
            icon: 'storefront',
            link: '../dishes/list',
            cols: 1,
            rows: 1,
            text: ['See all listed dishes', 'Rearrange tags'],
          },
          {
            title: 'Restaurant',
            icon: 'person_play',
            link: '',
            cols: 1,
            rows: 1,
            text: ['See general statistics', 'Edit the data of the restaurant'],
          },
        ];
      }

      return [
        {
          title: 'Orders',
          icon: 'dashboard',
          link: '',
          cols: 1,
          rows: 1,
          text: [
            'Organize current orders',
            'Get a grasp of the current statistics',
          ],
        },
        {
          title: 'Users',
          icon: 'manage_accounts',
          link: '',
          cols: 1,
          rows: 1,
          text: ['Edit reigstered users', 'Analyze their orders'],
        },
        {
          title: 'Dishes',
          icon: 'storefront',
          link: '../dishes/list',
          cols: 1,
          rows: 1,
          text: ['See all listed dishes', 'Rearrange tags'],
        },
        {
          title: 'Restaurant',
          icon: 'person_play',
          link: '',
          cols: 1,
          rows: 1,
          text: ['See general statistics', 'Edit the data of the restaurant'],
        },
      ];
    })
  );
}
