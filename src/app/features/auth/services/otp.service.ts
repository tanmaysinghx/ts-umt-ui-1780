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
    let assetUrl = environment.notificationService + '/v2/api/notifications/verify-otp';
    let body = {
      "email": userEmailId,
      "otpCode": otp
    }
    return this.http.post(assetUrl, body);
  }

  resumeWorklflow(transactionId: any): Observable<any> {
    let assetUrl = environment.apiGatewayService + '/resume-workflow/' + transactionId;
    return this.http.get(assetUrl);
  }
}
