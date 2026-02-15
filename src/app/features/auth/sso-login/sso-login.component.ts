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
import { jwtDecode, JwtPayload } from 'jwt-decode';

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
    autoLoginAttempted = false; // Tracks if auto-login was tried

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
                return;
            }
            // Okta-style: Check for existing session before showing login form
            this.tryAutoLogin();
        });
    }

    createLoginForm() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
        });
    }

    /**
     * Okta-style auto-login: If user already has a valid session (access-token
     * in localStorage), automatically authorize the SSO request without
     * showing the login form. Falls back to manual login if token is
     * missing, expired, or the auto-authorize call fails.
     */
    private tryAutoLogin() {
        const accessToken = localStorage.getItem('access-token');
        if (!accessToken) return; // No session, show form

        // Check token expiry
        try {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < now) {
                // Token expired — try refresh first
                this.tryRefreshAndAutoLogin();
                return;
            }
        } catch {
            return; // Malformed token, show form
        }

        // Token is valid — auto-authorize
        this.performAutoAuthorize(accessToken);
    }

    /**
     * If access token is expired, attempt to use the refresh token to get
     * a new access token and then auto-login.
     */
    private tryRefreshAndAutoLogin() {
        const refreshToken = localStorage.getItem('refresh-token');
        if (!refreshToken) return; // No refresh token, show form

        this.isLoading = true;
        this.autoLoginAttempted = true;

        const refreshUrl = `${environment.apiGatewayService}/auth-refresh-token`;
        this.http.post(refreshUrl, { refreshToken }).subscribe({
            next: (res: any) => {
                const newAccessToken = res?.data?.downstreamResponse?.data?.accessToken;
                if (newAccessToken) {
                    localStorage.setItem('access-token', newAccessToken);
                    this.performAutoAuthorize(newAccessToken);
                } else {
                    this.isLoading = false; // Fall back to form
                }
            },
            error: () => {
                this.isLoading = false; // Fall back to form
            }
        });
    }

    /**
     * Auto-authorize the SSO request using the existing access token.
     * Sends the token to the SSO authorize endpoint, which validates it
     * and returns a redirect URL with the authorization code.
     */
    private performAutoAuthorize(accessToken: string) {
        this.isLoading = true;
        this.autoLoginAttempted = true;

        const gatewayUrl = `${environment.apiGatewayService}/sso-authorize-post`;
        const params = new URLSearchParams(this.queryParams).toString();
        const url = `${gatewayUrl}?${params}`;

        this.http.post(url, { accessToken }).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                const downstream = res.data?.downstreamResponse;

                if (downstream?.redirectUrl) {
                    window.location.href = downstream.redirectUrl;
                } else if (downstream?.data?.redirectUrl) {
                    window.location.href = downstream.data.redirectUrl;
                } else {
                    // Auto-login didn't produce a redirect, fall back to form
                    this.autoLoginAttempted = false;
                    this.openSnackbar('Session found but auto-login failed. Please login manually.', 'warning', 5000);
                }
            },
            error: () => {
                this.isLoading = false;
                this.autoLoginAttempted = false;
                // Silently fall back to manual login form
            }
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
                const downstream = res.data?.downstreamResponse;

                if (downstream?.redirectUrl) {
                    window.location.href = downstream.redirectUrl;
                } else if (downstream?.data?.redirectUrl) {
                    window.location.href = downstream.data.redirectUrl;
                } else {
                    this.openSnackbar('Login successful but no redirect URL', 'warning', 5000);
                }
            },
            error: (err) => {
                this.isLoading = false;
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

