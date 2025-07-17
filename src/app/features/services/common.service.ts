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
    const assetUrl = environment.apiGatewayService + '/1625/v2/api/auth/verify/verify-token';
    return this.http.post(assetUrl, { token });
  }

  generateJWTTokenBasedOnRefreshToken(refreshToken: string): Observable<any> {
    const assetUrl = environment.apiGatewayService + '/1625/v2/api/auth/refresh-token';
    return this.http.post(assetUrl, { refreshToken });
  }
}

