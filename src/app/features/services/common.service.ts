import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private readonly http: HttpClient) { }

  checkJWTTokenIsValid(token: string): Observable<boolean> {
    return this.verifyJWTToken(token).pipe(
      map((data: any) => data?.success === true),
      catchError((err) => {
        console.error('Token verification failed', err);
        return of(false);
      })
    );
  }

  verifyJWTToken(token: string): Observable<any> {
    const assetUrl = environment.apiGatewayService + '/trigger-workflow/WF1625E20004?apiEndpoint=/v2/api/auth/verify/verify-token';
    const email = localStorage.getItem('user-email');
    const body = { "email": email, "token": token };
    return this.http.post(assetUrl, body);
  }

  generateJWTTokenBasedOnRefreshToken(refreshToken: string): Observable<any> {
    const assetUrl = environment.apiGatewayService + '/trigger-workflow/WF1625E20005?apiEndpoint=/v2/api/auth/refresh-token';
    const email = localStorage.getItem('user-email');
    const body = { "email": email, "refreshToken": refreshToken };
    return this.http.post(assetUrl, body);
  }
}

