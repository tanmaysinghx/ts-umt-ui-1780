import { Component } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/service/snackbar.service';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SnackbarDetailedComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [SnackbarService]
})
export class LoginComponent {

  constructor() { }
}
