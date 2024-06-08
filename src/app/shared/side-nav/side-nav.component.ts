import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {

  apiResponseData: any;

  private subscription: Subscription = new Subscription;

  constructor(private sharedService: SharedService,) { }

  ngOnInit() {
    this.getApiResponse();
    this.subscription = this.sharedService.headerState$.subscribe(state => {
      if (state) {
        this.refreshHeader();
      }
    });
  }

  getApiResponse() {
    this.sharedService.getMenuData().subscribe((data) => {
      this.apiResponseData = data.menu;
      console.log(this.apiResponseData)
    })
  }

  refreshHeader() {
    console.log("menu");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
