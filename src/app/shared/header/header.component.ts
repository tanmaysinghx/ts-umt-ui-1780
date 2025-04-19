import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class HeaderComponent {

  loggedInFlag: boolean = false;
  loggedInUsername: any;
  loggedInEmailId: any;
  accessToken: any;
  isDarkMode = false;

  private subscription: Subscription = new Subscription;

  constructor(private readonly sharedService: SharedService) { }

  ngOnInit() {
    this.detectLogin();
    this.getSessionStorage();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
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

  // Method to toggle between light and dark mode
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    // Save preference in localStorage so it persists
    localStorage.setItem('theme', theme);
  }

}
