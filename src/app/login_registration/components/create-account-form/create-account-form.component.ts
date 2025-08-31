import { Component } from '@angular/core';
import { CreateAccountBasicDetails } from '../../core/createAccountBasicDetails';
import { Router } from '@angular/router';
import { AuthenticationModel } from '../../models/authenticationModel';
import { OverallCookieInterface } from '../../core/overallCookieInterface';
import { AuthenticationService } from '../../services/authentication.service';
import { OverallCookieModel } from '../../core/overallCookieModel';
import { SelectItem } from 'primeng/api';
import { RoleDetails } from '../../core/roleDetails';
import { Country } from '../../core/country';
import { UserDetails } from '../../core/userDetails';
import { IErrorMessage } from '../../core/iErrorMessage';
import { CREATE$ACCOUNT_ADDRESS$CITY$LIMIT, CREATE$ACCOUNT_ADDRESS$POSTCODE$LIMIT, CREATE$ACCOUNT_ADDRESS$STATE$LIMIT, CREATE$ACCOUNT_ADDRESS$STREET$LIMIT, CREATE$ACCOUNT_COMPANY$NAME$LIMIT, CREATE$ACCOUNT_CONTACT$NUMBER$LIMIT, CREATE$ACCOUNT_FIRST$NAME$LIMIT, CREATE$ACCOUNT_LAST$NAME$LIMIT } from '../../core/apiConfigurations';
import { StripeUserDataService } from '../../services/stripe.userData.service';
import { StripeModel } from '../../models/stripe.model';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrl: './create-account-form.component.scss',
  standalone: false
})
export class CreateAccountFormComponent {
  // Store the create account form object
  createAccountBasicDetails!: CreateAccountBasicDetails;
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the user roles details
  userRoleList: SelectItem[] = [];
  // Store the country details
  displayCountryList: SelectItem[] = [];
  // Store the user details object
  userDetails: UserDetails;
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the loading
  showLoading: boolean = false;
  // Store the first name limit
  firstNameLimit: number = CREATE$ACCOUNT_FIRST$NAME$LIMIT;
  // Store the last name limit
  lastNameLimit: number = CREATE$ACCOUNT_LAST$NAME$LIMIT;
  // Store the contact number limit
  contactNumberLimit: number = CREATE$ACCOUNT_CONTACT$NUMBER$LIMIT;
  // Store the company name limit
  companyNameLimit: number = CREATE$ACCOUNT_COMPANY$NAME$LIMIT;
  // Store the street address limit
  addressStreetLimit: number = CREATE$ACCOUNT_ADDRESS$STREET$LIMIT;
  // Store the city address limit
  addressCityLimit: number = CREATE$ACCOUNT_ADDRESS$CITY$LIMIT;
  // Store the state address limit
  addressStateLimit: number = CREATE$ACCOUNT_ADDRESS$STATE$LIMIT;
  // Store the postcode address limit
  addressPostcodeLimit: number = CREATE$ACCOUNT_ADDRESS$POSTCODE$LIMIT;
  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  // Constructor
  constructor(private authenticationService: AuthenticationService, private router: Router, private stripeUserDataService: StripeUserDataService, private stripeService: StripeService) {
    // Getting the create account basic object
    this.createAccountBasicDetails = this.router.getCurrentNavigation()!.extras.state?.['response'];
    // End of Getting the create account basic object
    this.stripeModel = new StripeModel(this.stripeService);
    // Initialize the user details object
    this.userDetails = {
      UserId: 0,
      FirstName: '',
      LastName: '',
      Email: this.createAccountBasicDetails.Email,
      Password: this.createAccountBasicDetails.Password,
      BuilderCompanyName: '',
      ContactNumber: '',
      UserType: this.createAccountBasicDetails.UserType,
      RoleId: 0,
      AddressDetails: {
        Id: 0,
        AddressTypeId: 1,
        City: '',
        CountryId: 0,
        PostCode: '',
        State: '',
        StreetAddress: ''
      },
      Avatar: '',
      ProjectEndDate: new Date(),
      ProjectStartDate: new Date(),
      RoleCode: '',
      RoleName: '',
      TotalRecords: 0,
      CreatorId: 0,
      TempDisabled: false
    };
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.overallCookieInterface = new OverallCookieModel();

    // Getting all the user roles
    this.GetAllUserRoles();
    // Getting the countries
    this.GetAllCountries();
  }

