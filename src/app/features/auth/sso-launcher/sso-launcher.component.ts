
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sso-launcher',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center max-w-md w-full">
        <!-- Spinner -->
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Launching {{ appName }}...
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Securely signing you in via Single Sign-On.
        </p>
        
        <!-- Fallback/Debug -->
        <div *ngIf="error" class="mt-4 text-red-500 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class SsoLauncherComponent implements OnInit {
    appName = 'Application';
    error = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        const params = this.route.snapshot.queryParams;
        const targetUrl = params['target'];
        this.appName = params['name'] || 'Application';
        const method = params['method'] || 'GET'; // Default to GET for now to be safe, or 'POST' if preferred

        // Retrieve tokens from storage
        const accessToken = localStorage.getItem('access-token');
        const refreshToken = localStorage.getItem('refresh-token') || ''; // Adjust if needed
        // Cookie service isn't strictly needed here if we just read what login service stored elsewhere, 
        // but usually refresh token is in cookie or local storage depending on implementation.
        // Dashboard component was using cookieService for refresh token but login service stored it in cookie.

        // Check if we have tokens. If not, redirect to login?
        if (!accessToken) {
            this.error = 'No active session found. Redirecting to login...';
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
            return;
        }

        if (!targetUrl) {
            this.error = 'Invalid launch target.';
            return;
        }

        if (method === 'POST') {
            this.performPostHandoff(targetUrl, {
                accessToken,
                refreshToken,
                email: localStorage.getItem('user-email') || ''
            });
        } else {
            // GET fallback
            this.performGetHandOff(targetUrl, accessToken, refreshToken);
        }
    }

    private performGetHandOff(url: string, accessToken: string, refreshToken: string) {
        // Reconstruct URL with params
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = `${url}${separator}accessToken=${accessToken}&refreshToken=${refreshToken}&userEmail=${localStorage.getItem('user-email')}`;
        window.location.href = finalUrl;
    }

    private performPostHandoff(url: string, data: any) {
        // Create a form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.style.display = 'none';

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }
}
