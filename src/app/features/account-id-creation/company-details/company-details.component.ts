import { Component } from '@angular/core';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [ProgressStepperComponent],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {

}
