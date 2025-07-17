import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpService } from '../services/otp.service';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CryptoService } from '../../../shared/services/crypto.service';

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
  transactionId: any;
  emailId: any;

  constructor(
    private readonly otpService: OtpService,
    private readonly sharedService: SharedService,
    private readonly router: Router,
    private readonly loginService: LoginService
  ) { }

  ngOnInit() {
    this.getDataFromState();
    this.createOtpForm();
  }

  getDataFromState() {
    const state = window?.history?.state;
    if (state) {
      this.rememberMeFlag = state?.rememberMeFlag ?? false;
      this.transactionId = state?.transactionId;
      this.emailId = state?.emailId ?? CryptoService.decrypt(localStorage.getItem("rememberedEmail") || "");
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
    this.otpService.verifyOtp(this.emailId, this.otpFormPayload.otp).subscribe((data) => {
      if (data.success) {
        // if (this.rememberMeFlag) {
        //   this.setBrowserTrustFlag(emailId);
        // }
        this.otpService.resumeWorklflow(this.transactionId).subscribe((data) => {
          if (data.success) {
            this.setSessionStorage(data);
          }
        })
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

  setSessionStorage(data: any) {
    console.log(data);
    sessionStorage.setItem("access-token", data?.data?.downstreamResponse?.microserviceResponse?.data?.accessToken);
    sessionStorage.setItem("refresh-token", data?.data?.downstreamResponse?.microserviceResponse?.data?.refreshToken);
    sessionStorage.setItem("user-email", data?.data?.downstreamResponse?.microserviceResponse?.data?.email);
    sessionStorage.setItem("user-role", data?.data?.downstreamResponse?.microserviceResponse?.data?.roleName);
    sessionStorage.setItem("user-role-id", data?.data?.downstreamResponse?.microserviceResponse?.data?.roleId);
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
      this.loginService.loginEvent(sessionStorage.getItem("access-token") ?? "");
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
