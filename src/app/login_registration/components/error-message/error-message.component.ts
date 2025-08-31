import { Component } from '@angular/core';
import { ErrorMessage } from '../../core/errorMessage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  standalone: false
})
export class ErrorMessageComponent {
  // Store the error message
  errorMessage: ErrorMessage;
  // Store the cookie interface
  //overallCookieInterface: OverallCookieInterface;
  // Store the authentication model
  //authenticationModel: AuthenticationModel;
  // Storing the loading
  showLoading: boolean = false;

  // Constructor
  constructor(private router: Router) {
    // Getting the error message
    this.errorMessage = this.router.getCurrentNavigation()!.extras.state?.['response'];
    // End of Getting the error message

    // Initialize the model
    //this.authenticationModel = new AuthenticationModel(this.authenticationService);
    //this.overallCookieInterface = new OverallCookieModel();
  }

  // On click function of the login button
  loginClick() {
    // Starting the loading
    this.showLoading = true;
    // Calling the model to logout function
    // this.authenticationModel.LogoutUserService(this.overallCookieInterface.GetUserEmail(), this.overallCookieInterface.GetCompanyId()).then(
    //   (data) => {
    //     // Clear the local storage cookie data
    //     this.overallCookieInterface.ClearCookies();
    //     // Redirect to the login page
    //     this.router.navigate(['/auth']);
    //     // Stop the loading
    //     this.showLoading = false;
    //   }
    // );
    // End of Calling the model to logout function

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}

