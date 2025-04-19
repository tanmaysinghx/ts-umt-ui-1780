import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm!: FormGroup;
  otpFormPayload: any;
  snackbarMessage: any;
  snackbarType: any;
  snackbarDuration: any;
  snackbarFlag: boolean = false;
  rememberMeFlag: boolean = false;
  otpLength = 6;

  constructor(
    private readonly otpService: OtpService,
    private readonly sharedService: SharedService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.generateOtp();
    this.getDataFromState();
    this.createOtpForm();
  }

  generateOtp() {
    let emailId = sessionStorage.getItem("user-email");
    let requestBody = {
      "gearId": "1625",
      "scenarioId": "00002",
      "userEmail": emailId,
      "emailOTP": true,
      "mobileOTP": false
    }
    this.otpService.generateOtp(requestBody).subscribe((data) => {
      if (data.success) {
        this.openSnackbar("OTP generation is successfull, otp will be valid for 10 mins", "success", 6000);
      }
    },
      (error) => {
        let err = "Please review server errors and correct them before submitting the form again !!!  " + error.error.message;
        console.log(error);
        this.openSnackbar(err, "danger", 6000);
      })
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
      console.log(data);
      if (data.success) {
        if (this.rememberMeFlag) {
          this.setBrowserTrustFlag(emailId);
        }
        this.navigateToDashboard();
      } else if (!data.success) {
        this.openSnackbar("OTP is incorrect", "danger", 6000);
      }
    },
      (error) => {
        let err = "Please review server errors and correct them before submitting the form again !!!  " + error.error.message;
        console.log(error);
        this.openSnackbar(err, "danger", 6000);
      })
  }

  setBrowserTrustFlag(email: any) {
    localStorage.setItem("browser-trust-flag", "trusted");
    let trustedEmails = JSON.parse(localStorage.getItem("trusted-emails") || "[]");
    if (!trustedEmails.includes(email)) {
      trustedEmails.push(email);
    }
    localStorage.setItem("trusted-emails", JSON.stringify(trustedEmails));
  }

  navigateToDashboard() {
    this.openSnackbar("OTP verification is successfull, you will be redirected to dashboard !!!", "success", 6000);
    setTimeout(() => {
      this.sharedService.refreshHeader();
      this.sharedService.refreshMenu();
      this.sharedService.refreshMain();
      this.router.navigate(["../dashboard/applications"]);
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

  onInputChange(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < this.otpLength - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    if (pastedText.length === this.otpLength) {
      const inputsArray = this.otpInputs.toArray();
      for (let i = 0; i < this.otpLength; i++) {
        const char = pastedText.charAt(i);
        inputsArray[i].nativeElement.value = char;
        this.otpForm.get(`phoneOtpDigit${i + 1}`)?.setValue(char);
      }
      inputsArray[this.otpLength - 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      prevInput.nativeElement.focus();
      prevInput.nativeElement.select();
    }
  }

}
