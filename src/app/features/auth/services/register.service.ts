import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registerUser(payload: any): Observable<any> {
    let assetUrl = environment.ssoProdService + 'auth/register';
    return this.http.post(assetUrl, payload);
  }
}
