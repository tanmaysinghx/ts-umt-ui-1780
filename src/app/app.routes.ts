import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { OtpVerificationComponent } from './features/auth/otp-verification/otp-verification.component';
import { MaintenancePageComponent } from './shared/maintenance-page/maintenance-page.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ServerErrorPageComponent } from './shared/server-error-page/server-error-page.component';
import { UserChatsComponent } from './features/communication/user-chats/user-chats.component';
import { MyProfileComponent } from './features/my-section/my-profile/my-profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'my-section/my-profile', pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    { path: 'auth/otp-verification', component: OtpVerificationComponent },
    { path: 'maintenance-page', component: MaintenancePageComponent },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: 'server-error-page', component: ServerErrorPageComponent },
    { path: 'user-chats', component: UserChatsComponent },
    { path: 'my-section/my-profile', component: MyProfileComponent },
];


