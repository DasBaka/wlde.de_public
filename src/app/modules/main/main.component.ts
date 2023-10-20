import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';
import { CurrencyFormatterService } from 'src/app/core/services/currency-formatter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '@angular/fire/auth';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  authService = inject(AuthService);
  userSub!: Subscription;
  dataSub!: Subscription;
  currencyService: CurrencyFormatterService = inject(CurrencyFormatterService);
  cart: CartItem[] = [];
  items = 0;
  currentUser!: (CustomerProfile & { id: string }) | null;
  private user!: User | null;
  params!: { [key: string]: any };
  currentUrl: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  isSmall$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    if (
      Date.now() - parseInt(localStorage.getItem('loginTime') ?? '0') >
      3600000
    ) {
      this.logout();
    }
    this.checkLSForOrder();
    this.userSub = this.subscribeToUserAuth();
    this.dataSub = this.subscribeToUserData();
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
  }

  ngOnInit() {
    if (this.getTimeFromLS() + 30 * 60 * 1000 < Date.now()) {
      localStorage.clear();
    }
    if (localStorage.getItem('cart') !== null) {
      this.cart = this.getCartFromLS();
    } else {
      this.cart = [];
    }
    let segments = this.route.snapshot.url.map((x) => x.path);
    this.currentUrl = segments[0];
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.sumOfItems();
  }

  subscribeToUserAuth() {
    return this.authService.user$.subscribe(async (user: User | null) => {
      this.user = user;
      this.currentUser = await this.dataService.loadUserData(
        this.user?.uid,
        this.user?.email
      );
    });
  }

  subscribeToUserData() {
    return this.dataService.userColl$.subscribe(async () => {
      this.currentUser = await this.dataService.loadUserData(
        this.user?.uid,
        this.user?.email
      );
    });
  }

  checkLSForOrder() {
    if (localStorage.getItem('timestamp')) {
      let t = JSON.parse(localStorage.getItem('timestamp') || '');
      let h = 3600000;
      if (Date.now() - parseInt(t) > h) {
        localStorage.clear();
        return;
      }
    }
  }

  calcPrice(dish: CartItem) {
    let num = this.currencyService.num(dish.cost ?? '');
    let price = num * dish.count;
    this.cart[this.cart.indexOf(dish)].price =
      this.currencyService.price(price);
  }

  priceOfItems() {
    if (this.cart.length > 0) {
      let sum: number = 0;
      this.cart.forEach((item) => {
        sum += this.currencyService.num(item.price);
      });
      return this.currencyService.price(sum);
    }
    return;
  }

  sumOfItems() {
    if (this.cart.length > 0) {
      let sum: number = 0;
      this.cart.forEach((item) => {
        sum += item.count;
      });
      this.items = sum;
    } else {
      this.items = 0;
    }
    this.setCartToLS();
  }

  setCartToLS() {
    localStorage.setItem('time', Date.now().toString());
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCartFromLS() {
    return JSON.parse(localStorage.getItem('cart') ?? '');
  }

  getTimeFromLS() {
    return parseInt(localStorage.getItem('time') ?? '');
  }

  toCheckout() {
    this.router.navigate([''], {
      queryParams: { page: 'order' },
      state: { cart: this.cart, price: this.priceOfItems() },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  toData() {
    this.router.navigate([''], {
      queryParams: { page: 'data', id: this.user?.uid },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  toOrder() {
    this.router.navigate([''], {
      queryParams: { page: 'your-order' },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  toImprint() {
    this.router.navigate([''], {
      queryParams: { page: 'imprint' },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  reroute(s: string) {
    switch (s) {
      case 'data':
        this.toData();
        break;
      case 'order':
        this.toOrder();
        break;

      default:
        break;
    }
  }

  toggleLogin(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog
      .open(LoginComponent, {
        /*         height: '90%',
        width: '90%', */
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe((result) => {
        if (this.user && this.user !== null) {
          this._snackBar.open(this.welcomMessage(result ?? null), undefined, {
            duration: 2500,
          });
          localStorage.setItem('loginTime', Date.now().toString());
        }
      });
  }

  welcomMessage(state: string | null) {
    let c = this.currentUser?.customer ?? null;
    if (state !== null) {
      return 'Willkommen bei "Wir-liefern-dein-Essen.de"';
    } else {
      return (
        'Willkommen zurück' +
        (c?.firstname !== null ? ' ' + c?.firstname + ' ' : '') +
        (c?.lastname !== null ? c?.lastname + '!' : '!')
      );
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
    this.currentUser = null;
  }

  emptyCart() {
    this.cart = [];
    this.items = 0;
  }
}

export type CartItem = DishProfile & {
  count: number;
  price: string;
};
