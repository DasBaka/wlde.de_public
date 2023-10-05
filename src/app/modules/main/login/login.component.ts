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
        console.log(error);
      }
      this.whileLoading();
    }
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
        console.log(error);
      }
      this.whileLoading();
    }
  }

  whileLoading() {
    this.loading = !this.loading;
    this.dialogRef.disableClose = this.loading;
  }
}
