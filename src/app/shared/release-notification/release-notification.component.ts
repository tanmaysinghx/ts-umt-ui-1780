import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ReleaseData {
  version: string;
  title: string;
  message: string;
  releaseNotes: string[];
  showTimer: boolean;
  timerDuration: number;
}

@Component({
  selector: 'app-release-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-notification.component.html',
  styleUrls: ['./release-notification.component.scss']
})
export class ReleaseNotificationComponent implements OnInit, OnDestroy {
  isVisible = false;
  releaseData: ReleaseData | null = null;
  remainingTime = 0;
  private timerInterval: any;
  private readonly STORAGE_KEY = 'seen_release_version';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkRelease();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private checkRelease() {
    const assetUrl = environment.cmsUrl + 'assets/data/release-data.json';
    this.http.get<ReleaseData>(assetUrl).subscribe({
      next: (data) => {
        this.releaseData = data;
        const seenVersion = localStorage.getItem(this.STORAGE_KEY);

        if (seenVersion !== data.version) {
          this.showNotification(data);
        }
      },
      error: (err) => console.error('Failed to load release data', err)
    });
  }

  private showNotification(data: ReleaseData) {
    this.isVisible = true;
    if (data.showTimer && data.timerDuration > 0) {
      this.remainingTime = data.timerDuration;
      this.startTimer();
    }
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.closeNotification();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  closeNotification() {
    this.clearTimer();
    this.isVisible = false;
    if (this.releaseData) {
      localStorage.setItem(this.STORAGE_KEY, this.releaseData.version);
    }
  }
}
