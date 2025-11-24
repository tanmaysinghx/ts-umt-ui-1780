import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile-password-change.component.html',
  styleUrl: './my-profile-password-change.component.scss',
})
export class MyProfilePasswordChangeComponent implements OnInit {
  darkMode: boolean = localStorage.getItem('theme') === 'dark';

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Password policy
  policyDays = 30;

  // Demo: last changed 10 days ago – replace with value from backend
  lastChangedAt: string = new Date(
    Date.now() - 10 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Form model
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI toggles
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
    // TODO: load lastChangedAt and policyDays from API
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  refresh(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // TODO: call backend for latest lastChangedAt/policy
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  get daysSinceChange(): number {
    if (!this.lastChangedAt) return 0;
    const last = new Date(this.lastChangedAt).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 0 : diffDays;
  }

  get daysUntilExpiry(): number {
    const remaining = this.policyDays - this.daysSinceChange;
    return remaining < 0 ? 0 : remaining;
  }

  get isExpired(): boolean {
    return this.daysSinceChange >= this.policyDays;
  }

  get statusLabel(): string {
    if (this.isExpired) return 'Expired';
    if (this.daysUntilExpiry <= 5) return 'Due soon';
    return 'Healthy';
  }

  get statusChipClass(): string {
    if (this.isExpired) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
    if (this.daysUntilExpiry <= 5) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  validateNewPassword(): string | null {
    if (!this.newPassword) return 'New password is required.';
    if (this.newPassword.length < 8)
      return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(this.newPassword))
      return 'Include at least one uppercase letter.';
    if (!/[a-z]/.test(this.newPassword))
      return 'Include at least one lowercase letter.';
    if (!/[0-9]/.test(this.newPassword)) return 'Include at least one digit.';
    return null;
  }

  submitChange(): void {
    this.clearMessages();

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage =
        'Current, new, and confirm password are all required.';
      return;
    }

    const policyError = this.validateNewPassword();
    if (policyError) {
      this.errorMessage = policyError;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.errorMessage =
        'New password must be different from current password.';
      return;
    }

    this.loading = true;

    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    console.log('Change password payload', payload); // hook to API

    // TODO: replace with real API call
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Password changed successfully.';
      this.lastChangedAt = new Date().toISOString();
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }, 1000);
  }

  resetForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.clearMessages();
  }
}
