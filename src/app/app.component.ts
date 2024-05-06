import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './shared/header/header.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { BreadcrumpComponent } from './shared/breadcrump/breadcrump.component';
import { SpeedUpDialComponent } from './shared/speed-up-dial/speed-up-dial.component';
import { SnackbarDetailedComponent } from './shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { SnackbarService } from './shared/snackbar/service/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, SideNavComponent, BreadcrumpComponent, SpeedUpDialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, SnackbarService]
})
export class AppComponent {
  title = 'sso-app-ui-2508';

  loggedInFlag: boolean = false;

  ngOnInit(): void {
    initFlowbite();
    this.loggedInFlag = false;
  }
}
