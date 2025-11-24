import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../services/dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-dashboard-applications',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-applications.component.html',
  styleUrls: ['./dashboard-applications.component.scss'],
})
export class DashboardApplicationsComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  darkMode: boolean = localStorage.getItem('theme') === 'dark';
  loadingAppId: string | null = null;

  appData: any[] = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly dashboardService: DashboardService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit() {
    this.getApplicationList();
  }

  getApplicationList() {
    this.dashboardService.getApplications().subscribe((data: any) => {
      if (data) {
        this.appData = data;
      }
    });
  }

  filterApplications() {
    return this.appData.filter(
      (app) =>
        app.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedCategory ? app.category === this.selectedCategory : true)
    );
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  async launchApp(app: any) {
    if (this.loadingAppId) return;
    this.loadingAppId = app.id;
    app.status = 'Starting...';
    const refreshToken = this.cookieService.get('refresh-token');
    if (!refreshToken) {
      this.handleLaunchFailure(app, 'Failed to Launch (No Refresh Token)');
      return;
    }
    let accessToken = localStorage.getItem('access-token');
    const email = localStorage.getItem('user-email') || '';
    setTimeout(() => (app.status = 'Checking session...'), 500);
    if (!accessToken || this.isTokenExpired(accessToken)) {
      setTimeout(() => (app.status = 'Refreshing token...'), 1200);
      try {
        accessToken = await this.refreshAccessToken(refreshToken);
      } catch {
        this.handleLaunchFailure(app, 'Failed to Launch (Session Expired)');
        return;
      }
    } else {
      setTimeout(() => (app.status = 'Validating token with server...'), 1200);
      const isValid = await this.checkTokenValidity(accessToken);
      if (!isValid) {
        setTimeout(() => (app.status = 'Requesting new access token...'), 1800);
        try {
          accessToken = await this.refreshAccessToken(refreshToken);
        } catch {
          this.handleLaunchFailure(app, 'Failed to Launch (Invalid Token)');
          return;
        }
      }
    }
    setTimeout(() => (app.status = 'Preparing secure environment...'), 2000);
    setTimeout(() => (app.status = 'Syncing user profile...'), 2600);
    setTimeout(() => (app.status = 'Finalizing connection...'), 3200);
    setTimeout(() => {
      app.status = 'Running';
      this.loadingAppId = null;
      this.openApp(app, accessToken, refreshToken, email);
    }, 4000);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded?.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  private refreshAccessToken(refreshToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.commonService
        .generateJWTTokenBasedOnRefreshToken(refreshToken)
        .subscribe({
          next: (data: any) => {
            const newAccessToken =
              data?.data?.downstreamResponse?.data?.accessToken;
            console.log('Refreshed Access Token:', newAccessToken);
            if (data?.success && newAccessToken) {
              localStorage.setItem('access-token', newAccessToken);
              resolve(newAccessToken);
            } else {
              reject('Refresh failed');
            }
          },
          error: () => reject('Refresh failed'),
        });
    });
  }

  private checkTokenValidity(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.commonService.checkJWTTokenIsValid(token).subscribe({
        next: (isValid: boolean) => resolve(isValid),
        error: () => resolve(false),
      });
    });
  }

  private openApp(
    app: any,
    accessToken: string,
    refreshToken: string,
    email: string
  ) {
    let baseUrl = app.appUrl.replace(
      /([?&])(token|accessToken|refreshToken|userEmail)=[^&]*/g,
      ''
    );
    baseUrl = baseUrl.replace(/[?&]$/, '');
    const separator = baseUrl.includes('?') ? '&' : '?';
    const url =
      baseUrl +
      `${separator}accessToken=${encodeURIComponent(
        accessToken
      )}&refreshToken=${encodeURIComponent(
        refreshToken
      )}&userEmail=${encodeURIComponent(email)}`;
    console.log('Final App URL:', url);
    app.status = 'Preparing to Launch...';
    setTimeout(() => {
      app.status = 'Running';
      this.loadingAppId = null;
    }, 2000);
    setTimeout(() => {
      if (app.status === 'Running') {
        window.open(url, '_blank');
      }
    }, 4000);
  }

  private handleLaunchFailure(app: any, message: string) {
    app.status = message;
    this.loadingAppId = null;
    this.clearSession();
  }

  private clearSession() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user-email');
    this.cookieService.delete('refresh-token');
  }

  get runningAppsCount(): number {
    return this.appData.filter((app) => app.status === 'Running').length;
  }
}
