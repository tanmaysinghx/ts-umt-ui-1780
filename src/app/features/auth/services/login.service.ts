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
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
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

  handleSsoLogin(data: AuthTokenData) {
    if (!data) {
      console.error('No auth data provided to handleSsoLogin');
      return;
    }

    console.log('Handling SSO Login with data:', data);

    // Ensure we are storing strings
    if (data.accessToken) localStorage.setItem('access-token', data.accessToken);
    if (data.email) localStorage.setItem('user-email', data.email);
    if (data.roleName) localStorage.setItem('user-role', data.roleName);
    if (data.roleId) localStorage.setItem('user-role-id', String(data.roleId)); // Ensure string

    // Store in both localStorage (for SsoLauncher in new tabs) and Cookie
    if (data.refreshToken) {
      localStorage.setItem('refresh-token', data.refreshToken);
      this.cookieService.set('refresh-token', data.refreshToken, {
        path: '/',
        sameSite: 'Strict',
      });
    }

    // Call session storage immediately after tokens are safe
    // We construct the payload here since we are in the service
    const metadata = this.getClientMetadata();
    const sessionPayload: SessionPayload = {
      refreshToken: data.refreshToken,
      device: metadata.device,
      os: metadata.os,
      browser: metadata.browser,
      location: metadata.location,
    };

    console.log('Triggering session store with payload:', sessionPayload);
    this.storeSession(sessionPayload).subscribe({
      next: (res) => console.log('Session stored successfully', res),
      error: (err) => console.error('Failed to store session', err),
    });

    if (data.accessToken) {
      this.loginEvent(data.accessToken);
    }
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
