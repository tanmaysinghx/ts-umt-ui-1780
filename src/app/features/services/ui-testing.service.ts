import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UiTestingService {

  constructor(private http: HttpClient) { }

  getUIScreens(): Observable<any> {
    let assetUrl =  environment.cmsUrl + 'assets/data/ui-testing.json';
    return this.http.get<any>(assetUrl);
  }
}
