import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar-detailed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar-detailed.component.html',
  styleUrl: './snackbar-detailed.component.scss'
})
export class SnackbarDetailedComponent {

  @Input() message: any;
  @Input() snackbarType: any;
  @Input() duration: any;

  infoFlag: boolean = false;
  dangerFlag: boolean = false;
  successFlag: boolean = false;
  warningFlag: boolean = false;
  darkFlag: boolean = false;
  snackbarMessage: any;


  ngOnInit() {
    this.openSnackBar(this.message, this.snackbarType, this.duration);
  }

  openSnackBar(message: any, snackbarType: any, duration: any) {
    this.snackbarMessage = message;
    if (snackbarType == "info") {
      this.infoFlag = true;
      this.closeSnackbar(duration, snackbarType);
    } else if (snackbarType == "danger") {
      this.dangerFlag = true;
      this.closeSnackbar(duration, snackbarType);
    } else if (snackbarType == "success") {
      this.successFlag = true;
      this.closeSnackbar(duration, snackbarType);
    } else if (snackbarType == "warning") {
      this.warningFlag = true;
      this.closeSnackbar(duration, snackbarType);
    } else if (snackbarType == "dark") {
      this.darkFlag = true;
      this.closeSnackbar(duration, snackbarType);
    }
  }

  closeSnackbar(duration: any, type: any) {
    if (type == "info") {
      setTimeout(() => {
        this.infoFlag = false;
      }, duration);
    } else if (type == "danger") {
      setTimeout(() => {
        this.dangerFlag = false;
      }, duration);
    } else if (type == "success") {
      setTimeout(() => {
        this.successFlag = false;
      }, duration);
    } else if (type == "warning") {
      setTimeout(() => {
        this.warningFlag = false;
      }, duration);
    } else if (type == "dark") {
      setTimeout(() => {
        this.darkFlag = false;
      }, duration);
    }
  }
}
