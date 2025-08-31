import { Component } from '@angular/core';
import { IErrorMessage } from '../../core/iErrorMessage';
import { LOGIN$USER_EMAIL$LIMIT, LOGIN$USER_PASSWORD$LIMIT } from '../../core/apiConfigurations';
import { AuthenticationModel } from '../../models/authenticationModel';
import { OverallCookieInterface } from '../../core/overallCookieInterface';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { OverallCookieModel } from '../../core/overallCookieModel';
import { CreateAccountBasicDetails } from '../../core/createAccountBasicDetails';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { RoleManagement } from '../../../admin/core/roleManagement';
import { ProjectManagerModel } from '../../../project_manager/models/projectManagerModel';
import { ProjectManagerService } from '../../../project_manager/services/project-manager.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  standalone: false
})
export class CreateAccountComponent {
  // Store the variable to store user email
  user_email: string = "";
  // Store the variable to store user password
  user_password: string = "";
  // Store password display type
  passwordFieldType: string = 'password';
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the email list
  emailLimit: number = LOGIN$USER_EMAIL$LIMIT;
  // Store the password list
  passwordLimit: number = LOGIN$USER_PASSWORD$LIMIT;
  // Store the loading
  showLoading: boolean = false;
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Declare the admin model
  adminModel: AdminModel;
  // Store the role details
  roleDetailsList: RoleManagement[] = [];
  // Declare the project manager model
  projectManagerModel: ProjectManagerModel;

  constructor(private authenticationService: AuthenticationService, private router: Router,
    private adminService: AdminService, private projectManagerService: ProjectManagerService
  ) {
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.overallCookieInterface = new OverallCookieModel();
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    // Getting all the role list
    this.GetAllRoleList();
  }

  // Getting the role name
  getRoleName(roleCode: string) {
    // Getting the index
    let roleIndex = this.roleDetailsList.findIndex(obj => obj.NameCode == roleCode);
    // Return the list
    return this.roleDetailsList[roleIndex].CurrentName.toLowerCase();
  }

  // Getting all the role list
  GetAllRoleList() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllRoleManagement().then(
      (data) => {
        // Getting the project details
        this.roleDetailsList = <RoleManagement[]>data;
      }
    );
    // End of Calling the model to retrieve the data
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

  // On change event of the email input
  onPasteEmailFunction(event: any) {
    // Getting the current text
    let currentText = event.target.value;
    // Removing the special characters
    currentText = currentText.replace(/[^a-zA-Z0-9@_.]/g, "")
    // Cutting the extra characters from the word
    this.user_email = currentText.substr(0, this.emailLimit);
  }

  // On change event of the password input
  onPastePasswordFunction(event: any) {
    // Getting the current text
    let currentText = event.target.value;
    // Cutting the extra characters from the word
    this.user_password = currentText.substr(0, this.passwordLimit);
  }

  // On click event of the eye toggle icon
  togglePasswordVisibility() {
    // Toggle the password display type
    this.passwordFieldType = (this.passwordFieldType == 'password') ? 'text' : 'password';
  }

  // On click event of the login button
  createOnClick(loginType: string) {
    // Start the loading
    this.showLoading = true;

    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      // Stop the loading
      this.showLoading = false;
      return;
    }
    // End of Check if the error messages length

    // Declare the user type
    let userType: string = "";
    // Check the login type
    switch (loginType) {
      case 'AD':
        userType = 'AD';
        break;
      case 'PM':
        userType = 'PM';
        break;
      case 'SP':
        userType = 'SP';
        break;
    }
    // End of Check the login type

    // Calling the model to check if the email already exists
    this.authenticationModel.CheckEmailExistsWithUserType(this.user_email, userType).then(
      (data) => {
        // Getting the email validation
        let emailExists: boolean = <boolean>data;

        // Check if the email exists
        if (!emailExists) {
          // Create the basic create account
          let createAccountBasicDetails: CreateAccountBasicDetails = {
            Email: this.user_email,
            Password: this.user_password,
            UserType: userType
          };
          // Redirect to the create account form
          this.router.navigate(['/createAccountForm'], { state: { response: createAccountBasicDetails } });
        } else {
          // Stop the loading
          this.showLoading = false;
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'NOT$EXISTS$USER$EMAIL',
              ErrorMessage: 'User email already exists'
            }
          );
        }
        // End of Check if the email exists
      }
    );
    // End of Calling the model to check if the email already exists
  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the user email exists
    if (!(this.user_email && this.user_email != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$USER$EMAIL',
          ErrorMessage: 'User email is mandatory'
        }
      );
    } else {
      // Check if the email is proper format
      let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,300})+$/);
      if (!regex.test(this.user_email)) {
        // Pushing the error message
        this.errorMessagesList.push(
          {
            ErrorCode: 'EMAIL$FORMAT',
            ErrorMessage: 'Email is not valid !!'
          }
        );
      }
      // End of Check if the email is proper format
    }
    // End of Check if the user email exists

    // Check if the user password exists
    if (!(this.user_password && this.user_password != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$USER$PASSWORD',
          ErrorMessage: 'User password is mandatory'
        }
      );
    } else {
      // Check if the stakeholder name length
      if (!(this.user_password && this.user_password.length > 2)) {
        // Pushing the error message
        this.errorMessagesList.push(
          {
            ErrorCode: 'LENGTH$USER$PASSWORD',
            ErrorMessage: 'User password is must be more than 2 characters'
          }
        );
      }
      // End of Check if the stakeholder name length
    }
    // End of Check if the user password exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  // Login on click function
  loginOnClick() {
    // Redirect to create account
    this.router.navigate(['/login']);
  }
}
