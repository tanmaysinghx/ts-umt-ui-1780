import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {

  apiResponseData: any;
  userType: any;

  private subscription: Subscription = new Subscription;

  constructor(private readonly sharedService: SharedService, private readonly router: Router) { }

  ngOnInit() {
    this.checkUserType();
    this.getApiResponse();
    this.detectLogin();
  }

  checkUserType() {
    this.userType = sessionStorage?.getItem('user-role-id') ?? "0005";
  }

  getApiResponse() {
    this.sharedService.getMenuData(this.userType).subscribe((data) => {
      this.apiResponseData = data.menu;
      console.log(this.apiResponseData)
    })
  }

  detectLogin() {
    this.subscription = this.sharedService.headerState$.subscribe(state => {
      if (state) {
        this.refreshMenu();
      }
    });
  }

  refreshMenu() {
    console.log("menu");
    this.getApiResponse();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  // Add this to your component class
  toggleDropdown(item: any) {
    item.isExpanded = !item.isExpanded;
  }
}
