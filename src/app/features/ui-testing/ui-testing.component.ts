import { Component } from '@angular/core';
import { UiTestingService } from '../services/ui-testing.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ui-testing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-testing.component.html',
  styleUrl: './ui-testing.component.scss'
})
export class UiTestingComponent {

  apiData: any;

  constructor(private uiTestingService: UiTestingService, private router: Router,) {}

  ngOnInit() {
    let temp = sessionStorage.getItem("intial-ui-refresh");
    if (temp == null) {
      sessionStorage.setItem("intial-ui-refresh", "done");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    this.uiTestingService.getUIScreens().subscribe((data) => {
      this.apiData = data.screens;
      console.log(this.apiData)
    })
  }

  navigateOnClick(link: any) {
    let temp = "../" + link;
    this.router.navigate([temp]);
  }

}
