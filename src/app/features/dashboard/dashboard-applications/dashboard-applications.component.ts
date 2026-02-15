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

  // === FAVORITES CORE ===
  private readonly FAVORITES_KEY = 'favorite-apps';
  private favoriteAppIds = new Set<string>();

  constructor(
    private readonly commonService: CommonService,
    private readonly dashboardService: DashboardService,
    private readonly cookieService: CookieService
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
    app.status = 'Initializing...';

    const refreshToken = this.cookieService.get('refresh-token');
    if (!refreshToken) {
      this.handleLaunchFailure(app, 'Failed to Launch (No Refresh Token)');
      return;
    }

    let accessToken = localStorage.getItem('access-token');
    const email = localStorage.getItem('user-email') || '';

    // Step 1: Check session
    await this.delay(800);
    app.status = 'Checking session...';

    if (!accessToken || this.isTokenExpired(accessToken)) {
      await this.delay(600);
      app.status = 'Refreshing token...';
      try {
        accessToken = await this.refreshAccessToken(refreshToken);
      } catch {
        this.handleLaunchFailure(app, 'Failed to Launch (Session Expired)');
        return;
      }
    } else {
      await this.delay(600);
      app.status = 'Validating token...';
      const isValid = await this.checkTokenValidity(accessToken);
      if (!isValid) {
        try {
          app.status = 'Requesting new token...';
          accessToken = await this.refreshAccessToken(refreshToken);
        } catch {
          this.handleLaunchFailure(app, 'Failed to Launch (Invalid Token)');
          return;
        }
      }
    }

    // Step 2: Preparing
    await this.delay(800);
    app.status = 'Preparing secure environment...';

    // Step 3: Syncing
    await this.delay(800);
    app.status = 'Syncing user profile...';

    // Step 4: Finalizing
    await this.delay(800);
    app.status = 'Launching...';

    // Step 5: Open the app directly
    await this.delay(700);
    app.status = 'Running';
    this.loadingAppId = null;
    this.openApp(app, accessToken!, refreshToken, email);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    const url = app.appUrl;
    if (!url) return;

    if (app.launchMethod === 'POST') {
      // POST handoff via hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = '_blank';
      form.style.display = 'none';

      const fields: Record<string, string> = { accessToken, refreshToken, email };
      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      // GET handoff
      const separator = url.includes('?') ? '&' : '?';
      const finalUrl = `${url}${separator}accessToken=${accessToken}&refreshToken=${refreshToken}&userEmail=${email}`;
      window.open(finalUrl, '_blank');
    }
  }

  private handleLaunchFailure(app: any, message: string) {
    app.status = message;
    this.loadingAppId = null;
    this.clearSession();
  }

  private clearSession() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user-email');
    localStorage.removeItem('refresh-token');
    this.cookieService.delete('refresh-token');
  }
}