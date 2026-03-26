import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, OtpRequest, SessionPayload, AuthTokenData } from '../models/auth.models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) { }

  login(userEmailId: string, password: string): Observable<LoginResponse> {
    const assetUrl = `${environment.apiGatewayService}/auth-login`;
    const body: LoginRequest = {
      email: userEmailId,
      password: password,
    };
    return this.http.post<LoginResponse>(assetUrl, body);
  }

  generateOtp(emailId: string): Observable<any> {
    const assetUrl = `${environment.notificationService}/v2/api/notifications/send`;
    const body: OtpRequest = {
      userEmail: emailId,
    };
    return this.http.post(assetUrl, body);
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  loginEvent(token: string) {
    sessionStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logoutEvent() {
    // Preserve theme if it exists
    const theme = localStorage.getItem('theme');
    const rememberMe = localStorage.getItem('rememberMeFlag');
    const remEmail = localStorage.getItem('rememberedEmail');
    const remPass = localStorage.getItem('rememberedPassword');

    localStorage.clear();
    sessionStorage.clear();
    this.cookieService.delete('refresh-token', '/');

    // Restore non-sensitive preferences
    if (theme) localStorage.setItem('theme', theme);
    if (rememberMe === 'Y') {
      localStorage.setItem('rememberMeFlag', 'Y');
      if (remEmail) localStorage.setItem('rememberedEmail', remEmail);
      if (remPass) localStorage.setItem('rememberedPassword', remPass);
    }

    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  storeSession(payload: SessionPayload): Observable<any> {
    const token =
      localStorage.getItem('access-token') || sessionStorage.getItem('token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Use specific session-store workflow ID
    return this.http.post(`${environment.apiGatewayService}/session-store`, payload, { headers: headers });
  }

  normalizeTokens(data: any): AuthTokenData | null {
    if (!data) return null;

    // Cases for nested data
    let tokenData = data.data && data.data.accessToken ? data.data : data;

    // Standard mapping with snake_case fallback
    return {
      accessToken: tokenData.accessToken || tokenData.access_token || '',
      refreshToken: tokenData.refreshToken || tokenData.refresh_token || '',
      email: tokenData.email || localStorage.getItem('user-email') || '',
      roleName: tokenData.roleName || tokenData.role_name || '',
      roleId: tokenData.roleId || tokenData.role_id || '',
    };
  }

  handleSsoLogin(data: any) {
    const normalized = this.normalizeTokens(data);
    if (!normalized || !normalized.accessToken) {
      console.error('handleSsoLogin: Failed to normalize or missing accessToken', data);
      return;
    }

    console.log('Handling SSO Login with normalized data:', normalized);

    // Storage logic
    localStorage.setItem('access-token', normalized.accessToken);
    if (normalized.email) localStorage.setItem('user-email', normalized.email);
    if (normalized.roleName) localStorage.setItem('user-role', normalized.roleName);
    if (normalized.roleId) localStorage.setItem('user-role-id', String(normalized.roleId));

    if (normalized.refreshToken) {
      localStorage.setItem('refresh-token', normalized.refreshToken);
      this.cookieService.set('refresh-token', normalized.refreshToken, {
        path: '/',
        sameSite: 'Strict',
      });
    }

    // Call session storage immediately
    const metadata = this.getClientMetadata();
    const sessionPayload: SessionPayload = {
      refreshToken: normalized.refreshToken,
      device: metadata.device,
      os: metadata.os,
      browser: metadata.browser,
      location: metadata.location,
    };

    this.storeSession(sessionPayload).subscribe({
      next: (res) => console.log('Session stored successfully', res),
      error: (err) => console.error('Failed to store session', err),
    });

    this.loginEvent(normalized.accessToken);
  }

  /**
   * Helper to gather client metadata from the browser
   */
  getClientMetadata(): Omit<SessionPayload, 'refreshToken'> {
    const userAgent = window.navigator.userAgent;

    return {
      device: this.getDeviceType(userAgent),
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      location: this.getTimezoneLocation(),
    };
  }

  // --- Helper Functions ---

  private getDeviceType(userAgent: string): string {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    return isMobile ? 'Mobile Device' : 'Desktop/Laptop';
  }

  private getOS(userAgent: string): string {
    if (userAgent.indexOf('Win') !== -1) return 'Windows';
    if (userAgent.indexOf('Mac') !== -1) return 'macOS';
    if (userAgent.indexOf('Linux') !== -1) return 'Linux';
    if (userAgent.indexOf('Android') !== -1) return 'Android';
    if (userAgent.indexOf('like Mac') !== -1) return 'iOS';
    return 'Unknown OS';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.indexOf('Firefox') !== -1) return 'Mozilla Firefox';
    if (userAgent.indexOf('SamsungBrowser') !== -1) return 'Samsung Internet';
    if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1)
      return 'Opera';
    if (userAgent.indexOf('Trident') !== -1)
      return 'Microsoft Internet Explorer';
    if (userAgent.indexOf('Edge') !== -1) return 'Microsoft Edge';
    if (userAgent.indexOf('Chrome') !== -1) return 'Google Chrome';
    if (userAgent.indexOf('Safari') !== -1) return 'Apple Safari';
    return 'Unknown Browser';
  }

  private getTimezoneLocation(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'Unknown Location';
    }
  }
}
