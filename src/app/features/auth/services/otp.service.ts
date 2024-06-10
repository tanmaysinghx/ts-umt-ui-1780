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
    let assetUrl = environment.umtService + 'otp/verify-otp/' + userEmailId + "/" + otp;
    return this.http.get(assetUrl);
  }
}
