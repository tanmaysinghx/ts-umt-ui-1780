import { ChangeDetectorRef, Component } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { CookieService } from 'ngx-cookie-service';

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
  browserTrustFlag: boolean = false;

  constructor(
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.createLoginForm();
    this.getCookies();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      userEmailId: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required),
      rememberMe: new FormControl()
    });
  }

  createLoginPayload() {
    this.loginFormPayload = {
      "email": this.loginForm.controls['userEmailId'].value,
      "password": this.loginForm.controls['userPassword'].value
    }
  }

  setFormData(email: any, password: any) {
    this.loginForm = new FormGroup({
      userEmailId: new FormControl(email, [Validators.required, Validators.email]),
      userPassword: new FormControl(password, Validators.required),
      rememberMe: new FormControl()
    });
  }

  submitForm() {
    this.cdr.detectChanges();
    if (this.loginForm?.status == "INVALID") {
      this.openSnackbar("Please review form errors and correct them before submitting the form again !!!", "danger", 6000);
      this.validateFormErrors();
    }
    if (this.loginForm?.status == "VALID") {
      this.createLoginPayload();
      this.loginService.login(this.loginFormPayload.email, this.loginFormPayload.password).subscribe((data) => {
        this.setSessionStorage(data);
        this.setCookies();
        this.checkBrowserTrustFlag();
      }, (error) => {
        console.log("API Fails", error);
        let err = "Please review server errors and correct them before submitting the form again !!!  " + error.error.error;
        this.openSnackbar(err, "danger", 6000);
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

  checkBrowserTrustFlag() {
    let flagValue = localStorage.getItem("browser-trust-flag");
    if (flagValue == null) {
      this.browserTrustFlag = false;
      this.navigateToOtpVerification();
    } else if (flagValue == "trusted") {
      this.browserTrustFlag = true;
      this.navigateToDashboard();
    }
  }

  setSessionStorage(data: any) {
    sessionStorage.setItem("access-token", data.access_token);
    sessionStorage.setItem("refresh-token", data.refresh_token);
    sessionStorage.setItem("user-email", data.user_email);
    sessionStorage.setItem("user-name", data.user_name);
    sessionStorage.setItem("user-role", data.user_role);
  }

  generateOtp() {
    let emailId = sessionStorage.getItem("user-email");
    this.loginService.generateOtp(emailId).subscribe((data) => {
      console.log(data);
    })
  }

  setCookies() {
    let flag = this.loginForm.controls['rememberMe'].value;
    if (flag) {
      this.cookieService.set('user-email', this.loginFormPayload.username, 7); // Expires in 7 days
      this.cookieService.set('user-password', this.loginFormPayload.password, 7); // Expires in 7 days
    }
  }

  getCookies() {
    let userEmail = this.cookieService.get('user-email');
    let userPassword = this.cookieService.get('user-password');
    this.setFormData(userEmail, userPassword);
  }

  navigateToRegister() {
    this.router.navigate(["../auth/register"]);
  }

  navigateToDashboard() {
    this.openSnackbar("Login is successfull, you will be redirected to dashboard !!!", "success", 6000);
    setTimeout(() => {
      this.sharedService.refreshHeader();
      this.sharedService.refreshMenu();
      this.sharedService.refreshMain();
      this.router.navigate(["../ui-testing"]);
    }, 6000);
  }

  navigateToOtpVerification() {
    this.generateOtp();
    this.openSnackbar("OTP is generated succesfully, you will be redirected to OTP verification page !!!", "info", 6000);
    setTimeout(() => {
      this.router.navigate(["../auth/otp-verification"], {
        state: {
          rememberMeFlag: this.loginForm.controls['rememberMe'].value,
        }
      });
    }, 6000);
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
