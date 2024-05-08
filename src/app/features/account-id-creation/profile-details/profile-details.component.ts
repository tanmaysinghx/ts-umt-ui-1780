import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {

}
