import { ChangeDetectorRef, Component } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SnackbarDetailedComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})

export class LoginComponent {
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag: boolean = false;
  loginForm!: FormGroup;
  loginFormPayload: any;

  constructor(
    private loginService: LoginService, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      userEmailId: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required)
    });
  }

  createLoginPayload() {
    this.loginFormPayload = {
      "username": this.loginForm.controls['userEmailId'].value,
      "password": this.loginForm.controls['userPassword'].value
    }
  }

  submitForm() {
    this.cdr.detectChanges();
    if (this.loginForm?.status == "INVALID") {
      this.openSnackbar("Please review form errors and correct them before submitting the form again !!!", "danger", 6000);
      this.validateFormErrors();
    }
    if (this.loginForm?.status == "VALID") {
      this.createLoginPayload();
      this.loginService.login(this.loginFormPayload.username, this.loginFormPayload.password).subscribe((data) => {
        this.setSessionStorage(data);
        this.openSnackbar("Login is successfull, you will be redirected to dashboard !!!", "success", 6000);
        console.log(data);
      })
    }
  }

  validateFormErrors() {
    if (this.loginForm?.status == "INVALID") {
      if (this.loginForm?.controls['userEmailId']?.status == "INVALID") {
        if (this.loginForm.controls['userEmailId'].errors?.['required']) {
          this.loginForm?.controls['userEmailId']?.setErrors({ customError: 'EMAIL_REQUIRED' })
        } else if (this.loginForm.controls['userEmailId'].errors?.['email']) {
          this.loginForm?.controls['userEmailId']?.setErrors({ customError: 'EMAIL_INCORRECT' })
        }
      }
      if (this.loginForm?.controls['userPassword']?.status == "INVALID") {
        if (this.loginForm.controls['userPassword'].errors?.['required']) {
          this.loginForm?.controls['userPassword']?.setErrors({ customError: 'PASSWORD_REQUIRED' })
        }
      }
    }
  }

  setSessionStorage(data: any) {
    sessionStorage.setItem("access-token", data.access_token);
    sessionStorage.setItem("refresh-token", data.refresh_token);
    sessionStorage.setItem("user-email", data.user_email);
    sessionStorage.setItem("user-name", data.user_name);
    sessionStorage.setItem("user-role", data.user_role);
  }

  navigateToRegister() {
    this.router.navigate(["../auth/register"]);
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
}
