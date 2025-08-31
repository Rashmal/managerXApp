import { Component } from '@angular/core';
import { UserBasicDetails } from '../../core/userBasicDetails';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';
import { StripePaymentOverdue } from '../../../login_registration/core/stripe/StripePaymentOverdue';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
  providers: [DialogService],
  standalone: false
})
export class AdminSettingsComponent {
  // Store the user basic details
  userBasicDetails: UserBasicDetails = {
    UserId: 0,
    Avatar: '',
    Email: '',
    FirstName: '',
    LastName: '',
    ManageNotificationViaEmail: false,
    ManageNotificationViaInApp: false,
    ManageNotificationViaSms: false,
    RoleCode: '',
    RoleName: '',
    UserType: '',
    ContactNumber: '',
    CompanyName: '',
    TotalRecords: 0
  }
  // Declare the admin model
  adminModel: AdminModel;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
// Store the StripePayment  data
  StripePaymentOverdue !: StripePaymentOverdue;

  constructor(private adminService: AdminService, public dialogService: DialogService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.overallCookieInterface = new OverallCookieModel();
  }
  
  ngOnInit() {
    // Getting the basic user details
    this.GetBasicUserDetails();

    // Retrieving cached data
    const cachedData = localStorage.getItem('StripeDetails');
    this.StripePaymentOverdue = cachedData ? JSON.parse(cachedData) : null;
    
 
  }

  // Getting the basic user details
  GetBasicUserDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllBasicUserDetails(this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting the project details
        this.userBasicDetails = <UserBasicDetails>data;
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


  // On click function of edit profile
  editProfileOnClick() {
    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if the error messages length

    // Calling the model to save the data
    this.adminModel.SetAllBasicUserDetails(this.userBasicDetails).then(
      () => {
        // Open the alert box
        let refAlert = this.dialogService.open(AlertBoxComponent, {
          showHeader: false,
          width: '22%'
        });
        // End of Open the alert box

        // Getting the basic user details
        this.GetBasicUserDetails();
      }
    );
    // End of Calling the model to save the data
  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the first name exists
    if (!(this.userBasicDetails && this.userBasicDetails.FirstName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$FIRST_NAME',
          ErrorMessage: 'First name is mandatory'
        }
      );
    }
    // End of Check if the first name exists

    // Check if the last name exists
    if (!(this.userBasicDetails && this.userBasicDetails.LastName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$LAST_NAME',
          ErrorMessage: 'Last name is mandatory'
        }
      );
    }
    // End of Check if the last name exists

    // Check if the contact number exists
    if (!(this.userBasicDetails && this.userBasicDetails.ContactNumber != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CONTACT_NUMBER',
          ErrorMessage: 'Contact number is mandatory'
        }
      );
    }
    // End of Check if the contact number exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  cancelSubscription(){
    
  }
  
}
