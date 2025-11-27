import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  resource: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  ip: string;
  location?: string;
  device?: string;
  os?: string;
  browser?: string;
  details?: string;
}

@Component({
  selector: 'app-monitoring-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-users.component.html',
  styleUrl: './monitoring-users.component.scss'
})
export class MonitoringUsersComponent implements OnInit {
  searchQuery = '';
  loading = false;
  activities: ActivityLog[] = [];

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.activities = [
        {
          id: '1',
          user: { name: 'Tanmay Singh', email: 'tanmay.singh@example.com', avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg' },
          action: 'Login',
          resource: 'Auth System',
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
          ip: '192.168.1.10',
          location: 'New York, USA',
          device: 'MacBook Pro',
          os: 'macOS 14.2',
          browser: 'Chrome 120'
        },
        {
          id: '2',
          user: { name: 'John Doe', email: 'john.doe@example.com' },
          action: 'Update Profile',
          resource: 'User Settings',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'SUCCESS',
          ip: '10.0.0.5',
          location: 'London, UK',
          device: 'Dell XPS',
          os: 'Windows 11',
          browser: 'Firefox 121',
          details: 'Changed phone number'
        },
        {
          id: '3',
          user: { name: 'Jane Smith', email: 'jane.smith@example.com' },
          action: 'Delete User',
          resource: 'User Management',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          status: 'FAILURE',
          ip: '172.16.0.20',
          location: 'Berlin, Germany',
          device: 'iPhone 15',
          os: 'iOS 17',
          browser: 'Safari Mobile',
          details: 'Insufficient permissions'
        },
        {
          id: '4',
          user: { name: 'Alice Johnson', email: 'alice.j@example.com' },
          action: 'Export Report',
          resource: 'Analytics',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'WARNING',
          ip: '192.168.1.15',
          location: 'Sydney, Australia',
          device: 'iPad Pro',
          os: 'iPadOS 17',
          browser: 'Safari',
          details: 'Large dataset export'
        },
        {
          id: '5',
          user: { name: 'Tanmay Singh', email: 'tanmay.singh@example.com', avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg' },
          action: 'Logout',
          resource: 'Auth System',
          timestamp: new Date(Date.now() - 90000000).toISOString(), // ~1 day ago
          status: 'SUCCESS',
          ip: '192.168.1.10',
          location: 'New York, USA',
          device: 'MacBook Pro',
          os: 'macOS 14.2',
          browser: 'Chrome 120'
        }
      ];
      this.loading = false;
    }, 800);
  }

  get filteredActivities(): ActivityLog[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.activities;
    return this.activities.filter(a => 
      a.user.name.toLowerCase().includes(q) ||
      a.user.email.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.resource.toLowerCase().includes(q) ||
      (a.location || '').toLowerCase().includes(q) ||
      (a.device || '').toLowerCase().includes(q)
    );
  }

  get failedActionsCount(): number {
    return this.activities.filter(a => a.status === 'FAILURE').length;
  }

  formatDate(value: string): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'FAILURE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
