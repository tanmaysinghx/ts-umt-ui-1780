import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../services/dashboard.service';

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

  appData: any[] = [];

  constructor(private readonly commonService: CommonService, private readonly dashboardService: DashboardService) { }

  ngOnInit() {
    this.getApplicationList();
  }

  getApplicationList() {
    this.dashboardService.getApplications().subscribe((data: any) => {
      if (data) {
        this.appData = data;
      }
    });
  }

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
      app.status = 'Failed to Launch';
      this.loadingAppId = null;
      return;
    }

    app.status = 'Verifying JWT Token...';

    this.commonService.checkJWTTokenIsValid(accessToken).subscribe((isValid: boolean) => {
      if (isValid) {
        const url = app.appUrl + `${encodeURIComponent(accessToken)}&refreshtoken=${encodeURIComponent(refreshToken)}`;

        setTimeout(() => {
          app.status = 'Running';
          this.loadingAppId = null;
        }, 4000);

        setTimeout(() => {
          if (app.status === 'Running') {
            window.open(url, '_blank');
          }
        }, 6000);

      } else {
        app.status = 'Generating new JWT Token...';

        this.commonService.generateJWTTokenBasedOnRefreshToken(refreshToken).subscribe((data: any) => {
          if (data?.success) {
            const newAccessToken = data?.data?.downstreamResponse?.microserviceResponse?.data?.accessToken;
            sessionStorage.setItem('access-token', newAccessToken);

            const url = app.appUrl + `${encodeURIComponent(newAccessToken)}&refreshtoken=${encodeURIComponent(refreshToken)}`;

            app.status = 'Running';
            this.loadingAppId = null;

            setTimeout(() => {
              window.open(url, '_blank');
            }, 1000);

          } else {
            app.status = 'Failed to Launch';
            this.loadingAppId = null;
          }
        });
      }
    });
  }
}



