
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AuthTokenData } from '../models/auth.models';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-oauth2-callback',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h2 class="text-xl font-semibold mb-2">Processing Login...</h2>
      <p class="text-gray-500">Please wait while we redirect you.</p>
    </div>
  </div>`
})
export class OAuth2CallbackComponent implements OnInit {

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly loginService: LoginService
    ) { }

    ngOnInit(): void {
        const params = this.route.snapshot.queryParams;
        if (params['accessToken'] && params['refreshToken']) {
            const authData: AuthTokenData = {
                accessToken: params['accessToken'],
                refreshToken: params['refreshToken'],
                email: params['email'],
                roleName: params['roleName'],
                roleId: params['roleId']
            };

            this.loginService.handleSsoLogin(authData);

            // Redirect with a small delay or immediately
            this.router.navigate(['/dashboard/applications']);
        } else {
            console.error('Missing tokens in callback URL');
            this.router.navigate(['/auth/login']);
        }
    }
}
