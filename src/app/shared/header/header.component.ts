import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  loggedInFlag: boolean = false;

  private subscription: Subscription = new Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.subscription = this.sharedService.headerState$.subscribe(state => {
      if (state) {
        this.refreshHeader();
      }
    });
  }

  refreshHeader() {
    console.log("header");
    this.loggedInFlag = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
