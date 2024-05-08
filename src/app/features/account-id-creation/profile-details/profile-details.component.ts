import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {

  constructor(private router: Router,) {}

  ngOnIntit() {

  }

  navigateToScreen() {
    this.router.navigate(['../account-id-creation/company-details']);
  }
}
