import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

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

  constructor(private readonly sharedService: SharedService, private readonly router: Router) { }

  ngOnInit() {
    this.getSessionStorage();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  getSessionStorage() {
    this.userEmail = sessionStorage?.getItem('user-email') ?? null;
    this.userRole = sessionStorage?.getItem('user-role')?.toUpperCase() ?? null;
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
  }

  signOut() {
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}
