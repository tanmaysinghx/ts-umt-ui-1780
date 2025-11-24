import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AccessRole {
  id: string;
  name: string; // e.g. "Admin", "Developer", "Read-only"
  type: 'standard' | 'admin';
  scope: string; // e.g. "Global", "Project: Alpha", "App: Tickets"
  apps: string[]; // list of apps this applies to
  grantedAt: string; // ISO
  grantedBy: string; // e.g. "IAM System" or admin email
}

type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface AccessRequest {
  id: string;
  application: string;
  requestedRole: string;
  status: AccessRequestStatus;
  createdAt: string;
  decidedAt?: string;
  approver?: string;
}

@Component({
  selector: 'app-my-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-access.component.html',
  styleUrls: ['./my-access.component.scss'],
})
export class MyAccessComponent implements OnInit {
  darkMode: boolean = localStorage.getItem('theme') === 'dark';
  loading = false;
  errorMessage: string | null = null;

  // Current roles (mocked – wire to API later)
  roles: AccessRole[] = [
    {
      id: 'R-001',
      name: 'Workspace Admin',
      type: 'admin',
      scope: 'Global',
      apps: ['SSO Portal', 'User Directory'],
      grantedAt: '2025-01-15T08:45:00Z',
      grantedBy: 'system@iam.local',
    },
    {
      id: 'R-002',
      name: 'Developer',
      type: 'standard',
      scope: 'Project: Alpha',
      apps: ['CI/CD Dashboard', 'Logs Viewer'],
      grantedAt: '2025-02-10T10:10:00Z',
      grantedBy: 'lead.dev@company.com',
    },
    {
      id: 'R-003',
      name: 'Read-only',
      type: 'standard',
      scope: 'App: Ticketing',
      apps: ['Ticket Console'],
      grantedAt: '2025-03-01T12:00:00Z',
      grantedBy: 'pm@company.com',
    },
  ];

  // Access requests (mock)
  accessRequests: AccessRequest[] = [
    {
      id: 'AR-1001',
      application: 'Ticket Console',
      requestedRole: 'Agent',
      status: 'PENDING',
      createdAt: '2025-11-20T11:20:00Z',
    },
    {
      id: 'AR-1000',
      application: 'CI/CD Dashboard',
      requestedRole: 'Maintainer',
      status: 'APPROVED',
      createdAt: '2025-11-01T09:00:00Z',
      decidedAt: '2025-11-02T13:15:00Z',
      approver: 'admin@company.com',
    },
    {
      id: 'AR-0999',
      application: 'Infra Console',
      requestedRole: 'Admin',
      status: 'REJECTED',
      createdAt: '2025-10-10T07:30:00Z',
      decidedAt: '2025-10-11T08:45:00Z',
      approver: 'security@company.com',
    },
  ];

  // New access request form
  newRequest = {
    application: '',
    requestedRole: '',
    justification: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  };

  availableApplications = [
    'SSO Portal',
    'Ticket Console',
    'CI/CD Dashboard',
    'Infra Console',
  ];
  availableRoles = ['Read-only', 'Developer', 'Maintainer', 'Agent', 'Admin'];

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  get adminRoles(): AccessRole[] {
    return this.roles.filter((r) => r.type === 'admin');
  }

  get standardRoles(): AccessRole[] {
    return this.roles.filter((r) => r.type === 'standard');
  }

  get pendingRequests(): AccessRequest[] {
    return this.accessRequests.filter((r) => r.status === 'PENDING');
  }

  get historicalRequests(): AccessRequest[] {
    return this.accessRequests.filter((r) => r.status !== 'PENDING');
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  refreshAccess(): void {
    this.loading = true;
    this.errorMessage = null;
    // TODO: call backend to refresh roles + requests
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  submitAccessRequest(): void {
    if (
      !this.newRequest.application ||
      !this.newRequest.requestedRole ||
      !this.newRequest.justification
    ) {
      this.errorMessage =
        'Application, role, and justification are required to raise an access request.';
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    const newId = `AR-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const payload: AccessRequest = {
      id: newId,
      application: this.newRequest.application,
      requestedRole: this.newRequest.requestedRole,
      status: 'PENDING',
      createdAt: nowIso,
    };

    console.log('Access request payload', {
      ...payload,
      urgency: this.newRequest.urgency,
      justification: this.newRequest.justification,
    });

    // TODO: call backend; for now just push locally
    setTimeout(() => {
      this.accessRequests.unshift(payload);
      this.loading = false;
      this.resetRequestForm();
    }, 800);
  }

  resetRequestForm(): void {
    this.newRequest = {
      application: '',
      requestedRole: '',
      justification: '',
      urgency: 'medium',
    };
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }

  statusChipClass(status: AccessRequestStatus): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  }
}