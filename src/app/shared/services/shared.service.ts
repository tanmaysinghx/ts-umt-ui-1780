import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private readonly headerState = new BehaviorSubject<boolean>(false);
  private readonly menuState = new BehaviorSubject<boolean>(false);
  private readonly mainState = new BehaviorSubject<boolean>(false);
  headerState$ = this.headerState.asObservable();
  menuState$ = this.menuState.asObservable();
  mainState$ = this.mainState.asObservable();

  constructor(private readonly http: HttpClient) { }

  refreshHeader() {
    this.headerState.next(true);
  }

  refreshMenu() {
    this.menuState.next(true);
  }

  refreshMain() {
    this.mainState.next(true);
  }

  getMenuData(userType: any): Observable<any> {
    let assetUrl = '';
    if (userType === '0005') {
      assetUrl = environment.cmsUrl + 'assets/data/menu-options-user.json';
    } else if (userType === '0002') {
      assetUrl = environment.cmsUrl + 'assets/data/menu-options-admin.json';
    } else {
      throw new Error('Invalid userType provided');
    }
    return this.http.get<any>(assetUrl);
  }


}
