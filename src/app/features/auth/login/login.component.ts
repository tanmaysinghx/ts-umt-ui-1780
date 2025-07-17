import { ChangeDetectorRef, Component } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { CryptoService } from '../../../shared/services/crypto.service';

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
    private readonly loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly cookieService: CookieService
  ) { }

  ngOnInit() {
    this.createLoginForm();
    if (localStorage.getItem("rememberMeFlag") == "Y") { this.getFormDataFromLocalStorage() }
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
      rememberMe: new FormControl(true)
    });
  }

  getFormDataFromLocalStorage() {
    const emailEncrypted = localStorage.getItem('rememberedEmail');
    const passwordEncrypted = localStorage.getItem('rememberedPassword');
    if (emailEncrypted && passwordEncrypted) {
      this.setFormData(CryptoService.decrypt(emailEncrypted), CryptoService.decrypt(passwordEncrypted));
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
      if (this.loginForm.value.rememberMe) { this.rememberMe() }
      let browserTrustStatus = this.checkBrowserTrustFlag(this.loginFormPayload.email) ?? false;
      if (browserTrustStatus) {
        /* Will call a workflow without otp  -- todo */
        this.loginService.login(this.loginFormPayload.email, this.loginFormPayload.password).subscribe((data) => {
          if (data.success) {
            if (data?.otpGenerated) {
              this.navigateToOtpVerification(data?.transactionId);
            }
          }
        }, (error) => {
          let err = "Please review server errors and correct them before submitting the form again !!!  " + error.error.error;
          this.openSnackbar(err, "danger", 5000);
        })
        /* to do */
      } else {
        this.loginService.login(this.loginFormPayload.email, this.loginFormPayload.password).subscribe((data) => {
          if (data.success) {
            if (data?.otpGenerated) {
              this.navigateToOtpVerification(data?.transactionId);
            } else if (!data?.otpGenerated) {
              this.setSessionStorage(data);
            }
          }
        }, (error) => {
          let err = "Please review server errors and correct them before submitting the form again !!!  " + error.error.error;
          this.openSnackbar(err, "danger", 5000);
        })
      }

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

  checkBrowserTrustFlag(email: string): Boolean {
    let flagValue = localStorage.getItem("browser-trust-flag");
    let trustedEmails = JSON.parse(localStorage.getItem("trusted-emails") || "[]");
    if (flagValue === null) {
      this.browserTrustFlag = false;
      return false;
    } else if (flagValue === "trusted" && trustedEmails.includes(email)) {
      this.browserTrustFlag = true;
      return true;
    } else {
      this.browserTrustFlag = false;
      return false;
    }
  }

  setSessionStorage(data: any) {
    sessionStorage.setItem("access-token", data?.data?.accessToken);
    sessionStorage.setItem("refresh-token", data?.data?.refreshToken);
    sessionStorage.setItem("user-email", data?.data?.email);
    sessionStorage.setItem("user-role", data?.data?.roleName);
    sessionStorage.setItem("user-role-id", data?.data?.roleId);
  }

  navigateToRegister() {
    this.router.navigate(["../auth/register"]);
  }

  navigateToDashboard() {
    this.openSnackbar("Login is successfull, you will be redirected to dashboard !!!", "success", 5000);
    setTimeout(() => {
      this.loginService.loginEvent(sessionStorage.getItem("access-token") ?? "");
      this.router.navigate(["../dashboard/applications"]);
    }, 5000);
  }

  navigateToOtpVerification(transactionId: any) {
    this.openSnackbar("OTP is generated succesfully, you will be redirected to OTP verification page !!!", "info", 5000);
    setTimeout(() => {
      this.router.navigate(["../auth/otp-verification"], {
        state: {
          rememberMeFlag: this.loginForm.controls['rememberMe'].value,
          transactionId: transactionId,
          emailId: this.loginForm.controls['userEmailId'].value,
        }
      });
    }, 5000);
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

  rememberMe() {
    localStorage.setItem("rememberMeFlag", "Y");
    const encryptedEmail = CryptoService.encrypt(this.loginForm.controls['userEmailId'].value);
    const encryptedPassword = CryptoService.encrypt(this.loginForm.controls['userPassword'].value);
    localStorage.setItem("rememberedEmail", encryptedEmail);
    localStorage.setItem("rememberedPassword", encryptedPassword);
    let trustedEmailsArray = JSON.parse(localStorage.getItem("trusted-emails") || "[]");
    trustedEmailsArray.push(this.loginForm.controls['userEmailId'].value);
    localStorage.setItem("trusted-emails", JSON.stringify(trustedEmailsArray));
  }

}
