import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss'],
})
export class SecuritySettingsComponent implements OnInit {
  darkMode: boolean = localStorage.getItem('theme') === 'dark';

  loading = false;
  errorMessage: string | null = null;

  // Summary metrics (you can wire from API later)
  mfaEnabled = true;
  trustedDeviceCount = 3;
  lastSecurityReview = new Date().toISOString();

  // MFA section
  mfaEmail = true;
  mfaSms = false;
  mfaAuthenticatorApp = true;
  mfaRequiredForAllLogins = true;

  // Login alerts / anomaly detection
  alertNewDevice = true;
  alertNewLocation = true;
  alertFailedAttempts = true;
  alertEmail = true;
  alertPush = false;

  // Session & device controls
  autoLogoutEnabled = true;
  autoLogoutMinutes = 30;
  browserTrustEnabled = true;
  maxActiveSessions = 10;

  // Password & sign-in methods
  allowPasswordLogin = true;
  allowSocialLogin = true;
  passwordStrengthPolicy: 'standard' | 'strong' | 'strict' = 'strong';
  passwordRotationDays = 90;

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
    // later: load security settings from backend
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  refreshFromServer(): void {
    this.loading = true;
    this.errorMessage = null;

    // plug API call here later
    setTimeout(() => {
      this.loading = false;
      // simulate success / failure as needed
    }, 800);
  }

  saveAll(): void {
    this.loading = true;
    this.errorMessage = null;

    const payload = {
      mfa: {
        enabled: this.mfaEnabled,
        email: this.mfaEmail,
        sms: this.mfaSms,
        authenticatorApp: this.mfaAuthenticatorApp,
        requiredForAllLogins: this.mfaRequiredForAllLogins,
      },
      alerts: {
        newDevice: this.alertNewDevice,
        newLocation: this.alertNewLocation,
        failedAttempts: this.alertFailedAttempts,
        email: this.alertEmail,
        push: this.alertPush,
      },
      sessions: {
        autoLogoutEnabled: this.autoLogoutEnabled,
        autoLogoutMinutes: this.autoLogoutMinutes,
        browserTrustEnabled: this.browserTrustEnabled,
        maxActiveSessions: this.maxActiveSessions,
      },
      signIn: {
        allowPasswordLogin: this.allowPasswordLogin,
        allowSocialLogin: this.allowSocialLogin,
        passwordStrengthPolicy: this.passwordStrengthPolicy,
        passwordRotationDays: this.passwordRotationDays,
      },
    };

    console.log('Security settings payload', payload);

    // wire to API later
    setTimeout(() => {
      this.loading = false;
      this.lastSecurityReview = new Date().toISOString();
    }, 800);
  }

  resetToDefaults(): void {
    // you can tune default values here
    this.mfaEnabled = true;
    this.mfaEmail = true;
    this.mfaSms = false;
    this.mfaAuthenticatorApp = true;
    this.mfaRequiredForAllLogins = true;

    this.alertNewDevice = true;
    this.alertNewLocation = true;
    this.alertFailedAttempts = true;
    this.alertEmail = true;
    this.alertPush = false;

    this.autoLogoutEnabled = true;
    this.autoLogoutMinutes = 30;
    this.browserTrustEnabled = true;
    this.maxActiveSessions = 10;

    this.allowPasswordLogin = true;
    this.allowSocialLogin = true;
    this.passwordStrengthPolicy = 'strong';
    this.passwordRotationDays = 90;
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }
}