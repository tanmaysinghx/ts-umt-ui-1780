import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private headerState = new BehaviorSubject<boolean>(false);
  private menuState = new BehaviorSubject<boolean>(false);
  private mainState = new BehaviorSubject<boolean>(false);
  headerState$ = this.headerState.asObservable();
  menuState$ = this.menuState.asObservable();
  mainState$ = this.mainState.asObservable();

  constructor(private http: HttpClient) { }

  refreshHeader() {
    this.headerState.next(true);
  }

  refreshMenu() {
    this.menuState.next(true);
  }

  refreshMain() {
    this.mainState.next(true);
  }

  getMenuData(): Observable<any> {
    let assetUrl =  environment.cmsUrl + 'assets/data/menu-options-admin.json';
    return this.http.get<any>(assetUrl);
  }


}
