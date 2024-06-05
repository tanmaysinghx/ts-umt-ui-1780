import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './shared/header/header.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { BreadcrumpComponent } from './shared/breadcrump/breadcrump.component';
import { SpeedUpDialComponent } from './shared/speed-up-dial/speed-up-dial.component';
import { SnackbarDetailedComponent } from './shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { SharedService } from './shared/services/shared.service';
import { UiTestingService } from './features/services/ui-testing.service';
import { LoginService } from './features/auth/services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, SideNavComponent, BreadcrumpComponent, SpeedUpDialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, SharedService, UiTestingService, LoginService]
})
export class AppComponent {
  title = 'ts-umt-ui-1780';

  loggedInFlag: boolean = false;
  accessToken: any;

  @HostListener('window:storage', ['$event'])

  ngOnInit(): void {
    initFlowbite();
    window.addEventListener('storage', this.onStorageChange.bind(this));
    this.getSessionStorage();
    this.loggedInFlag = false;
    if (this.accessToken) {
      console.log("Logged In")
    }
  }

  onStorageChange(event: StorageEvent) {
    if (event.key === 'yourKey') {
      // Do something when the specific key is changed in session storage
      console.log('Session storage changed for yourKey');
    }
  }

  getSessionStorage() {
    this.accessToken = sessionStorage.getItem("access-token");
  }
}
