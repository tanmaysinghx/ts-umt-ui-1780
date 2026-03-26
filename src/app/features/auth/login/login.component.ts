import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CryptoService } from '../../../shared/services/crypto.service';
import { CommonService } from '../../services/common.service';
import { environment } from '../../../../environments/environment';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SnackbarDetailedComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly commonService: CommonService,
    public readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkAutoLogin();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      userEmailId: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required),
      rememberMe: new FormControl(false),
    });

    if (localStorage.getItem('rememberMeFlag') === 'Y') {
      this.fillRememberedData();
    }
  }

  private checkAutoLogin() {
    const refreshToken = this.cookieService.get('refresh-token');
    if (refreshToken) {
      this.refreshSession(refreshToken);
    }
  }

  private fillRememberedData() {
    const emailEnc = localStorage.getItem('rememberedEmail');
    const passEnc = localStorage.getItem('rememberedPassword');
    if (emailEnc && passEnc) {
      this.loginForm.patchValue({
        userEmailId: CryptoService.decrypt(emailEnc),
        userPassword: CryptoService.decrypt(passEnc),
        rememberMe: true,
      });
    }
  }

  submitForm() {
    if (this.loginForm.invalid) {
      this.snackbarService.show('Please fill in all required fields correctly.', 'danger');
      this.loginForm.markAllAsTouched();
      return;
    }

    const { userEmailId, userPassword, rememberMe } = this.loginForm.value;

    this.loginService.login(userEmailId, userPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const downstream = res?.data?.downstreamResponse;
          if (res.success && downstream?.success) {
            if (res.configSummary?.otpFlow) {
              this.handleOtpFlow(res.transactionId, userEmailId, rememberMe);
            } else {
              this.loginService.handleSsoLogin(downstream.data);
              this.handleRememberMe(userEmailId, userPassword, rememberMe);
              this.router.navigate(['/dashboard/applications']);
              this.snackbarService.show('Login successful! Redirecting...', 'success');
            }
          } else {
            this.snackbarService.show(downstream?.error || 'Invalid credentials', 'danger');
          }
        },
        error: (err) => this.snackbarService.show(err?.error?.error || 'Server error, please try again later.', 'danger')
      });
  }

  private handleOtpFlow(transactionId: string | undefined, email: string, rememberMe: boolean) {
    if (!transactionId) {
      this.snackbarService.show('Error: Transaction ID missing for OTP.', 'danger');
      return;
    }
    this.snackbarService.show('OTP required for verification.', 'info');
    this.router.navigate(['../auth/otp-verification'], {
      state: { transactionId, emailId: email, rememberMeFlag: rememberMe }
    });
  }

  private handleRememberMe(email: string, pass: string, remember: boolean) {
    if (remember) {
      localStorage.setItem('rememberMeFlag', 'Y');
      localStorage.setItem('rememberedEmail', CryptoService.encrypt(email));
      localStorage.setItem('rememberedPassword', CryptoService.encrypt(pass));
    } else {
      localStorage.removeItem('rememberMeFlag');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
  }

  private refreshSession(token: string) {
    this.commonService.generateJWTTokenBasedOnRefreshToken(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const data = res?.data?.downstreamResponse?.data;
          if (data?.accessToken) {
            this.loginService.handleSsoLogin(data);
            this.router.navigate(['/dashboard/applications']);
          } else {
            this.sessionExpired();
          }
        },
        error: () => this.sessionExpired()
      });
  }

  private sessionExpired() {
    localStorage.clear();
    this.cookieService.deleteAll();
    this.snackbarService.show('Your session has expired, please login again.', 'danger');
  }

  loginWithGoogle() {
    window.location.href = environment.ssoGoogleUrl;
  }

  navigateToRegister() {
    this.router.navigate(['../auth/register']);
  }
}
