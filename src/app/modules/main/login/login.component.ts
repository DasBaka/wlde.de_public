import { AfterViewInit, Component, inject } from '@angular/core';
import { getDoc, setDoc } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Customer } from 'src/models/classes/customer.class';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private dataService = inject(FirestoreDataService);
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  regForm!: FormGroup;
  loading = false;
  userData!: CustomerProfile & { id: string };
  resetPw = false;

  constructor(public dialogRef: MatDialogRef<LoginComponent>) {
    this.initForms();
    this.dialogRef.afterClosed().subscribe(() => {
      this.resetPw = false;
      this.loginForm.controls['pw'].enable();
    });
  }

  ngAfterViewInit(): void {
    this.regForm.controls['check'].addValidators(
      this.comparePW(this.loginForm.controls['pw'])
    );
  }

  initForms() {
    this.loginForm = this.fb.group({
      mail: [null, [Validators.required, Validators.email]],
      pw: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/
          ),
        ],
      ],
    });
    this.regForm = this.fb.group({
      mail: [null, [Validators.required, Validators.email]],
      pw: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/
          ),
        ],
      ],
      check: [null, [Validators.required]],
    });
  }

  comparePW(pw: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (pw.value === value) {
        return null;
      } else {
        return { match_error: true };
      }
    };
  }

  async onLogin() {
    let form = this.loginForm.controls;
    this.whileLoading();
    try {
      await this.authService.signIn(form['mail'].value, form['pw'].value);
      await this.loadUserData(this.authService.currentUser?.uid).then(() => {
        this.dialogRef.close(this.userData);
      });
    } catch (error) {
      console.log(error);
    }
    this.whileLoading();
  }

  async loadUserData(id?: string) {
    let s = 'users/' + id;
    if (id) {
      const docSnap = await getDoc(this.dataService.getDocRef(s));
      if (docSnap.exists()) {
        await this.getUserData(s);
      } else {
        await this.createNewUserDoc(s);
      }
    }
  }

  async getUserData(id: string) {
    let data = (await this.dataService.getDocData(id)) as CustomerProfile & {
      id: string;
    };
    this.userData = data;
  }

  async createNewUserDoc(id: string) {
    let user: CustomerProfile = this.newUser();
    let u = new Customer(user);
    await setDoc(this.dataService.getDocRef(id), user);
    let uid = this.dataService.getDocRef(id).id;
    await this.dataService
      .update(id, {
        id: uid,
      })
      .then(() => (this.userData = { ...u, id: uid }));
  }

  newUser() {
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
        mail: this.authService.currentUser?.email ?? null,
        phone: null,
      },
    };
  }

  async onRegister() {
    let form = this.regForm.controls;
    await this.authService.register(form['mail'].value, form['pw'].value);
  }

  whileLoading() {
    this.loading = !this.loading;
    this.dialogRef.disableClose = this.loading;
  }

  log() {
    console.log(
      this.loginForm.controls['mail'].valid,
      this.resetPw,
      this.loginForm.controls['mail'].value != '',
      this.resetPw &&
        this.loginForm.controls['mail'].value != '' &&
        this.loginForm.controls['mail'].valid
    );
  }
}
