import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { OtpVerificationComponent } from './features/auth/otp-verification/otp-verification.component';
import { MaintenancePageComponent } from './shared/maintenance-page/maintenance-page.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ServerErrorPageComponent } from './shared/server-error-page/server-error-page.component';
import { MyProfileComponent } from './features/my-section/my-profile/my-profile.component';
import { UserListComponent } from './features/user-management/user-list/user-list.component';
import { DashboardApplicationsComponent } from './features/dashboard/dashboard-applications/dashboard-applications.component';
import { MyAccountComponent } from './features/my-section/my-account/my-account.component';
import { SessionManagementComponent } from './features/session-management/session-management.component';
import { SecuritySettingsComponent } from './features/security-settings/security-settings.component';
import { MyAccessComponent } from './features/my-section/my-access/my-access.component';
import { MyProfilePasswordChangeComponent } from './features/my-section/my-profile-password-change/my-profile-password-change.component';
import { DashboardFavoritesComponent } from './features/dashboard/dashboard-favorites/dashboard-favorites.component';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users.component';
import { MonitoringUsersComponent } from './features/admin/monitoring-users/monitoring-users.component';
import { RoleManagerComponent } from './features/admin/role-manager/role-manager.component';
import { ApplicationManagerComponent } from './features/admin/application-manager/application-manager.component';
import { AddApplicationComponent } from './features/admin/add-application/add-application.component';
import { LandingScreenComponent } from './features/product-pages/landing-screen/landing-screen.component';
import { AiLabsScreenComponent } from './features/product-pages/ai-labs-screen/ai-labs-screen.component';
import { ProductScreenComponent } from './features/product-pages/product-screen/product-screen.component';

export const routes: Routes = [
    { path: '', component: LandingScreenComponent },
    { path: 'ai-labs', component: AiLabsScreenComponent },
    { path: 'products', component: ProductScreenComponent },

    //auth urls
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    { path: 'auth/otp-verification', component: OtpVerificationComponent },

    //my-section urls
    { path: 'my-section/my-profile', component: MyProfileComponent },
    { path: 'my-section/my-account', component: MyAccountComponent },
    { path: 'my-section/my-access', component: MyAccessComponent },
    { path: 'my-section/my--profile-change-passsword', component: MyProfilePasswordChangeComponent },

    //dashboard urls
    { path: 'dashboard/applications', component: DashboardApplicationsComponent },
    { path: 'dashboard/application-favorites', component: DashboardFavoritesComponent },

    //service urls
    { path: 'maintenance-page', component: MaintenancePageComponent },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: 'server-error-page', component: ServerErrorPageComponent },

    // user management urls
    { path: 'user-management/user-list', component: UserListComponent },

    //session management
    { path: 'session-management', component: SessionManagementComponent },

    //secuirty settings
    { path: 'security-settings', component: SecuritySettingsComponent },

    //admin urls
    { path: 'admin/manage-users', component: ManageUsersComponent },
    { path: 'admin/monitor-users', component: MonitoringUsersComponent },
    { path: 'admin/role-manager', component: RoleManagerComponent },
    { path: 'admin/application-manager', component: ApplicationManagerComponent },
    { path: 'admin/add-application', component: AddApplicationComponent },
];