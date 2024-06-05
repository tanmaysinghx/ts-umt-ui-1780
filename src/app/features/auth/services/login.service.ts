import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(userEmailId: string, password: string): Observable<any> {
    let assetUrl = environment.ssoService + 'sign-in';
    const authHeader = 'Basic ' + btoa(`${userEmailId}:${password}`);
    const headers = new HttpHeaders({
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });
    return this.http.post(assetUrl, {}, { headers });
  }
}
