import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-applications',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-applications.component.html',
  styleUrl: './dashboard-applications.component.scss'
})
export class DashboardApplicationsComponent {
  searchQuery = '';
  selectedCategory = '';
  darkMode: boolean = localStorage.getItem('theme') === 'dark';
  loadingAppId: string | null = null;

  appData = [
    { id: "1", title: 'Ticketing App', version: 'v1.1.0', description: 'Track and resolve tickets', category: 'tickets', status: 'Not Running' },
  ];

  filterApplications() {
    return this.appData.filter(app =>
      app.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedCategory ? app.category === this.selectedCategory : true)
    );
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }

  launchApp(app: any) {
    if (this.loadingAppId) return;

    this.loadingAppId = app.id;
    app.status = 'Starting...';

    const accessToken = sessionStorage.getItem('access-token');
    const refreshToken = sessionStorage.getItem('refresh-token');

    if (!accessToken || !refreshToken) {
      console.error('Tokens not found in localStorage');
      app.status = 'Failed to Launch';
      this.loadingAppId = null;
      return;
    }

    const url = `http://localhost:1725/sso?token=${encodeURIComponent(accessToken)}&refreshtoken=${encodeURIComponent(refreshToken)}`;
    console.log(`Launching app with URL: ${url}`);

    setTimeout(() => {
      const success = true;
      app.status = success ? 'Running' : 'Failed to Launch';
      this.loadingAppId = null;
    }, 4000);

    setTimeout(() => {
      if (app.status === 'Running') {
        window.open(url, '_blank');
      }
    }, 6000);
  }

}
