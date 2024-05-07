import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  getMenuData(): Observable<any> {
    let assetUrl =  environment.cmsUrl + 'assets/data/menu-options-admin.json';
    return this.http.get<any>(assetUrl);
  }
}
