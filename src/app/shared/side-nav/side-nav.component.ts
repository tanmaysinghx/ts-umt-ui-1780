import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  
  apiResponseData: any;

  constructor(private sharedService: SharedService) {} 

  ngOnInit() {
    this.getApiResponse();
  }

  getApiResponse() {
    this.sharedService.getMenuData().subscribe((data) => {
      this.apiResponseData = data.menu;
      console.log(this.apiResponseData)
    })
  }

}
