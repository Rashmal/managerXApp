import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TempPerson } from '../../core/tempPerson';
import { ChatModel } from '../../models/chatModel';
import { ChatService } from '../../services/chat.service';
import { UserDetails } from '../../../login_registration/core/userDetails';
import { CREATE$ACCOUNT_FIRST$NAME$LIMIT, CREATE$ACCOUNT_LAST$NAME$LIMIT, CREATE$ACCOUNT_CONTACT$NUMBER$LIMIT, CREATE$ACCOUNT_COMPANY$NAME$LIMIT, CREATE$ACCOUNT_ADDRESS$STREET$LIMIT, CREATE$ACCOUNT_ADDRESS$CITY$LIMIT, CREATE$ACCOUNT_ADDRESS$STATE$LIMIT, CREATE$ACCOUNT_ADDRESS$POSTCODE$LIMIT } from '../../../login_registration/core/apiConfigurations';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { AuthenticationModel } from '../../../login_registration/models/authenticationModel';
import { AuthenticationService } from '../../../login_registration/services/authentication.service';
import { RoleDetails } from '../../../login_registration/core/roleDetails';
import { SelectItem } from 'primeng/api';
import { Country } from '../../../login_registration/core/country';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';

@Component({
  selector: 'app-accept-person',
  templateUrl: './accept-person.component.html',
  styleUrl: './accept-person.component.scss',
  standalone: false
})
export class AcceptPersonComponent {
  // Store the invite id
  inviteId: number | null = null;
  // Store the model
  chatModel!: ChatModel;
  // Store the temp person details
  tempPersonDetails!: TempPerson;
  // Store the current state
  currentState: string = "ACCEPT";
  // Store the user details object
  userDetails: UserDetails;
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
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the user roles details
  userRoleList: SelectItem[] = [];
  // Store the country details
  displayCountryList: SelectItem[] = [];
  // Store the loading
  showLoading: boolean = false;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;

  // Constructor
  constructor(private route: ActivatedRoute, private chatService: ChatService,
    private authenticationService: AuthenticationService, private router: Router
  ) {
    // Initialize the model
    this.chatModel = new ChatModel(this.chatService);
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.overallCookieInterface = new OverallCookieModel();
    // Initialize the user details object
    this.userDetails = {
      UserId: 0,
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      BuilderCompanyName: '',
      ContactNumber: '',
      UserType: '',
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
    // Getting all the user roles
    this.GetAllUserRoles();
    // Getting the countries
    this.GetAllCountries();
  }

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParamMap.subscribe(params => {
      this.inviteId = +params.get('inviteId')!;
      if (this.inviteId) {
        console.log('Invite ID:', this.inviteId);
        // Use inviteId to call APIs or perform other actions
        // Getting the temp person details
        this.GetTempPersonDetails(this.inviteId);
      } else {
        console.error('No invite ID provided in query parameters');
      }
    });
  }

  // Getting the temp person details
  GetTempPersonDetails(tempPersonId: number) {
    // Calling the model
    this.chatModel.GetTempPersonById(tempPersonId).then(
      (data) => {
        // Setting the temp person details
        this.tempPersonDetails = <TempPerson>data;

        if (this.tempPersonDetails.Id == 0) {
          // Redirect to the login page
          this.router.navigate(['/login']);
        } else {

          let fullname = this.tempPersonDetails.FullName;

          let firstName = fullname.split(' ')[0];
          let lastName = (fullname.split(' ')[0].length > 1) ? fullname.split(' ')[1] : '';

          this.userDetails.Email = this.tempPersonDetails.Email;
          this.userDetails.FirstName = firstName;
          this.userDetails.LastName = lastName;
          this.userDetails.RoleId = this.tempPersonDetails.RoleId;
        }
      }
    );
    // End of Calling the model
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

  // Getting all the user roles
  GetAllUserRoles() {
    // Calling the model to retrieve all the user roles
    this.authenticationModel.GetRoleDetails(4).then(
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
        // this.userDetails.RoleId = this.userRoleList[0].value;
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

  // On click event of complete your profile
  completeYourProfileOnClick() {
    this.currentState = "PROFILE";
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
    this.authenticationModel.RegisterSetUserWithChatRoom(this.userDetails, this.tempPersonDetails.RoomId, this.tempPersonDetails.ClientId).then(
      () => {
        // Redirect to the login page
        this.router.navigate(['/login']);
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
    if (!(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
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
    if (!(this.userDetails.AddressDetails.City && this.userDetails.AddressDetails.City != '')) {
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
    if (!(this.userDetails.AddressDetails.State && this.userDetails.AddressDetails.State != '')) {
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
    if (!(this.userDetails.AddressDetails.PostCode && this.userDetails.AddressDetails.PostCode != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$POSTCODE',
          ErrorMessage: 'Postcode is mandatory'
        }
      );
    }
    // End of Check if the postcode exists

  }
}
