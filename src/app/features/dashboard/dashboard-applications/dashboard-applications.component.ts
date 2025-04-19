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

  appData = [
    { title: 'VDI Desktop', version: 'v2.3.1', description: 'Launch your secure virtual desktop environment', category: 'dev-tools', status: 'Running' },
    { title: 'Ticketing App', version: 'v1.9.0', description: 'Track and resolve tickets', category: 'tickets', status: 'Running' },
    { title: 'Jira Board', version: 'v3.1.0', description: 'Manage your Jira board tasks', category: 'infra', status: 'Down' },
    { title: 'Code Repository', version: 'v4.2.0', description: 'Git-based source code management', category: 'dev-tools', status: 'Running' },
    { title: 'CI/CD Pipeline', version: 'v1.5.3', description: 'Continuous integration and deployment', category: 'devops', status: 'Running' },
    { title: 'Monitoring Dashboard', version: 'v2.0.4', description: 'Real-time system performance monitoring', category: 'monitoring', status: 'Running' },
    { title: 'Database Manager', version: 'v3.7.2', description: 'Manage and query databases', category: 'database', status: 'Degraded' },
    { title: 'Auth Gateway', version: 'v1.2.1', description: 'Single sign-on and authentication service', category: 'security', status: 'Running' },
    { title: 'File Storage', version: 'v5.1.0', description: 'Cloud-based file storage solution', category: 'storage', status: 'Maintenance' },
    { title: 'API Gateway', version: 'v2.8.0', description: 'Manage and route API requests', category: 'networking', status: 'Running' },
    { title: 'Log Analyzer', version: 'v1.0.3', description: 'Centralized log collection and analysis', category: 'monitoring', status: 'Down' },
    { title: 'Kubernetes Cluster', version: 'v1.22.5', description: 'Container orchestration platform', category: 'devops', status: 'Running' }
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
}
