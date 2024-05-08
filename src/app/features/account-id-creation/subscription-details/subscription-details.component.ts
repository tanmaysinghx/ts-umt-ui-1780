import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.scss'
})
export class SubscriptionDetailsComponent {

  constructor(private router: Router,) {}

  ngOnIntit() {

  }

  navigateToScreen() {
    this.router.navigate(['../account-id-creation/terms-conditions-review']);
  }

  navigateBack() {
    this.router.navigate(['../account-id-creation/company-details']);
  }

}
