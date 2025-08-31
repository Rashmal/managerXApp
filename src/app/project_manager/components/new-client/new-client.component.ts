import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthenticationModel } from '../../../login_registration/models/authenticationModel';
import { Country } from '../../../login_registration/core/country';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { AuthenticationService } from '../../../login_registration/services/authentication.service';
import { UserDetails } from '../../../admin/core/userDetails';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { ProjectManagerService } from '../../services/project-manager.service';
import { addDays } from '@fullcalendar/core/internal';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { UserType } from '../../../admin/core/userType';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss',
  providers: [DialogService],
  standalone: false
})
export class NewClientComponent {
  @Input() SelectedPersonClientId: number = 0;
  @Output() closeSlideInPopup = new EventEmitter<boolean>();
  @Output() closeSlideInPopupRefresh = new EventEmitter<boolean>();
  @Output() closeSlideInPopupDeleteRefresh = new EventEmitter<boolean>();
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the country details
  displayCountryList: SelectItem[] = [];
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the user details object
  userDetails: UserDetails;
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Declare the project manager model
  projectManagerModel: ProjectManagerModel;
  // Added by state
  @Input() addedByState: string = "PM";
  // Store the start date
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private authenticationService: AuthenticationService, private router: Router,
    private projectManagerService: ProjectManagerService, public dialogService: DialogService
  ) {
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
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
      UserType: 'CL',
      RoleId: 6,
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
      RoleCode: 'CL',
      RoleName: 'Client',
      TotalRecords: 0,
      ProjectEndDate: new Date(),
      ProjectStartDate: new Date(),
      CreatorId: this.overallCookieInterface.GetUserId(),
      TempDisabled: false
    };
  }

  ngOnInit() {
    // Getting the countries
    this.GetAllCountries();
    // Check if the selected person client id not 0
    if (this.SelectedPersonClientId != 0) {
      // Getting the client details
      this.GetClientDetails();
    }
    // End of Check if the selected person client id not 0
  }

  // On select date
  onSelectDate(dateType: string) {
    switch (dateType) {
      case 'S':
        this.userDetails.ProjectStartDate = this.deep(this.startDate);
        this.startDate = new Date(this.startDate.setDate(this.startDate.getDate() + 1));
        break;
      case 'E':
        this.userDetails.ProjectEndDate = this.deep(this.endDate);
        this.endDate = new Date(this.endDate.setDate(this.endDate.getDate() + 1));
        break;
    }
  }

  // Making a deep copy
  deep<T extends object>(source: T): T {
    if (source) {
      return JSON.parse(JSON.stringify(source))
    }
    return source;
  }

  // Getting the client details
  GetClientDetails() {
    // Calling the model to execute the method
    this.projectManagerModel.GetClientDetails(this.SelectedPersonClientId).then(
      (data) => {
        // Closing the popup
        this.userDetails = <UserDetails>data;

        this.startDate = this.userDetails.ProjectStartDate;
        this.endDate = this.userDetails.ProjectEndDate;
      }
    )
    // End of Calling the model to execute the method
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

  // On click function of cancel
  cancelOnClickFunction() {
    // Closing the popup
    this.closeSlideInPopup.emit(false);
  }

  // On click event of the submit button
  onClickSubmit() {
    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if the error messages length

    // if (this.SelectedPersonClientId == 0) {
    //   this.userDetails.ProjectStartDate = addDays(this.userDetails.ProjectStartDate, 1);
    //   this.userDetails.ProjectEndDate = addDays(this.userDetails.ProjectEndDate, 1);
    // }

    this.userDetails.ProjectStartDate = this.startDate;
    this.userDetails.ProjectEndDate = this.endDate;



    let userId ;
    if(this.overallCookieInterface.GetUserId() <0){
        userId = -1;
    }else{
      userId = this.overallCookieInterface.GetUserId();
    }
 

    // Check if its the insert new
    if (this.userDetails.UserId == 0) {
      // Check if the client already exists
      this.authenticationModel.CheckEmailExistsWithUserType(this.userDetails.Email, this.userDetails.UserType).then(
        (data) => {
          // Check if it already exists
          if (data) {
            // Display error message
            // Pushing the error message
            this.errorMessagesList.push(
              {
                ErrorCode: 'EXISTS$EMAIL',
                ErrorMessage: 'Email already exists'
              }
            );
            // End of Display error message
          } else {
            // Calling the model to execute the method
            this.projectManagerModel.SetClientDetails(this.userDetails, (this.addedByState == 'PM') ?  userId: userId, (this.SelectedPersonClientId == 0) ? "NEW" : "UPDATE").then(
              () => {
                // Closing the popup
                this.closeSlideInPopup.emit(true);
              }
            )
            // End of Calling the model to execute the method
          }
          // End of Check if it already exists
        }
      );
      // End of Check if the client already exists
    } else {


      // Calling the model to execute the method
      this.projectManagerModel.SetClientDetails(this.userDetails, (this.addedByState == 'PM') ? userId: userId, (this.SelectedPersonClientId == 0) ? "NEW" : "UPDATE").then(
        () => {
          // Closing the popup
          this.closeSlideInPopup.emit(true);
        }
      )
      // End of Calling the model to execute the method
    }
    // End of Check if its the insert new
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
          ErrorCode: 'EMPTY$FIRST_NAME',
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
          ErrorCode: 'EMPTY$LAST_NAME',
          ErrorMessage: 'Last name is mandatory'
        }
      );
    }
    // End of Check if the last name exists

    // Check if the email exists
    if (!(this.userDetails.Email && this.userDetails.Email != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$EMAIL',
          ErrorMessage: 'Email is mandatory'
        }
      );
    } else {
      // Check if the email is proper format
      let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,300})+$/);
      if (!regex.test(this.userDetails.Email)) {
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
    // End of Check if the email exists

    // Check if the contact number exists
    if (!(this.userDetails.ContactNumber && this.userDetails.ContactNumber != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CONTACT_NUMBER',
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
          ErrorCode: 'EMPTY$STREET_ADDRESS',
          ErrorMessage: 'Street address is mandatory'
        }
      );
    }
    // End of Check if the street address exists

    // Check if the city exists
    if (!(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CITY',
          ErrorMessage: 'City is mandatory'
        }
      );
    }
    // End of Check if the city exists

    // Check if the state exists
    if (!(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$STATE',
          ErrorMessage: 'State is mandatory'
        }
      );
    }
    // End of Check if the state exists

    // Check if the Postcode exists
    if (!(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$POSTCODE',
          ErrorMessage: 'Postcode is mandatory'
        }
      );
    }
    // End of Check if the Postcode exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  // Remove on click function
  removeOnClickFunction() {
    // Open popup to select user roles
    let ref = this.dialogService.open(DeleteConfirmationComponent, {
      showHeader: false,
      width: '22%',
      data: {
      }
    });
    // Perform an action on close the popup
    ref.onClose.subscribe((data: any) => {
      if (data) {
        // Check the state
        if (this.addedByState = 'AD') {
          // Calling the model to retrieve the data
          this.projectManagerModel.SetClientDetails(this.userDetails, this.overallCookieInterface.GetUserId(), "REMOVE").then(
            (data) => {
              // Closing the popup
              this.closeSlideInPopupDeleteRefresh.emit(true);
            }
          );
          // End of Calling the model to retrieve the data
        }
      }
    });
  }
}
