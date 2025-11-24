import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  darkMode: boolean = localStorage.getItem('theme') === 'dark';

  loading = false;
  errorMessage: string | null = null;

  account = {
    accountId: 'ACC-123456',
    primaryEmail: 'you@example.com',
    secondaryEmail: '',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    region: 'IN',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat24h: true,
  };

  // communication prefs
  notificationPrefs = {
    productUpdates: true,
    featureAnnouncements: true,
    securityEmails: true,
    marketingEmails: false,
    weeklySummary: true,
  };

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
    // later: load from backend
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  refreshAccount(): void {
    this.loading = true;
    this.errorMessage = null;
    // TODO: API
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  saveAccount(): void {
    this.loading = true;
    this.errorMessage = null;

    const payload = {
      account: { ...this.account },
      notifications: { ...this.notificationPrefs },
    };
    console.log('Account settings payload', payload);

    // TODO: API
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  resetAccount(): void {
    // in real-world, reload from server snapshot
    this.account.timezone = 'Asia/Kolkata';
    this.account.language = 'en';
    this.account.region = 'IN';
    this.account.dateFormat = 'DD/MM/YYYY';
    this.account.timeFormat24h = true;

    this.notificationPrefs = {
      productUpdates: true,
      featureAnnouncements: true,
      securityEmails: true,
      marketingEmails: false,
      weeklySummary: true,
    };
  }

  deactivateAccount(): void {
    if (!confirm('Are you sure you want to deactivate your account?')) return;
    console.log('Deactivate account requested');
    // TODO: call API
  }

  deleteAccount(): void {
    if (!confirm('This will permanently delete your account. Continue?'))
      return;
    console.log('Delete account requested');
    // TODO: call API
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }
}
