import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {

  constructor(private router: Router,) {}

  ngOnIntit() {

  }

  navigateToScreen() {
    this.router.navigate(['../account-id-creation/subscription-details']);
  }

  navigateBack() {
    this.router.navigate(['../account-id-creation/profile-details']);
  }

}
