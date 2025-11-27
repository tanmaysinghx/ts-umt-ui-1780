import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSession {
  id: string;
  device: string;
  ipAddress: string;
  location?: string;
  userAgent?: string;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly baseUrl = 'http://localhost:1625/v2/api/sessions';

  constructor(private readonly http: HttpClient) {}

  /** Common auth headers using access-token from localStorage */
  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access-token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /** GET /v2/api/sessions/get-sessions */
  getSessions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sessions`, {
      headers: this.buildAuthHeaders(),
    });
  }

  /** Example: terminate single session (adjust URL/verb to your backend) */
  terminateSession(sessionId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/terminate-session`,
      { sessionId },
      {
        headers: this.buildAuthHeaders(),
      }
    );
  }

  /** Example: terminate all other sessions (adjust to your backend) */
  terminateOtherSessions(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/terminate-other-sessions`,
      {},
      {
        headers: this.buildAuthHeaders(),
      }
    );
  }
}
