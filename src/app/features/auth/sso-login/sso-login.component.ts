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

        // Use the TS Auth Service logic directly or via API Gateway if preferred
        // Here we call the backend SSO endpoint directly as per plan
        const backendUrl = `${environment.ssoService}/sso/authorize`;

        // We need to construct the URL with query params because the backend 
        // expects them in the query string for the POST as well (based on current controller logic)
        // or we can send them in body if we updated the controller.
        // The plan said we'd update the controller to accept JSON body.
        // Let's assume we will send everything in the body or query as needed.
        // Current controller reads client_id etc from req.query even for POST.
        // We will update controller to allow body as well, but for safety let's pass params in query too.

        const params = new URLSearchParams(this.queryParams).toString();
        const url = `${backendUrl}?${params}`;

        this.http.post(url, { email, password }).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                if (res.redirectUrl) {
                    window.location.href = res.redirectUrl;
                } else {
                    this.openSnackbar('Login successful but no redirect URL', 'warning', 5000);
                }
            },
            error: (err) => {
                this.isLoading = false;
                const msg = err?.error?.message || err?.error || 'Login failed';
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
