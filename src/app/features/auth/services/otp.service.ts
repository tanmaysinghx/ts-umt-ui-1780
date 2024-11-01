import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) { }

  verifyOtp(userEmailId: any, otp: any): Observable<any> {
    let assetUrl = environment.ssoProdService + 'otp/verify-otp';
    let body = {
      "email": userEmailId,
      "otp": otp
    }
    return this.http.post(assetUrl, body);
  }

  generateOtp(userEmailId: any): Observable<any> {
    let assetUrl = environment.ssoProdService + 'otp/request-otp';
    let body = {
      "email": userEmailId,
    }
    return this.http.post(assetUrl, body);
  }
}
