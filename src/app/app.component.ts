import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './shared/header/header.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { BreadcrumpComponent } from './shared/breadcrump/breadcrump.component';
import { SpeedUpDialComponent } from './shared/speed-up-dial/speed-up-dial.component';
import { SharedService } from './shared/services/shared.service';
import { UiTestingService } from './features/services/ui-testing.service';
import { LoginService } from './features/auth/services/login.service';
import { Subscription } from 'rxjs';
import { OtpService } from './features/auth/services/otp.service';
import { CookieService } from 'ngx-cookie-service';
import { RegisterService } from './features/auth/services/register.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, SideNavComponent, BreadcrumpComponent, SpeedUpDialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, SharedService, UiTestingService, LoginService, OtpService, CookieService, RegisterService]
})
export class AppComponent {
  title = 'ts-umt-ui-1780';

  loggedInFlag: boolean = false;
  accessToken: any;

  private subscription: Subscription = new Subscription;

  constructor(private sharedService: SharedService,) { }

  ngOnInit(): void {
    initFlowbite();
    this.getSessionStorage();
    this.detectLogin();
  }

  detectLogin() {
    this.subscription = this.sharedService.mainState$.subscribe(state => {
      if (state) {
        this.refreshMain();
      }
    });
  }

  getSessionStorage() {
    this.accessToken = sessionStorage.getItem("access-token");
    this.checkLoginStatus(this.accessToken);
  }

  checkLoginStatus(token?: any) {
    if (token != null) {
      this.loggedInFlag = true;
      console.log("User is logged in !!!")
    } else {
      this.loggedInFlag = false;
    }
  }

  refreshMain() {
    console.log("main");
    this.getSessionStorage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
