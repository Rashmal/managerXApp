import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { addDays } from '@fullcalendar/core/internal';
import { MessageService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Country } from '../../../login_registration/core/country';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { UserDetails } from '../../../login_registration/core/userDetails';
import { AuthenticationModel } from '../../../login_registration/models/authenticationModel';
import { AuthenticationService } from '../../../login_registration/services/authentication.service';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { ProjectManagerService } from '../../services/project-manager.service';
import { RoleManagement } from '../../../admin/core/roleManagement';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { RoleDetails } from '../../../login_registration/core/roleDetails';
import { UserType } from '../../../admin/core/userType';
import { UserBasicDetails } from '../../../admin/core/userBasicDetails';
import { Filter } from '../../../main_containers/core/filter';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { Paginator } from 'primeng/paginator';
import { UpdateUserTypeDirective } from '../../../directives/update-user-type.directive';
import { StripeService } from '../../../login_registration/services/stripe.service';
import { StripeModel } from '../../../login_registration/models/stripe.model';
import { AssigneeCount } from '../../../login_registration/core/stripe/AssigneeCount';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.scss',
  providers: [DialogService],
  standalone: false
})
export class NewContactComponent {
  // View child
  @ViewChild('modulePaginator') modulePaginatorComponent!: Paginator;
  @Input() SelectedPersonClientId: number = 0;
  @Input() SelectedPersonContactId: number = 0;
  @Input() addedByState: string = 'NM';
  @Output() closeSlideInPopup = new EventEmitter<boolean>();
  @Output() refreshList = new EventEmitter<string>();
  @Input() IsShowPurchaseButton: boolean = false;
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
  // Declare the admin model
  adminModel: AdminModel;
  // Store the role details
  roleDetailsList: RoleDetails[] = [];
  // Store display role list
  displayRoleList: SelectItem[] = [];
  // Store all the user types
  allUserTypes: UserType[] = [];
  // Store display user types
  displayUserTypes: SelectItem[] = [];
  // Store current overall display state
  @Input() overallDisplayState: string = "ADD_NEW";
  // Store selected user type to display
  selectedUserTypeFilter: string = "";
  // Store all contacts for import
  allContactsForImport: UserBasicDetails[] = [];
  // Store the current contact for import filter object
  contactsForImportFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the basic project details
  projectDetails: ProjectDetails = {
    Id: 0,
    Address: '',
    BuilderCompany: '',
    DeliveryDate: new Date(),
    Owner: '',
    ProjectDuration: '',
    StartDate: new Date(),
    CreatedId: 0
  };

  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  constructor(private messageService: MessageService, private authenticationService: AuthenticationService, private router: Router,
    private projectManagerService: ProjectManagerService, public dialogService: DialogService,
    private adminService: AdminService, private stripeService: StripeService
  ) {
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    this.overallCookieInterface = new OverallCookieModel();
    this.adminModel = new AdminModel(this.adminService);
    this.stripeModel = new StripeModel(this.stripeService);
    // Initialize the user details object
    this.userDetails = {
      UserId: 0,
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      BuilderCompanyName: '',
      ContactNumber: '',
      UserType: 'PM',
      RoleId: 1,
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
    // Getting all the user types
    this.GetAllUserTypes();
    // Getting the basic project details
    this.GetBasicProjectDetails();
    this.manageLoggedUserId();
  }

  //store logged user id
  loggedUserId: number = 0;

  //handle logged user id
  manageLoggedUserId() {
    if (this.overallCookieInterface.GetUserId() < 0) {
      this.loggedUserId = -1;
    } else {
      this.loggedUserId = this.overallCookieInterface.GetUserId();
    }
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedPersonClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the contacts for import
  GetAllContactsForImport() {
    // Calling the model to retrieve all the user roles
    this.projectManagerModel.GetAllContactsForImport(this.contactsForImportFilter, this.selectedUserTypeFilter, this.projectDetails.Id).then(
      (data) => {
        // Getting the user roles
        this.allContactsForImport = <UserBasicDetails[]>data;
      }
    );
    // End of Calling the model to retrieve all the user roles
  }

  // Getting all the user types
  GetAllUserTypes() {
    this.displayUserTypes = [];
    // Calling the model to retrieve all the user roles
    this.authenticationModel.GetUserTypeDetails().then(
      (data) => {
        // Getting the user roles
        let allUserTypeDetails: UserType[] = <UserType[]>data;
        // Clear the list
        this.allUserTypes = allUserTypeDetails;
        // Loop through the list
        for (let i = 0; i < this.allUserTypes.length; i++) {
          // Remove Client
          if (this.allUserTypes[i].Code != 'CL' && this.allUserTypes[i].Code != 'AD') {
            this.displayUserTypes.push(
              {
                value: this.allUserTypes[i].Code,
                label: new UpdateUserTypeDirective().transform(this.allUserTypes[i].Code)
              }
            );
          }
          // End of Remove Client
        }
        // End of Loop through the list

        this.selectedUserTypeFilter = this.displayUserTypes[0].value;

        // Check if the selected person client id not 0
        if (this.SelectedPersonContactId != 0) {
          // Getting the client details
          this.GetClientDetails();
        } else {
          // Getting all the role list
          this.GetAllRoleList();
        }
        // End of Check if the selected person client id not 0
      }
    );
    // End of Calling the model to retrieve all the user roles
  }

  // on change event of user type
  userTypeOnChange() {
    // Clear the error message list
    this.errorMessagesList = [];
    // Getting all the role list
    this.GetAllRoleList();
  }

  // Getting the user type Id
  GetUserTypeId(userTypeCode: string) {
    // Getting the index
    let indexObj = this.allUserTypes.findIndex(obj => obj.Code == userTypeCode);
    // Return the Id
    return this.allUserTypes[indexObj].Id;
  }

  // Getting all the role list
  GetAllRoleList() {
    this.displayRoleList = [];

    // Calling the model to retrieve the data
    this.authenticationModel.GetRoleDetails(this.GetUserTypeId(this.userDetails.UserType)).then(
      (data) => {
        // Getting the project details
        this.roleDetailsList = <RoleDetails[]>data;

        // Loop through the role list
        for (let i = 0; i < this.roleDetailsList.length; i++) {
          this.displayRoleList.push(
            {
              value: this.roleDetailsList[i].Id,
              label: this.roleDetailsList[i].Name
            }
          );
        }
        // End of Loop through the role list
        if (this.userDetails.UserId == 0)
          this.userDetails.RoleId = this.roleDetailsList[0].Id;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the client details
  GetClientDetails() {
    // Calling the model to execute the method
    this.projectManagerModel.GetContactDetails(this.SelectedPersonContactId).then(
      (data) => {
        // Closing the popup
        this.userDetails = <UserDetails>data;
        // Getting all the role list
        this.GetAllRoleList();
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
    //this.closeSlideInPopup.emit(false);
    if (this.SelectedPersonContactId == 0) {
      this.overallDisplayState = 'SELECTION';
    } else {
      this.closeSlideInPopup.emit(false);
    }
  }

  // On click function of cancel
  closeOnClickFunction() {
    // Closing the popup
    this.closeSlideInPopup.emit(false);
    //this.overallDisplayState = 'SELECTION';
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

    if (this.SelectedPersonClientId == 0) {
      this.userDetails.ProjectStartDate = addDays(this.userDetails.ProjectStartDate, 1);
      this.userDetails.ProjectEndDate = addDays(this.userDetails.ProjectEndDate, 1);
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
            this.projectManagerModel.SetContactDetails(this.userDetails, this.loggedUserId, (this.SelectedPersonContactId == 0) ? "NEW" : "UPDATE", this.SelectedPersonClientId).then(
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
      this.projectManagerModel.SetContactDetails(this.userDetails, this.loggedUserId, (this.SelectedPersonContactId == 0) ? "NEW" : "UPDATE", this.SelectedPersonClientId).then(
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

    // Check if the password exist
    if (!(this.userDetails.Password && this.userDetails.Password != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$PASSWORD',
          ErrorMessage: 'Password is mandatory'
        }
      );
    }
    // End of Check if the password exist

    // Check if the street address exists
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
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
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
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
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
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
    if (this.userDetails.UserType == 'AD' && !(this.userDetails.AddressDetails.StreetAddress && this.userDetails.AddressDetails.StreetAddress != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$POSTCODE',
          ErrorMessage: 'Postcode is mandatory'
        }
      );
    }
    // End of Check if the Postcode exists

    // Check if the company name exists
    if (this.userDetails.UserType == 'PM' && !(this.userDetails.BuilderCompanyName && this.userDetails.BuilderCompanyName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$BUILDER_COMPANY',
          ErrorMessage: 'Company name is mandatory'
        }
      );
    }
    // End of Check if the company name exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  // Temp disable the user
  tempDisableOnClickFunction() {
    this.adminModel.SetDisablePerson(this.userDetails.UserId).then(
      (data) => {
        // Closing the popup
        this.closeSlideInPopup.emit(true);
      }
    );
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
        // Calling the model to retrieve the data
        this.projectManagerModel.SetContactToProjectDetails(this.projectDetails.Id, this.userDetails.UserId, "REMOVE", this.overallCookieInterface.GetUserId()).then(
          (data) => {
            // Closing the popup
            this.closeSlideInPopup.emit(true);
          }
        );
        // End of Calling the model to retrieve the data

        // Calling the model to retrieve the data
        // this.projectManagerModel.SetClientDetails(this.userDetails, this.overallCookieInterface.GetUserId(), "REMOVE").then(
        //   (data) => {
        //     // Closing the popup
        //     this.closeSlideInPopup.emit(true);
        //   }
        // );
        // End of Calling the model to retrieve the data
      }
    });
  }

  // On click function of adding a new contact type
  addNewTypeSelection(newContactType: string) {
    this.overallDisplayState = newContactType;

    if (this.overallDisplayState == "IMPORT_NEW") {
      // Getting all the contacts for import
      this.GetAllContactsForImport();
    }
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.contactsForImportFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetAllContactsForImport();
  }

  // On change of user type in import contacts
  userImportTypeOnChange() {
    this.contactsForImportFilter.CurrentPage = 1;
    if (this.modulePaginatorComponent) {
      this.modulePaginatorComponent.changePage(0);
    } else {
      // Getting all the contact list
      this.GetAllContactsForImport();
    }
  }

  // On click function of adding the person to the project
  addContactToProject(personUserId: number) {
    // Calling the model to retrieve the data
    this.projectManagerModel.SetContactToProjectDetails(this.projectDetails.Id, personUserId, "ADD", this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting all the contact list
        this.GetAllContactsForImport();
        // Emit to refresh the list
        this.refreshList.emit("CONTACTS");
        // Getting AssigneeCountList
        this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
      }
    );
    // End of Calling the model to retrieve the data
  }
  // Stores the  Assignee CountL ist
  AssigneeCountList: AssigneeCount[] = [];

  //get Assignee Count List
  GetAssigneeCountList(FilterId: number) {
    this.stripeModel.GetAssigneeCountListServiceCall(FilterId).then(
      (data: any) => {
        let Details = this.stripeModel.GetAssigneeCountList();
        this.AssigneeCountList = Details;

        // ✅ Extract and assign total count
        const totalItem = this.AssigneeCountList.find(item => item.UserType === 'Total');
        const currentTotalCount = totalItem ? totalItem.UserTypeCount : 0;
        const totalCountLimit = this.AssigneeCountList.find(item => item.UserType === 'Total');
        const creatingTotalCountLimit = totalCountLimit ? totalCountLimit.LimitOfAccounts : 0;


        if (currentTotalCount < creatingTotalCountLimit) {
          this.IsShowPurchaseButton = false;
        } else {
          //limitation massage
          this.messageService.add({
            severity: 'error',
            summary: 'Limit Exceed.',
            detail: 'User limit reached.',
            life: 3000 // Toast disappears after 3 seconds
          });
          this.IsShowPurchaseButton = true;
        }
      }
    );
  }



  // On click function of removing the person to the project
  removeContactToProject(personUserId: number) {
    //commented because QA mentioned the delete confirmation box is not previosly 
    // Open popup to select user roles
    /*   let ref = this.dialogService.open(DeleteConfirmationComponent, {
        showHeader: false,
        width: '22%',
        data: {
        }
      });
      // Perform an action on close the popup
      ref.onClose.subscribe((data: any) => {
        if (data) { */
    // Calling the model to retrieve the data
    this.projectManagerModel.SetContactToProjectDetails(this.projectDetails.Id, personUserId, "REMOVE", this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting all the contact list
        this.GetAllContactsForImport();
        // Emit to refresh the list
        this.refreshList.emit("CONTACTS");
        // Getting AssigneeCountList
        this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
      }
    );
    // End of Calling the model to retrieve the data
    /*    }
     }); */
  }
}

