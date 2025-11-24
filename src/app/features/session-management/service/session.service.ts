import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  providedIn: 'root'
})
export class SessionService {

  private readonly baseUrl = '/api/sessions';

  constructor(private readonly http: HttpClient) {}

  getSessions(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(this.baseUrl);
  }

  terminateSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${sessionId}`);
  }

  terminateOtherSessions(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/terminate-others`, {});
  }
}