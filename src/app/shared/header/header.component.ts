import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  loggedInFlag: boolean = false;
  loggedInUsername: any;
  loggedInEmailId: any;
  accessToken: any;

  private subscription: Subscription = new Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.detectLogin();
    this.getSessionStorage();
  }

  detectLogin() {
    this.subscription = this.sharedService.headerState$.subscribe(state => {
      if (state) {
        this.refreshHeader();
      }
    });
  }

  getSessionStorage() {
    this.loggedInUsername = sessionStorage.getItem("user-name");
    this.loggedInEmailId = sessionStorage.getItem("user-email");
    this.accessToken = sessionStorage.getItem("access-token");
    if (this.accessToken != null) {
      this.loggedInFlag = true;
    }
  }

  refreshHeader() {
    console.log("header");
    this.getSessionStorage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
