import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  login(userEmailId: string, password: string): Observable<any> {
    let assetUrl = environment.apiGatewayService + '/trigger-workflow/WF1625E20001?apiEndpoint=/v2/api/auth/login';
    let body = {
      "email": userEmailId,
      "password": password
    }
    return this.http.post(assetUrl, body);
  }

  generateOtp(emailId: any): Observable<any> {
    let assetUrl = environment.notificationService + '/v2/api/notifications/send';
    let body = {
      "userEmail": emailId
    }
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
}
