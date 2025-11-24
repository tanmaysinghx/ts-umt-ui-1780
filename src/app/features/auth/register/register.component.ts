import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SnackbarDetailedComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerFormPayload: any;
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag: boolean = false;

  constructor(private readonly registerService: RegisterService, private readonly router: Router) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({
      userEmailId: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required),
      userPasswordConfirm: new FormControl('', Validators.required),
      termsFlag: new FormControl(),
    });
  }

  createRegisterPayload() {
    console.log(this.registerForm);
    this.registerFormPayload = {
      email: this.registerForm.controls['userEmailId'].value,
      password: this.registerForm.controls['userPassword'].value,
      roleName: 'user',
    };
  }

  submitForm() {
    if (this.registerForm?.status == 'INVALID') {
      this.openSnackbar(
        'Please review form errors and correct them before submitting the form again !!!',
        'danger',
        6000
      );
      this.validateFormErrors();
    }
    if (this.registerForm?.status == 'VALID') {
      this.createRegisterPayload();
      this.registerService.registerUser(this.registerFormPayload).subscribe(
        (data) => {
          this.openSnackbar(
            'User registration is succesfull !!!',
            'success',
            6000
          );
          console.log(data);
        },
        (error) => {
          let err =
            'Please review server errors and correct them before submitting the form again !!!  ' +
            error.error.error;
          this.openSnackbar(err, 'danger', 6000);
        }
      );
    }
  }

  validateFormErrors() {
    if (this.registerForm?.status == 'INVALID') {
      if (this.registerForm?.controls['userEmailId']?.status == 'INVALID') {
        if (this.registerForm.controls['userEmailId'].errors?.['email']) {
          this.registerForm?.controls['userEmailId']?.setErrors({
            customError: 'EMAIL_INCORRECT',
          });
        }
      }
    }
  }

  openSnackbar(message: any, type: any, duration: any) {
    this.snackbarMessage = message;
    this.snackbarType = type;
    this.snackbarDuration = duration;
    this.snackbarFlag = true;
    setTimeout(() => {
      this.snackbarFlag = false;
    }, duration);
  }

  signUpWithGoogle(): void {
    // TODO: plug in real Google OAuth here
    this.openSnackbar('Google sign-up is not integrated yet.', 'info', 4000);
  }

  navigateToLogin(): void {
    this.router.navigate(['../auth/login']);
  }
}