  // On click event off go back to create account
  goBackCreateAccount() {
    // Redirect to create account
    this.router.navigate(['/createAccount']);
  }

  // Getting all the user roles
  GetAllUserRoles() {
    // Calling the model to retrieve all the user roles
    this.authenticationModel.GetRoleDetails((this.createAccountBasicDetails.UserType == 'AD') ? 1 : (this.createAccountBasicDetails.UserType == 'PM') ? 1 : (this.createAccountBasicDetails.UserType == 'SP') ? 3 : 4).then(
      (data) => {
        // Getting the user roles
        let userRoles: RoleDetails[] = <RoleDetails[]>data;
        // Clear the list
        this.userRoleList = [];
        // Loop through the user roles
        for (let i = 0; i < userRoles.length; i++) {
          // Adding each object
          this.userRoleList.push(
            {
              value: userRoles[i].Id,
              label: userRoles[i].Name
            }
          );
        }
        // End of Loop through the user roles

        // Setting the default user role
        this.userDetails.RoleId = this.userRoleList[0].value;
      }
    );
    // End of Calling the model to retrieve all the user roles
  }

  // Getting the countries
  GetAllCountries() {
    // Calling the model to retrieve all the user roles
    this.authenticationModel.GetCountryDetails().then(
      (data) => {
        // Getting the user roles
        let countryList: Country[] = <Country[]>data;
        // Clear the list
        this.displayCountryList = [];
        // Loop through the user roles
        for (let i = 0; i < countryList.length; i++) {
          // Adding each object
          this.displayCountryList.push(
            {
              value: countryList[i].Id,
              label: countryList[i].Name
            }
          );
        }
        // End of Loop through the user roles

        // Setting the default user role
        this.userDetails.AddressDetails.CountryId = this.displayCountryList[0].value;
      }
    );
    // End of Calling the model to retrieve all the user roles
  }

  // On click function of creating the account
  onClickCreateAccount() {

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

    // Calling the model to register the user
    this.authenticationModel.RegisterSetUser(this.userDetails, "NEW").then(
      () => {
        // Call the service to create a customer and wait for the response
        const result: any = this.stripeModel.CreateCustomerMethodServiceCall(this.userDetails.Email, this.userDetails.FirstName, 'AD');

        // Ensure the result contains a valid customer ID
        if (!result) {
          throw new Error("Failed to create Stripe customer.");
        } else {
          this.stripeUserDataService.setUserDetails(this.userDetails);
          // Redirect to the stripe page
          this.router.navigate(['/stripePlan']);
        }




      }
    );
    // End of Calling the model to register the user
  }




  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the first name exists
    if (!(this.userDetails.FirstName && this.userDetails.FirstName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$FIRST$NAME',
          ErrorMessage: 'First name is mandatory'
        }
      );
    }
    // End of Check if the first name exists

    // Check if the last name exists
    if (!(this.userDetails.LastName && this.userDetails.LastName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$LAST$NAME',
          ErrorMessage: 'Last name is mandatory'
        }
      );
    }
    // End of Check if the last name exists

    // Check if the contact number exists
    if (!(this.userDetails.ContactNumber && this.userDetails.ContactNumber != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CONTACT$NUMBER',
          ErrorMessage: 'Contact number is mandatory'
        }
      );
    }
    // End of Check if the contact number exists

    // Check if the street address exists
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$STREET$ADDRESS',
          ErrorMessage: 'Street address is mandatory'
        }
      );
    }
    // End of Check if the street address exists

    // Check if the city suburb exists
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.City && this.userDetails.AddressDetails.City != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CITY',
          ErrorMessage: 'City/Suburb is mandatory'
        }
      );
    }
    // End of Check if the city suburb exists

    // Check if the state exists
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.State && this.userDetails.AddressDetails.State != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$STATE',
          ErrorMessage: 'State is mandatory'
        }
      );
    }
    // End of Check if the state exists

    // Check if the postcode exists
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.PostCode && this.userDetails.AddressDetails.PostCode != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$POSTCODE',
          ErrorMessage: 'Postcode is mandatory'
        }
      );
    }
    // End of Check if the postcode exists

    // Check if the company name exists
    if (this.userDetails.UserType == 'PM' && !(this.userDetails.BuilderCompanyName && this.userDetails.BuilderCompanyName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$COMPANY$NAME',
          ErrorMessage: 'Company name is mandatory'
        }
      );
    }
    // End of Check if the company name exists

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




}
