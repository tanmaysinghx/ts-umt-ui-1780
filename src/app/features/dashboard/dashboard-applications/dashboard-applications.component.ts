import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../services/dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';

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

  // === FAVORITES CORE ===
  private readonly FAVORITES_KEY = 'favorite-apps';
  private favoriteAppIds = new Set<string>();

  constructor(
    private readonly commonService: CommonService,
    private readonly dashboardService: DashboardService,
    private readonly cookieService: CookieService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.loadFavorites();
    this.getApplicationList();
  }

  // =========================
  // APPLICATION DATA
  // =========================

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
        app.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedCategory ? app.category === this.selectedCategory : true)
    );
  }

  get runningAppsCount(): number {
    return this.appData.filter((app) => app.status === 'Running').length;
  }

  // =========================
  // FAVORITES LOGIC
  // =========================

  private loadFavorites() {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (stored) {
      const ids = JSON.parse(stored);
      this.favoriteAppIds = new Set(ids);
    }
  }

  private saveFavorites() {
    localStorage.setItem(
      this.FAVORITES_KEY,
      JSON.stringify(Array.from(this.favoriteAppIds))
    );
  }

  isFavorite(app: any): boolean {
    return this.favoriteAppIds.has(String(app.id));
  }

  toggleFavorite(app: any) {
    const id = String(app.id);

    if (this.favoriteAppIds.has(id)) {
      this.favoriteAppIds.delete(id);
    } else {
      this.favoriteAppIds.add(id);
    }

    this.saveFavorites();
  }

  // =========================
  // UI CONTROL
  // =========================

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  // =========================
  // APP LAUNCH FLOW
  // =========================

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
        try {
          accessToken = await this.refreshAccessToken(refreshToken);
        } catch {
          this.handleLaunchFailure(app, 'Failed to Launch (Invalid Token)');
          return;
        }
      }
    }

    setTimeout(() => {
      app.status = 'Running';
      this.loadingAppId = null;
      this.openApp(app, accessToken!, refreshToken, email);
    }, 3500);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return !decoded.exp || decoded.exp < now;
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
            const token = data?.data?.downstreamResponse?.data?.accessToken;
            if (token) {
              localStorage.setItem('access-token', token);
              resolve(token);
            } else reject('Failed');
          },
          error: () => reject('Failed'),
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
    // Construct the launcher URL
    const launcherUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/auth/launch'], {
        queryParams: {
          target: app.appUrl,
          name: app.title,
          method: app.launchMethod || 'GET' // Default to GET given current behavior, can be 'POST'
        }
      })
    );

    // Open in new tab
    window.open(launcherUrl, '_blank');
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
}