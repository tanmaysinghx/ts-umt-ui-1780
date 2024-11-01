import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // login(userEmailId: string, password: string): Observable<any> {
  //   let assetUrl = environment.ssoService + 'v2/api/auth/login';
  //   const authHeader = 'Basic ' + btoa(`${userEmailId}:${password}`);
  //   const headers = new HttpHeaders({
  //     'Authorization': authHeader,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post(assetUrl, {}, { headers });
  // }

  login(userEmailId: string, password: string): Observable<any> {
    //let assetUrl = environment.apiGatewayService + '1625/auth-service/v2/api/auth/login';
    let assetUrl = environment.ssoProdService + 'auth/login';
    let body = {
      "email": userEmailId,
      "password": password
    }
    return this.http.post(assetUrl, body);
  }

  generateOtp(emailId: any): Observable<any> {
    let assetUrl = environment.umtService + 'otp/generate-otp';
    let body = {
      "userEmail": emailId
    }
    return this.http.post(assetUrl, body);
  }
}
