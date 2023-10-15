import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  private fb = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  loginForm!: FormGroup;
  wait = true;
  currError = '';

  constructor(private dialogRef: MatDialogRef<DeleteComponent>) {
    this.dialogRef.disableClose = true;
    this.initForm();
    setTimeout(() => {
      this.wait = false;
    }, 2000);
  }

  async onNoClick(b: boolean) {
    let pw = this.loginForm.controls['pw'];
    if (pw.valid) {
      this.authService
        .reauth(pw.value)
        .then(() => {
          this.dialogRef.close(b);
        })
        .catch((error) => {
          this.currError = 'pw';
          this.loginForm.enable();
          console.log(error);
        });
    }
  }

  initForm() {
    this.loginForm = this.fb.group({
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
  }

  fbError(type: string): ValidatorFn {
    return (): ValidationErrors | null => {
      if (this.currError == '') {
        return null;
      } else if (this.currError == 'pw' && type == 'pw') {
        return { pw_error: true };
      } else {
        return null;
      }
    };
  }
}
