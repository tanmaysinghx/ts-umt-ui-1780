import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions-review',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './terms-conditions-review.component.html',
  styleUrl: './terms-conditions-review.component.scss'
})
export class TermsConditionsReviewComponent {

  constructor(private router: Router,) {}

  ngOnIntit() {

  }

  submitForm() {

  }

  navigateBack() {
    this.router.navigate(['../account-id-creation/subscription-details']);
  }

}
