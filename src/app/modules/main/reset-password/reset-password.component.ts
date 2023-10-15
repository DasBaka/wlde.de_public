import { AfterViewInit, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  resetForm!: FormGroup;
  loading = false;

  constructor() {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.resetForm.controls['check'].addValidators(
      this.comparePW(this.resetForm.controls['pw'])
    );
  }

  initForm() {
    this.resetForm = this.fb.group({
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

  onReset() {}
}
