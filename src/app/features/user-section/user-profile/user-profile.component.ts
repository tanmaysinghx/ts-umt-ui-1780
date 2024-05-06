import { Component } from '@angular/core';
import { SnackbarDetailedComponent } from "../../../shared/snackbar/snackbar-detailed/snackbar-detailed.component";

@Component({
    selector: 'app-user-profile',
    standalone: true,
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss',
    imports: [SnackbarDetailedComponent]
})
export class UserProfileComponent {

}
