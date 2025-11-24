import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar-detailed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar-detailed.component.html',
  styleUrls: ['./snackbar-detailed.component.scss'],
})
export class SnackbarDetailedComponent implements OnInit {
  @Input() message: any;
  @Input() snackbarType: any;
  @Input() duration: any;

  infoFlag = false;
  dangerFlag = false;
  successFlag = false;
  warningFlag = false;
  darkFlag = false;
  snackbarMessage: any;

  ngOnInit() {
    this.openSnackBar(this.message, this.snackbarType, this.duration);
    console.log('Snackbar Triggered !!!');
  }

  openSnackBar(message: any, snackbarType: any, duration: any) {
    this.snackbarMessage = message;

    if (snackbarType === 'info') {
      this.infoFlag = true;
    } else if (snackbarType === 'danger') {
      this.dangerFlag = true;
    } else if (snackbarType === 'success') {
      this.successFlag = true;
    } else if (snackbarType === 'warning') {
      this.warningFlag = true;
    } else if (snackbarType === 'dark') {
      this.darkFlag = true;
    }

    this.closeSnackbar(duration, snackbarType);
  }

  closeSnackbar(duration: any, type: any) {
    setTimeout(() => {
      if (type === 'info') this.infoFlag = false;
      else if (type === 'danger') this.dangerFlag = false;
      else if (type === 'success') this.successFlag = false;
      else if (type === 'warning') this.warningFlag = false;
      else if (type === 'dark') this.darkFlag = false;
    }, duration);
  }

  // manual close (X button)
  closeNow() {
    this.infoFlag = false;
    this.dangerFlag = false;
    this.successFlag = false;
    this.warningFlag = false;
    this.darkFlag = false;
  }
}