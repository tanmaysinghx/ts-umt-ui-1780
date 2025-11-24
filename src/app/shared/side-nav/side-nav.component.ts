import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  apiResponseData: any[] = [];
  userType: string = '0005';
  appVersion = 'Pre-Alpha';
  environmentLabel = 'DEV'; // or 'QA', 'PROD', etc.

  private subscription = new Subscription();

  constructor(
    private readonly sharedService: SharedService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.checkUserType();
    this.getApiResponse();
    this.detectLogin();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkUserType() {
    this.userType = sessionStorage?.getItem('user-role-id') ?? '0005';
  }

  private getApiResponse() {
    this.sharedService.getMenuData(this.userType).subscribe({
      next: (data) => {
        this.apiResponseData = data?.menu || [];
      },
      error: (err) => {
        console.error('Failed to load menu data', err);
        this.apiResponseData = [];
      },
    });
  }

  private detectLogin() {
    this.subscription = this.sharedService.headerState$.subscribe((state) => {
      if (state) {
        this.refreshMenu();
      }
    });
  }

  private refreshMenu() {
    this.getApiResponse();
  }

  navigateTo(url: string) {
    if (!url) return;
    this.router.navigate([url]);
  }

  toggleDropdown(item: any) {
    item.isExpanded = !item.isExpanded;
  }

  /** Highlight active link – used by template for classes */
  isActive(path: string): boolean {
    if (!path) return false;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return this.router.url.startsWith(cleanPath);
  }

  /** Parent item is “active” if any child sub-option is active */
  hasActiveChild(item: any): boolean {
    if (!item?.subOptions?.length) return false;
    return item.subOptions.some((sub: any) => this.isActive(sub.routerPath));
  }
}
