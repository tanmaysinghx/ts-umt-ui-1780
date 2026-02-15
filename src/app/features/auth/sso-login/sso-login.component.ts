import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SnackbarDetailedComponent } from '../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component';

@Component({
    selector: 'app-sso-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SnackbarDetailedComponent],
    templateUrl: './sso-login.component.html',
})
export class SsoLoginComponent implements OnInit {
    loginForm!: FormGroup;
    queryParams: any = {};
    snackbarMessage: any;
    snackbarType: any;
    snackbarDuration: any;
    snackbarFlag = false;
    isLoading = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly http: HttpClient
    ) { }

    ngOnInit() {
        this.createLoginForm();
        this.route.queryParams.subscribe((params) => {
            this.queryParams = params;
            if (!this.queryParams.client_id || !this.queryParams.redirect_uri) {
                this.openSnackbar('Missing required SSO parameters', 'danger', 10000);
            }
        });
    }

    createLoginForm() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
        });
    }

    submitForm() {
        if (this.loginForm.invalid) {
            this.openSnackbar('Please check your inputs', 'danger', 3000);
            return;
        }

        this.isLoading = true;
        const { email, password } = this.loginForm.value;

        // Use API Gateway Workflow for SSO Authorize
        const gatewayUrl = `${environment.apiGatewayService}/sso-authorize-post`;

        const params = new URLSearchParams(this.queryParams).toString();
        const url = `${gatewayUrl}?${params}`;

        this.http.post(url, { email, password }).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                // Gateway returns: { success: true, data: { downstreamResponse: { ...actual_response... } } }
                const downstream = res.data?.downstreamResponse;

                if (downstream?.redirectUrl) {
                    window.location.href = downstream.redirectUrl;
                } else if (downstream?.data?.redirectUrl) {
                    // Check if it's nested in data
                    window.location.href = downstream.data.redirectUrl;
                } else {
                    this.openSnackbar('Login successful but no redirect URL', 'warning', 5000);
                }
            },
            error: (err) => {
                this.isLoading = false;
                // Try to extract error message from Gateway wrapped error or direct error
                const gatewayError = err?.error?.errors?.reason || err?.error?.message;
                const downstreamError = err?.error?.data?.downstreamResponse?.message || err?.error?.data?.downstreamResponse?.error;

                const msg = downstreamError || gatewayError || 'Login failed';
                this.openSnackbar(msg, 'danger', 5000);
            },
        });
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
