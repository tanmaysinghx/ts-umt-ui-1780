import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  login(userEmailId: string, password: string): Observable<any> {
    let assetUrl = environment.ssoService + '/auth/login';
    let body = {
      "email": userEmailId,
      "password": password
    }
    return this.http.post(assetUrl, body);
  }

  generateOtp(emailId: any): Observable<any> {
    let assetUrl = environment.umtService + '/v2/api/notifications/send';
    let body = {
      "userEmail": emailId
    }
    return this.http.post(assetUrl, body);
  }
}
