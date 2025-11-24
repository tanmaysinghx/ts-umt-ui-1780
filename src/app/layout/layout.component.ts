import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SideNavComponent } from "../shared/side-nav/side-nav.component";
import { BreadcrumpComponent } from "../shared/breadcrump/breadcrump.component";
import { SpeedUpDialComponent } from "../shared/speed-up-dial/speed-up-dial.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../features/auth/services/login.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SideNavComponent,
    BreadcrumpComponent,
    SpeedUpDialComponent,
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  loggedInFlag = false;
  sidebarOpen = true;
  isMobileView = false;

  constructor(private readonly loginService: LoginService) {}

  ngOnInit() {
    this.loginService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.loggedInFlag = isLoggedIn;
    });
    this.checkViewport();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth < 640; // Tailwind sm breakpoint
    if (!this.isMobileView) {
      this.sidebarOpen = true; // ensure desktop sidebar is always visible
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}