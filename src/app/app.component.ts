import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SharedService } from './shared/services/shared.service';
import { UiTestingService } from './features/services/ui-testing.service';
import { LoginService } from './features/auth/services/login.service';
import { OtpService } from './features/auth/services/otp.service';
import { CookieService } from 'ngx-cookie-service';
import { RegisterService } from './features/auth/services/register.service';
import { LayoutComponent } from "./layout/layout.component";
import { CommonService } from './features/services/common.service';
import { DashboardService } from './features/dashboard/services/dashboard.service';
import { ReleaseNotificationComponent } from './shared/release-notification/release-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, LayoutComponent, ReleaseNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, SharedService, UiTestingService, LoginService, OtpService, CookieService, RegisterService, CommonService, DashboardService]
})
export class AppComponent {
  title = 'ts-umt-ui-1780';

  ngOnInit(): void {
    initFlowbite();
  }
}
