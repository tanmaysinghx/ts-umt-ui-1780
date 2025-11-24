import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../services/dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-dashboard-favorites',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-favorites.component.html',
  styleUrls: ['./dashboard-favorites.component.scss'],
})
export class DashboardFavoritesComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  darkMode: boolean = localStorage.getItem('theme') === 'dark';
  loadingAppId: string | null = null;

  appData: any[] = [];

  // favorites
  private readonly FAVORITES_KEY = 'favorite-apps';
  private favoriteAppIds = new Set<string>();

  constructor(
    private readonly commonService: CommonService,
    private readonly dashboardService: DashboardService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.getApplicationList();
  }

  // =========================
  // DATA + FILTERS
  // =========================

  getApplicationList(): void {
    this.dashboardService.getApplications().subscribe((data: any) => {
      if (data) {
        this.appData = data;
      }
    });
  }

  // Only favorites, then apply search + category
  filterApplications(): any[] {
    const q = this.searchQuery.trim().toLowerCase();

    return this.appData.filter((app) => {
      const id = String(app.id ?? '');
      if (!id || !this.favoriteAppIds.has(id)) {
        return false;
      }

      const matchesSearch =
        (app.title || '').toLowerCase().includes(q) ||
        (app.description || '').toLowerCase().includes(q);

      const matchesCategory = this.selectedCategory
        ? app.category === this.selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }

  get favoritesCount(): number {
    return this.appData.filter((app) =>
      this.favoriteAppIds.has(String(app.id ?? ''))
    ).length;
  }

  get runningFavoritesCount(): number {
    return this.appData.filter(
      (app) =>
        app.status === 'Running' &&
        this.favoriteAppIds.has(String(app.id ?? ''))
    ).length;
  }

  // =========================
  // FAVORITES
  // =========================

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (!stored) return;
    try {
      const ids: string[] = JSON.parse(stored);
      this.favoriteAppIds = new Set(ids);
    } catch {
      this.favoriteAppIds.clear();
    }
  }

  private saveFavorites(): void {
    localStorage.setItem(
      this.FAVORITES_KEY,
      JSON.stringify(Array.from(this.favoriteAppIds))
    );
  }

  isFavorite(app: any): boolean {
    return this.favoriteAppIds.has(String(app?.id ?? ''));
  }

  toggleFavorite(app: any): void {
    const id = String(app?.id ?? '');
    if (!id) return;

    if (this.favoriteAppIds.has(id)) {
      this.favoriteAppIds.delete(id);
    } else {
      this.favoriteAppIds.add(id);
    }

    this.saveFavorites();
    // No extra logic needed; filterApplications() will drop items that are no longer favorites
  }

  // =========================
  // UI
  // =========================

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  // =========================
  // LAUNCH FLOW (same as dashboard)
  // =========================

  async launchApp(app: any): Promise<void> {
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
      this.openApp(app, accessToken!, refreshToken, email);
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
  ): void {
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

    console.log('Final App URL (Favorites):', url);

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

  private handleLaunchFailure(app: any, message: string): void {
    app.status = message;
    this.loadingAppId = null;
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user-email');
    this.cookieService.delete('refresh-token');
  }
}