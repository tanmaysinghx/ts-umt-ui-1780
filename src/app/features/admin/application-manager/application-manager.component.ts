import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  allowedRoles: string[];
  allowedUsersCount: number;
  lastUpdated: string;
}

@Component({
  selector: 'app-application-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-manager.component.html',
  styleUrl: './application-manager.component.scss'
})
export class ApplicationManagerComponent implements OnInit {
  searchQuery = '';
  loading = false;
  applications: Application[] = [];

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.applications = [
        {
          id: '1',
          name: 'CRM Dashboard',
          description: 'Customer Relationship Management system for sales team.',
          url: 'https://crm.internal.company.com',
          icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          status: 'ACTIVE',
          allowedRoles: ['Sales', 'Admin'],
          allowedUsersCount: 45,
          lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          id: '2',
          name: 'HR Portal',
          description: 'Employee self-service portal for leave and benefits.',
          url: 'https://hr.internal.company.com',
          icon: 'https://cdn-icons-png.flaticon.com/512/912/912318.png',
          status: 'ACTIVE',
          allowedRoles: ['All Employees'],
          allowedUsersCount: 1200,
          lastUpdated: new Date(Date.now() - 10 * 86400000).toISOString()
        },
        {
          id: '3',
          name: 'Legacy Inventory',
          description: 'Old inventory system, read-only access.',
          url: 'http://inventory-old.local',
          status: 'MAINTENANCE',
          allowedRoles: ['Warehouse Manager'],
          allowedUsersCount: 3,
          lastUpdated: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          id: '4',
          name: 'Analytics Suite',
          description: 'Business intelligence and reporting tools.',
          url: 'https://analytics.internal.company.com',
          icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920323.png',
          status: 'ACTIVE',
          allowedRoles: ['Admin', 'Analyst', 'Executive'],
          allowedUsersCount: 12,
          lastUpdated: new Date(Date.now() - 1 * 86400000).toISOString()
        }
      ];
      this.loading = false;
    }, 800);
  }

  get filteredApplications(): Application[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.applications;
    return this.applications.filter(app => 
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q)
    );
  }

  get activeAppsCount(): number {
    return this.applications.filter(app => app.status === 'ACTIVE').length;
  }

  formatDate(value: string): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Placeholder actions
  addApplication() { console.log('Add application clicked'); }
  editApplication(app: Application) { console.log('Edit app', app); }
  manageAccess(app: Application) { console.log('Manage access', app); }
  deleteApplication(app: Application) { console.log('Delete app', app); }
}
