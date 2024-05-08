import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stepper.component.html',
  styleUrl: './progress-stepper.component.scss'
})
export class ProgressStepperComponent {

  currentPathValue: any;
  screenCount: any;
  progressBarWidth: any;

  constructor() {}

  ngOnInit() {
    this.getPathValue();
  }

  /* Function gets active path value from url and processes it */
  getPathValue() {
    const currentPath = window.location.pathname;
    this.currentPathValue = currentPath;
    let temp = this.currentPathValue.split('/');
    this.checkProgress(temp);
  }

  /* Function just to get progress for account-id-creation module */
  checkProgress(array: any) {
    if (array[2] == "profile-details") {
      this.screenCount = 0;
      this.progressBarWidth = 6;
    } else if (array[2] == "company-details") {
      this.screenCount = 1;
      this.progressBarWidth = 33.33;
    } else if (array[2] == "subscription-details") {
      this.screenCount = 2;
      this.progressBarWidth = 66.66;
    } else if (array[2] == "terms-conditions-review") {
      this.screenCount = 3;
      this.progressBarWidth = 100;
    }
  }
}
