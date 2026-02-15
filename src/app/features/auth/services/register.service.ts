import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private readonly http: HttpClient) { }

  registerUser(payload: any): Observable<any> {
    // Use API Gateway Workflow
    const url = `${environment.apiGatewayService}/auth-register`;

    return this.http.post(url, payload).pipe(
      map((res: any) => {
        // Unwrap Gateway response
        // Gateway: { success: true, data: { downstreamResponse: { ...user... } } }
        return res.data?.downstreamResponse || res;
      })
    );
  }
}
