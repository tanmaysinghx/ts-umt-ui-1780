import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrump',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.scss'],
})
export class BreadcrumpComponent implements OnInit, OnDestroy {
  pathArray: string[] = [];
  activePathValue = '';

  private routerSub?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Initial build
    this.buildBreadcrumbFromUrl();

    // Rebuild on every navigation end
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.buildBreadcrumbFromUrl();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  /** Build breadcrumb segments from current router URL */
  private buildBreadcrumbFromUrl(): void {
    // e.g. "/dashboard/profile/settings?tab=general" -> "/dashboard/profile/settings"
    const url = this.router.url.split('?')[0];

    // Split path and drop empty segments
    const segments = url.split('/').filter(Boolean); // removes leading "" from initial "/"

    this.pathArray = [];
    this.activePathValue = '';

    segments.forEach((segment, index) => {
      const label = this.capitalizeSegment(segment);

      if (index === segments.length - 1) {
        // Last segment = active page
        this.activePathValue = label;
      } else {
        // Intermediate segments
        this.pathArray.push(label);
      }
    });
  }

  /** "user-profile" -> "User Profile" */
  private capitalizeSegment(str: string): string {
    return str
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
