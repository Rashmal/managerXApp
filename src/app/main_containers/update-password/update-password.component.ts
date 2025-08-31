import { Component, ElementRef, ViewChild } from '@angular/core';
import { IErrorMessage } from '../../login_registration/core/iErrorMessage';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { AuthenticationModel } from '../../login_registration/models/authenticationModel';
import { AuthenticationService } from '../../login_registration/services/authentication.service';
import { OverallCookieInterface } from '../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../login_registration/core/overallCookieModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
  standalone: false
})
export class UpdatePasswordComponent {
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the new password
  newPassword: string = "";
  // Store strong password
  strongPassword = false;
  // Store the model
  authenticationModel!: AuthenticationModel;
  // Store the current pass
  currentPassword: string = "";
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store user prompt current password
  userPromptCurrentPassword: string = "";

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    // INitialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    // Store the current password
    this.authenticationModel.GetUserPassword(this.overallCookieInterface.GetUserId()).then(
      data => {
        this.currentPassword = <string>data;
      }
    );
  }

  // On emit function from the password strength
  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  // Check if the error exists
  CheckErrorCode(errorCode: string) {
    // Find for the code
    let indexObject = this.errorMessagesList.findIndex(obj => obj.ErrorCode == errorCode);
    // Return the error object
    if (indexObject < 0) {
      return null;
    } else {
      return this.errorMessagesList[indexObject];
    }
  }

  // On click event of password
  updatePasswordOnClick() {
    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if the error messages length

    // Saving the new password
    this.authenticationModel.SetUserPassword(this.overallCookieInterface.GetUserId(), this.newPassword, this.overallCookieInterface.GetUserEmail()).then(
      data => {
        // Redirect to the login page
        window.location.reload();
      }
    );
    // End of Saving the new password

  }

  // On click function of the cancel
  cancelOnClick() {
    // Redirect to the login page
    window.location.reload();
  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the current password exists
    if (!(this.userPromptCurrentPassword && this.userPromptCurrentPassword.trim() != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CURRENT_PASSWORD',
          ErrorMessage: 'Current password is mandatory'
        }
      );
    } else if (!(this.userPromptCurrentPassword.trim() == this.currentPassword.trim())) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'ERROR$CURRENT_PASSWORD',
          ErrorMessage: 'Current password does not match'
        }
      );
    }
    // End of Check if the current password exists

    // Check if the new password exists
    if (!(this.newPassword && this.newPassword.trim() != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$NEW_PASSWORD',
          ErrorMessage: 'New password is mandatory'
        }
      );
    }
    // End of Check if the new password exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

}
