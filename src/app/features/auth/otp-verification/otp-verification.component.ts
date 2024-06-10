import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpService } from '../services/otp.service';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SnackbarDetailedComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})

export class OtpVerificationComponent {

  otpForm!: FormGroup;
  otpFormPayload: any;
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag: boolean = false;
  rememberMeFlag: boolean = false;

  constructor(
    private otpService: OtpService,
    private sharedService: SharedService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getDataFromState();
    this.createOtpForm();
  }

  getDataFromState() {
    const state = window?.history?.state;
    if (state) {
      this.rememberMeFlag = state?.rememberMeFlag ?? false;
    }
  }

  createOtpForm() {
    this.otpForm = new FormGroup({
      phoneOtpDigit1: new FormControl('', Validators.required),
      phoneOtpDigit2: new FormControl('', Validators.required),
      phoneOtpDigit3: new FormControl('', Validators.required),
      phoneOtpDigit4: new FormControl('', Validators.required),
      phoneOtpDigit5: new FormControl('', Validators.required),
      phoneOtpDigit6: new FormControl('', Validators.required),
    });
  }

  createOtpPayload() {
    this.otpFormPayload = {
      "otp": this.otpForm.controls['phoneOtpDigit1'].value + this.otpForm.controls['phoneOtpDigit2'].value + this.otpForm.controls['phoneOtpDigit3'].value + this.otpForm.controls['phoneOtpDigit4'].value + this.otpForm.controls['phoneOtpDigit5'].value + this.otpForm.controls['phoneOtpDigit6'].value
    }
    console.log(this.otpFormPayload.otp);
  }

  submitOtp() {
    this.createOtpPayload();
    let emailId = sessionStorage.getItem("user-email");
    this.otpService.verifyOtp(emailId, this.otpFormPayload.otp).subscribe((data) => {
      if (data.success) {
        console.log(this.rememberMeFlag)
        if (this.rememberMeFlag) {
          localStorage.setItem("browser-trust-flag", "trusted");
        }
        this.navigateToDashboard();
      } else if (!data.success) {
        this.openSnackbar("OTP is incorrect", "danger", 6000);
      }
    })
  }

  navigateToDashboard() {
    this.openSnackbar("OTP verification is successfull, you will be redirected to dashboard !!!", "success", 6000);
    setTimeout(() => {
      this.sharedService.refreshHeader();
      this.sharedService.refreshMenu();
      this.sharedService.refreshMain();
      this.router.navigate(["../ui-testing"]);
    }, 6000);
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
