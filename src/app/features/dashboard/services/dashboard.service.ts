import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private readonly http: HttpClient) { }

  getApplications(): Observable<any> {
    let assetUrl = environment.cmsUrl + 'assets/data/application-list.json';
    return this.http.get<any>(assetUrl);
  }
}
