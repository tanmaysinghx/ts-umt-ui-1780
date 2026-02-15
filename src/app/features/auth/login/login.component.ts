import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { CryptoService } from '../../../shared/services/crypto.service';
import { CommonService } from '../../services/common.service';
import { LoginResponse, SessionPayload } from '../models/auth.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SnackbarDetailedComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag = false;
  loginForm!: FormGroup;
  loginFormPayload: any;
  browserTrustFlag = false;

  constructor(
    private readonly loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly cookieService: CookieService,
    private readonly commonService: CommonService
  ) { }

  ngOnInit() {
    this.createLoginForm();
    const refreshToken = this.cookieService.get('refresh-token');
    if (refreshToken) {
      this.generateNewJWTToken(refreshToken);
    }
    if (localStorage.getItem('rememberMeFlag') === 'Y') {
      this.getFormDataFromLocalStorage();
    }
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      userEmailId: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required),
      rememberMe: new FormControl(false),
    });
  }

  createLoginPayload() {
    this.loginFormPayload = {
      email: this.loginForm.controls['userEmailId'].value,
      password: this.loginForm.controls['userPassword'].value,
    };
  }

  setFormData(email: any, password: any) {
    this.loginForm.setValue({
      userEmailId: email,
      userPassword: password,
      rememberMe: true,
    });
  }

  getFormDataFromLocalStorage() {
    const emailEncrypted = localStorage.getItem('rememberedEmail');
    const passwordEncrypted = localStorage.getItem('rememberedPassword');
    if (emailEncrypted && passwordEncrypted) {
      this.setFormData(
        CryptoService.decrypt(emailEncrypted),
        CryptoService.decrypt(passwordEncrypted)
      );
    }
  }

  submitForm() {
    this.cdr.detectChanges();
    if (this.loginForm?.invalid) {
      this.openSnackbar(
        'Please correct errors before submitting.',
        'danger',
        6000
      );
      this.validateFormErrors();
      return;
    }

    this.createLoginPayload();
    this.checkBrowserTrustFlag(this.loginFormPayload.email);

    this.loginService
      .login(this.loginFormPayload.email, this.loginFormPayload.password)
      .subscribe({
        next: (data: LoginResponse) => {
          // ✅ FIX 1: Check downstream success, not just workflow success
          const downstream = data?.data?.downstreamResponse;

          if (data.success && downstream?.success) {
            if (data?.configSummary?.otpFlow) {
              this.navigateToOtpVerification(data?.transactionId);
            } else {
              // Now we know downstream.data exists
              this.storeTokens(downstream.data);

              if (this.loginForm.value.rememberMe) {
                this.rememberMe();
              } else {
                localStorage.removeItem('rememberMeFlag');
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
              }

              this.navigateToDashboard();
            }
          } else {
            // Pass the downstream error if available
            this.handleLoginFailure({
              error: { error: downstream?.error || 'Unknown Error' },
            });
          }
        },
        error: (error) => {
          this.handleLoginFailure(error);
        },
      });
  }

  /**
   * Captures Refresh Token and Browser Metadata
   * Calls the Session API
   */
  storeSessionData() {
    // ✅ FIX 2: Get from CookieService (where storeTokens put it), not LocalStorage
    const refreshToken = this.cookieService.get('refresh-token');

    if (!refreshToken) {
      console.warn('No refresh token found, skipping session storage.');
      return;
    }

    // 2. Get Actual Client Metadata from Service
    const metadata = this.loginService.getClientMetadata();

    // 3. Prepare Payload
    const sessionPayload: SessionPayload = {
      refreshToken: refreshToken,
      device: metadata.device,
      os: metadata.os,
      browser: metadata.browser,
      location: metadata.location,
    };

    console.log('Storing Session Data:', sessionPayload);

    // 4. Call API
    this.loginService.storeSession(sessionPayload).subscribe({
      next: (res: any) => console.log('Session stored successfully', res),
      error: (err: any) => console.error('Failed to store session', err),
    });
  }

  private handleLoginFailure(error?: any) {
    // Improved error parsing based on your structure
    const err =
      'Login failed: ' +
      (error?.error?.error || 'Invalid credentials or server error');
    this.openSnackbar(err, 'danger', 5000);
    // Do not clear rememberMe flags on simple password error, usually bad UX
  }

  validateFormErrors() {
    if (this.loginForm.controls['userEmailId']?.invalid) {
      if (this.loginForm.controls['userEmailId'].hasError('required')) {
        this.loginForm.controls['userEmailId'].setErrors({
          customError: 'EMAIL_REQUIRED',
        });
      } else if (this.loginForm.controls['userEmailId'].hasError('email')) {
        this.loginForm.controls['userEmailId'].setErrors({
          customError: 'EMAIL_INCORRECT',
        });
      }
    }

    if (this.loginForm.controls['userPassword']?.invalid) {
      if (this.loginForm.controls['userPassword'].hasError('required')) {
        this.loginForm.controls['userPassword'].setErrors({
          customError: 'PASSWORD_REQUIRED',
        });
      }
    }
  }

  checkBrowserTrustFlag(email: string): boolean {
    const flagValue = localStorage.getItem('browser-trust-flag');
    const trustedEmails = JSON.parse(
      localStorage.getItem('trusted-emails') || '[]'
    );
    if (flagValue === 'trusted' && trustedEmails.includes(email)) {
      this.browserTrustFlag = true;
      return true;
    }
    this.browserTrustFlag = false;
    return false;
  }

  private storeTokens(data: any) {
    if (!data) {
      console.error('storeTokens: No data received!');
      return;
    }

    console.log('storeTokens: Raw data received:', JSON.stringify(data));

    // The backend may return tokens at different nesting levels.
    // Try to find the actual token data.
    let tokenData = data;

    // If data has a nested 'data' property (double-wrapped response), unwrap it
    if (data.data && data.data.accessToken) {
      tokenData = data.data;
      console.log('storeTokens: Unwrapped nested data.data');
    }

    // If tokens are at the top level of the response
    if (tokenData.accessToken) {
      console.log('storeTokens: Found accessToken, delegating to handleSsoLogin');
      this.loginService.handleSsoLogin(tokenData);
    } else {
      // Last resort: try to find tokens anywhere in the object
      console.error('storeTokens: No accessToken found in data!', tokenData);
      console.error('storeTokens: Available keys:', Object.keys(tokenData));

      // Attempt with snake_case keys (some backends return snake_case)
      if (tokenData.access_token) {
        const normalized = {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || '',
          email: tokenData.email || localStorage.getItem('user-email') || '',
          roleName: tokenData.role_name || tokenData.roleName || '',
          roleId: tokenData.role_id || tokenData.roleId || '',
        };
        console.log('storeTokens: Found snake_case tokens, normalizing:', normalized);
        this.loginService.handleSsoLogin(normalized);
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['../auth/register']);
  }

  navigateToDashboard() {
    this.openSnackbar('Login successful! Redirecting...', 'success', 5000);
    setTimeout(() => {
      this.router.navigate(['/dashboard/applications']);
    }, 2000);
  }

  navigateToOtpVerification(transactionId: any) {
    this.openSnackbar('OTP generated. Redirecting...', 'info', 5000);
    setTimeout(() => {
      this.router.navigate(['../auth/otp-verification'], {
        state: {
          rememberMeFlag: this.loginForm.controls['rememberMe'].value,
          transactionId: transactionId,
          emailId: this.loginForm.controls['userEmailId'].value,
        },
      });
    }, 2000);
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
    localStorage.setItem('rememberMeFlag', 'Y');
    const encryptedEmail = CryptoService.encrypt(
      this.loginForm.controls['userEmailId'].value
    );
    const encryptedPassword = CryptoService.encrypt(
      this.loginForm.controls['userPassword'].value
    );
    localStorage.setItem('rememberedEmail', encryptedEmail);
    localStorage.setItem('rememberedPassword', encryptedPassword);
    const trustedEmailsArray = JSON.parse(
      localStorage.getItem('trusted-emails') || '[]'
    );
    if (
      !trustedEmailsArray.includes(this.loginForm.controls['userEmailId'].value)
    ) {
      trustedEmailsArray.push(this.loginForm.controls['userEmailId'].value);
    }
    localStorage.setItem('trusted-emails', JSON.stringify(trustedEmailsArray));
  }

  generateNewJWTToken(refreshToken: string) {
    console.log('Existing Refresh Token Found', refreshToken);
    this.commonService
      .generateJWTTokenBasedOnRefreshToken(refreshToken)
      .subscribe({
        next: (data) => {
          if (data?.data?.downstreamResponse?.data?.accessToken) {
            console.log('New JWT Token Generated Successfully');
            this.storeTokens(data.data.downstreamResponse.data);
            // loginEvent handled in storeTokens -> handleSsoLogin
            this.router.navigate(['/dashboard/applications']);
          } else {
            this.handleSessionExpiry();
          }
        },
        error: () => {
          this.handleSessionExpiry();
        },
      });
  }

  private handleSessionExpiry() {
    this.openSnackbar(
      'Your session has expired, please login again !!!',
      'danger',
      6000
    );
    localStorage.clear();
    this.cookieService.deleteAll();
    this.router.navigate(['../auth/login']);
  }

  loginWithGoogle() {
    // Redirect to backend Google OAuth2 endpoint
    window.location.href = environment.ssoGoogleUrl;
  }
}
