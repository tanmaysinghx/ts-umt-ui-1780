import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

@Component({
  selector: 'app-role-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-manager.component.html',
  styleUrl: './role-manager.component.scss'
})
export class RoleManagerComponent implements OnInit {
  searchQuery = '';
  loading = false;
  roles: Role[] = [];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.roles = [
        {
          id: '1',
          name: 'Superuser',
          description: 'Full system access with ability to manage all aspects of the platform.',
          usersCount: 2,
          permissions: ['ALL_ACCESS', 'MANAGE_SYSTEM', 'MANAGE_USERS', 'VIEW_LOGS'],
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Administrative access to manage users and view reports.',
          usersCount: 5,
          permissions: ['MANAGE_USERS', 'VIEW_REPORTS', 'MANAGE_CONTENT'],
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
        },
        {
          id: '3',
          name: 'Editor',
          description: 'Can create and edit content but cannot manage users.',
          usersCount: 12,
          permissions: ['CREATE_CONTENT', 'EDIT_CONTENT', 'PUBLISH_CONTENT'],
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
        },
        {
          id: '4',
          name: 'Viewer',
          description: 'Read-only access to public content.',
          usersCount: 150,
          permissions: ['VIEW_CONTENT'],
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
        },
        {
          id: '5',
          name: 'Legacy Admin',
          description: 'Deprecated admin role, migrating users to Admin.',
          usersCount: 0,
          permissions: ['MANAGE_USERS_LEGACY'],
          status: 'INACTIVE',
          createdAt: new Date(Date.now() - 365 * 86400000).toISOString()
        }
      ];
      this.loading = false;
    }, 800);
  }

  get filteredRoles(): Role[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.roles;
    return this.roles.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }

  get activeRolesCount(): number {
    return this.roles.filter(r => r.status === 'ACTIVE').length;
  }

  formatDate(value: string): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  // Placeholder actions
  createRole() { console.log('Create role clicked'); }
  editRole(role: Role) { console.log('Edit role', role); }
  deleteRole(role: Role) { console.log('Delete role', role); }
  managePermissions(role: Role) { console.log('Manage permissions', role); }
}
