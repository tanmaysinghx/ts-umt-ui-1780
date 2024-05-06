import { Component } from '@angular/core';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SnackbarDetailedComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})
export class LoginComponent {
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag: boolean = false;

  constructor() { }

  ngOnInit() {

  }

  dummySubmit() {
    this.openSnackbar("This is a dummy submit functionality just to test snackbar functionality. Please review my snackbar here !!!", "danger", 6000)
  }

  openSnackbar(message: any, type: any, duration: any) {
    this.snackbarMessage = message;
    this.snackbarType = type;
    this.snackbarDuration = duration;
    this.snackbarFlag = true;
    setTimeout(() => {
      this.snackbarFlag = false;
    }, duration);
  }
}
