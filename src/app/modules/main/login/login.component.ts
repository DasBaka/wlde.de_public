import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
  @ViewChild('spinner1') loginSpin!: MatProgressSpinner;

  constructor(public dialogRef: MatDialogRef<LoginComponent>) {
    this.initForms();
  }

  ngAfterViewInit(): void {
    this.regForm.addValidators(
      this.comparePW(
        this.loginForm.controls['pw'],
        this.loginForm.controls['check']
      )
    );
  }

  initForms() {
    this.loginForm = this.fb.group({
      mail: [null, Validators.required],
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
      mail: [null, Validators.required],
      pw: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/
          ),
        ],
      ],
      check: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/
          ),
        ],
      ],
    });
  }

  comparePW(pw: AbstractControl, check: AbstractControl) {
    return () => {
      if (pw.value !== check.value) {
        return { match_error: 'Value does not match' };
      }
      return null;
    };
  }

  async onLogin() {
    let form = this.loginForm.controls;
    this.loading = true;
    await this.authService
      .signIn(form['mail'].value, form['pw'].value)
      .then(() => {
        this.loading = false;
        this.dialogRef.close();
      });
  }

  async onRegister() {
    let form = this.regForm.controls;
    await this.authService.register(form['mail'].value, form['pw'].value);
  }
}
