import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'SUPERUSER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin: string;
  avatar?: string;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  searchQuery = '';
  loading = false;
  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.users = [
        {
          id: '1',
          firstName: 'Tanmay',
          lastName: 'Singh',
          email: 'tanmay.singh@example.com',
          role: 'SUPERUSER',
          status: 'ACTIVE',
          lastLogin: new Date().toISOString(),
          avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
        },
        {
          id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          lastLogin: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '3',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'USER',
          status: 'INACTIVE',
          lastLogin: new Date(Date.now() - 7 * 86400000).toISOString() // 7 days ago
        },
        {
          id: '4',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.j@example.com',
          role: 'USER',
          status: 'SUSPENDED',
          lastLogin: new Date(Date.now() - 30 * 86400000).toISOString() // 30 days ago
        }
      ];
      this.loading = false;
    }, 800);
  }

  get filteredUsers(): User[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u => 
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  get activeUsersCount(): number {
    return this.users.filter(u => u.status === 'ACTIVE').length;
  }

  formatDate(value: string): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getInitials(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'SUPERUSER': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'SUSPENDED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  // Placeholder actions
  addUser() { console.log('Add user clicked'); }
  editUser(user: User) { console.log('Edit user', user); }
  deleteUser(user: User) { console.log('Delete user', user); }
}
