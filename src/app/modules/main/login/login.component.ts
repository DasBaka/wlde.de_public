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
import { Router } from '@angular/router';
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
  currError = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router
  ) {
    this.initForms();
    this.dialogRef.afterClosed().subscribe(() => {
      this.resetPw = false;
      this.loginForm.controls['pw'].enable();
    });
  }

  ngAfterViewInit(): void {
    this.regForm.controls['check'].addValidators(
      this.comparePW(this.regForm.controls['pw'])
    );
  }

  initForms() {
    this.loginForm = this.fb.group({
      mail: [
        null,
        [Validators.required, Validators.email, this.fbError('user')],
      ],
      pw: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/
          ),
          this.fbError('pw'),
        ],
      ],
    });
    this.regForm = this.fb.group({
      mail: [
        null,
        [Validators.required, Validators.email, this.fbError('reg')],
      ],
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

  fbError(type: string): ValidatorFn {
    return (): ValidationErrors | null => {
      if (this.currError == '') {
        return null;
      } else if (this.currError == 'user' && type == 'user') {
        return { user_error: true };
      } else if (this.currError == 'pw' && type == 'pw') {
        return { pw_error: true };
      } else if (this.currError == 'reg-user' && type == 'reg') {
        return { reg_error: true };
      } else {
        return null;
      }
    };
  }

  async onLogin() {
    if (this.loginForm.valid) {
      let form = this.loginForm.controls;
      this.whileLoading();
      try {
        await this.authService.signIn(form['mail'].value, form['pw'].value);
        await this.dataService
          .loadUserData(this.authService.currentUser?.uid)
          .then(() => {
            this.dialogRef.close(this.userData);
          });
      } catch (error) {
        this.checkForLoginError(error);
      }
      this.whileLoading();
    }
  }

  checkForLoginError(error: unknown) {
    if (error == 'Firebase: Error (auth/user-not-found).') {
      this.currError = 'user';
    }
    if (error == 'Firebase: Error (auth/wrong-password).') {
      this.currError = 'pw';
    }
    this.loginForm.enable();
  }

  async onRegister() {
    if (this.regForm.valid) {
      let form = this.regForm.controls;
      this.whileLoading();
      try {
        await this.authService.register(form['mail'].value, form['pw'].value);
        await this.authService.signIn(form['mail'].value, form['pw'].value);
        await this.dataService
          .loadUserData(this.authService.currentUser?.uid)
          .then(() => {
            this.dialogRef.close(this.userData);
          });
      } catch (error) {
        this.checkForRegisterError(error);
      }
      this.whileLoading();
    }
  }

  checkForRegisterError(error: unknown) {
    if (error == 'Firebase: Error (auth/email-already-in-use).') {
      this.currError = 'reg-user';
    }
    this.regForm.enable();
  }

  whileLoading() {
    this.loading = !this.loading;
    this.dialogRef.disableClose = this.loading;
  }
}
