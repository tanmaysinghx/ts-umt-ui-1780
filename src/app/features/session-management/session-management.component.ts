import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from './service/session.service';

export interface UserSession {
  id: string;
  device: string; // e.g. "Windows · Chrome"
  ipAddress: string;
  location?: string; // e.g. "Noida, IN"
  userAgent?: string;
  createdAt: string; // ISO date
  lastActiveAt: string; // ISO date
  current: boolean;
}

@Component({
  selector: 'app-session-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-management.component.html',
  styleUrls: ['./session-management.component.scss'],
})
export class SessionManagementComponent implements OnInit {
  searchQuery = '';
  darkMode: boolean = localStorage.getItem('theme') === 'dark';

  sessions: UserSession[] = [];
  loading = false;
  loadingSessionId: string | null = null;
  errorMessage: string | null = null;

  constructor(private readonly sessionService: SessionService) {}

  ngOnInit(): void {
    // sync dark mode class with local storage
    document.documentElement.classList.toggle('dark', this.darkMode);
    this.loadSessions();
  }

  get filteredSessions(): UserSession[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.sessions;
    return this.sessions.filter(
      (s) =>
        (s.device || '').toLowerCase().includes(q) ||
        (s.ipAddress || '').toLowerCase().includes(q) ||
        (s.location || '').toLowerCase().includes(q) ||
        (s.userAgent || '').toLowerCase().includes(q)
    );
  }

  get currentSession(): UserSession | undefined {
    return this.sessions.find((s) => s.current);
  }

  get otherSessions(): UserSession[] {
    return this.sessions.filter((s) => !s.current);
  }

  loadSessions(): void {
    this.loading = true;
    this.errorMessage = null;

    this.sessionService.getSessions().subscribe({
      next: (res: any) => {
        const raw = res?.data || [];

        this.sessions = raw.map((s: any) => ({
          id: s.id,
          device: s.device, // "MacBook Pro"
          ipAddress: s.ipAddress, // "::1"
          location: s.location, // "New York, USA"
          userAgent: `${s.browser} · ${s.os}`, // "Chrome 120 · macOS 14.2"
          createdAt: s.createdAt,
          lastActiveAt: s.lastActiveAt,
          current: !!s.isActive, // treat isActive as current
        }));

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load sessions', err);
        this.errorMessage = 'Failed to load sessions. Please try again.';
        this.loading = false;
      },
    });
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  terminateSession(session: UserSession): void {
    if (this.loadingSessionId || this.loading) return;
    const confirmed = window.confirm(
      `Terminate session on "${session.device}" (IP: ${session.ipAddress})?`
    );
    if (!confirmed) return;

    this.loadingSessionId = session.id;
    this.errorMessage = null;

    this.sessionService.terminateSession(session.id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter((s) => s.id !== session.id);
        this.loadingSessionId = null;
      },
      error: (err: any) => {
        console.error('Failed to terminate session', err);
        this.errorMessage = 'Failed to terminate session. Please try again.';
        this.loadingSessionId = null;
      },
    });
  }

  terminateOtherSessions(): void {
    if (this.loading) return;
    if (this.otherSessions.length === 0) return;

    const confirmed = window.confirm(
      'Terminate all other sessions except this device?'
    );
    if (!confirmed) return;

    this.loading = true;
    this.errorMessage = null;

    this.sessionService.terminateOtherSessions().subscribe({
      next: () => {
        this.sessions = this.sessions.filter((s) => s.current);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to terminate other sessions', err);
        this.errorMessage =
          'Failed to terminate other sessions. Please try again.';
        this.loading = false;
      },
    });
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }
}
