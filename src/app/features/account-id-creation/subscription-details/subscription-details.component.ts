import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.scss'
})
export class SubscriptionDetailsComponent {

}
