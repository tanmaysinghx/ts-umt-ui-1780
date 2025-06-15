import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SideNavComponent } from "../shared/side-nav/side-nav.component";
import { BreadcrumpComponent } from "../shared/breadcrump/breadcrump.component";
import { SpeedUpDialComponent } from "../shared/speed-up-dial/speed-up-dial.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideNavComponent, BreadcrumpComponent, SpeedUpDialComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  loggedInFlag: any = false;
  sidebarOpen = true;
  isMobileView = false;

  ngOnInit() {
    this.checkLoggedInFlag();
    this.checkViewport();
  }

  checkLoggedInFlag() {
    let token = sessionStorage.getItem('access-token');
    if (token) {
      this.loggedInFlag = true;
    } else {
      this.loggedInFlag = false;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth < 640; // Tailwind sm breakpoint
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
