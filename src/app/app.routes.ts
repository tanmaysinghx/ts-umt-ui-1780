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
import { ProfileDetailsComponent } from './features/account-id-creation/profile-details/profile-details.component';
import { CompanyDetailsComponent } from './features/account-id-creation/company-details/company-details.component';
import { SubscriptionDetailsComponent } from './features/account-id-creation/subscription-details/subscription-details.component';
import { TermsConditionsReviewComponent } from './features/account-id-creation/terms-conditions-review/terms-conditions-review.component';
import { UiTestingComponent } from './features/ui-testing/ui-testing.component';
import { UserListComponent } from './features/user-management/user-list/user-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'user-management/user-list', pathMatch: 'full' },

    { path: 'ui-testing', component: UiTestingComponent },

    //auth urls
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    { path: 'auth/otp-verification', component: OtpVerificationComponent },

    { path: 'my-section/my-profile', component: MyProfileComponent },

    //account-id-creation urls
    { path: 'account-id-creation/profile-details', component: ProfileDetailsComponent },
    { path: 'account-id-creation/company-details', component: CompanyDetailsComponent },
    { path: 'account-id-creation/subscription-details', component: SubscriptionDetailsComponent },
    { path: 'account-id-creation/terms-conditions-review', component: TermsConditionsReviewComponent },

    //service urls
    { path: 'maintenance-page', component: MaintenancePageComponent },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: 'server-error-page', component: ServerErrorPageComponent },
    { path: 'user-chats', component: UserChatsComponent },

    // user management urls
    { path: 'user-management/user-list', component: UserListComponent },
];


