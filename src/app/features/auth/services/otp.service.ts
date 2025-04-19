import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private readonly http: HttpClient) { }

  verifyOtp(userEmailId: any, otp: any): Observable<any> {
    let assetUrl = environment.umtService + '/v2/api/notifications/verify-otp';
    let body = {
      "email": userEmailId,
      "otpCode": otp
    }
    return this.http.post(assetUrl, body);
  }

  generateOtp(requestBody: any): Observable<any> {
    let assetUrl = environment.umtService + '/v2/api/notifications/send';
    return this.http.post(assetUrl, requestBody);
  }
}
