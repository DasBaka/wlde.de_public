import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  regForm!: FormGroup;
  loading = false;
  resetPw = false;
  resetted = false;
  currError = '';

  constructor(public dialogRef: MatDialogRef<LoginComponent>) {
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
      await this.tryLogin(form);
      this.whileLoading();
    }
  }

  async tryLogin(
    form: { [key: string]: AbstractControl<any, any> },
    state?: string
  ) {
    try {
      await this.authService
        .signIn(form['mail'].value, form['pw'].value)
        .then(() => {
          this.dialogRef.close(state);
        });
    } catch (error) {
      this.checkForLoginError(error);
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
      this.whileLoading();
      await this.tryReg();
      this.whileLoading();
    }
  }

  async tryReg() {
    let form = this.regForm.controls;
    try {
      await this.authService.register(form['mail'].value, form['pw'].value);
      await this.tryLogin(form, 'reg');
    } catch (error) {
      this.checkForRegisterError(error);
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

  async pwReset() {
    if (this.resetPw == true) {
      this.whileLoading();
      await this.tryReset();
      this.loading = !this.loading;
    } else {
      this.resetPw = true;
      this.loginForm.controls['pw'].disable();
    }
  }

  async tryReset() {
    try {
      await this.authService
        .pwReset(this.loginForm.controls['mail'].value)
        .then(() => {
          this.loginForm.enable();
          this.resetPw = false;
          this.resetted = true;
        });
    } catch (error) {
      this.checkForLoginError(error);
    }
  }
}
