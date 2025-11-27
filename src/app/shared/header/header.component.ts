import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { LoginService } from '../../features/auth/services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class HeaderComponent {

  isSidebarOpen: boolean = false;
  isDarkMode: boolean = false;
  isUserMenuOpen: boolean = false;
  userProfileImage: string = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
  userRole: any = 'Username';
  userEmail: any = 'user@example.com';
  versionLabel = 'ALPHA-001';

  isNotificationsOpen = false;
  notifications = [
    {
      id: 1,
      title: 'New Session Detected',
      message: 'A new login from Chrome on Windows.',
      time: '2m ago',
      read: false,
      icon: 'shield-check',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Password Update',
      message: 'Your password was successfully updated.',
      time: '1d ago',
      read: true,
      icon: 'lock-closed',
      color: 'green'
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Scheduled maintenance in 2 hours.',
      time: '2d ago',
      read: true,
      icon: 'exclamation-circle',
      color: 'yellow'
    }
  ];

  constructor(private readonly sharedService: SharedService, private readonly router: Router, private readonly loginService: LoginService) { }

  ngOnInit() {
    this.getSessionStorage();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  getSessionStorage() {
    this.userEmail = localStorage.getItem('user-email') ?? null;
    this.userRole = localStorage.getItem('user-role')?.toUpperCase() ?? null;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', theme);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isNotificationsOpen = false;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) this.isUserMenuOpen = false;
  }

  signOut() {
    sessionStorage.clear();
    this.loginService.logoutEvent();

    this.router.navigate(['/auth/login']);
  }

}
