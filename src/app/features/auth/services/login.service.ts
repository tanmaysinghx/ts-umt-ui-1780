import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ Import HttpHeaders
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  private readonly API_URL =
    'http://localhost:1625/v2/api/sessions/store-session';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(userEmailId: string, password: string): Observable<any> {
    let assetUrl =
      environment.apiGatewayService +
      '/trigger-workflow/WF1625E10001?apiEndpoint=/v2/api/auth/login';
    let body = {
      email: userEmailId,
      password: password,
    };
    return this.http.post(assetUrl, body);
  }

  generateOtp(emailId: any): Observable<any> {
    let assetUrl =
      environment.notificationService + '/v2/api/notifications/send';
    let body = {
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

  /* ✅ FIXED: Now attaches Authorization Header */
  storeSession(payload: any): Observable<any> {
    // Try getting token from localStorage (set in Component) or sessionStorage (set in Service)
    const token =
      localStorage.getItem('access-token') || sessionStorage.getItem('token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Pass the headers as the 3rd argument
    return this.http.post(this.API_URL, payload, { headers: headers });
  }

  /**
   * Helper to gather client metadata from the browser
   */
  getClientMetadata() {
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