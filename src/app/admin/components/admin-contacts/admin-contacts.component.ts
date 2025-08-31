import { Component, Input } from '@angular/core';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { Filter } from '../../../main_containers/core/filter';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { StripeModel } from '../../../login_registration/models/stripe.model';
import { StripeService } from '../../../login_registration/services/stripe.service';
import { AssigneeCount } from '../../../login_registration/core/stripe/AssigneeCount';
import { StripeSubscriptionPlans } from '../../../login_registration/core/stripe/StripeSubscriptionPlans';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { StripeUserDataService } from '../../../login_registration/services/stripe.userData.service';
import { UserDetails } from '../../../login_registration/core/userDetails';
import { StripePaymentOverdue } from '../../../login_registration/core/stripe/StripePaymentOverdue';

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.scss',
  standalone: false
})
export class AdminContactsComponent {
  SelectedPersonContactId: number = 0;
  // Declare the admin model

  adminModel: AdminModel;
  // Input params
  @Input() SelectedClientId: number = 0;
  @Input() userType: string = "AD";

  // Store the contacts
  contactList: UserDetails[] = [];

  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store display side panel
  isAddNewClientDetailsVisible: boolean = false;
  isEditClientDetailsVisible: boolean = false;

  // Store the selected client Id
  SelectedPersonClientId: number = 0;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;

  // Store add new overall state
  addNewOverallDisplayState: string = "ADD_NEW";

  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;

  // Stores the user creating creatingCountLimit
  creatingTotalCountLimit: number = 0;

  // Stores the user current countLimit
  currentTotalCount: number = 0;

  // Stores the user rest Creating Total
  restCreatingTotal: number = 0;

  // Stores the  Assignee CountL ist
  AssigneeCountList: AssigneeCount[] = [];

  // Stores the  StripeSubscriptionPlans
  StripeSubscriptionPlansList: StripeSubscriptionPlans[] = [];

  // Stores the IsShowPurchaseButton
  IsShowPurchaseButton: boolean = false;

  // Store the user details object
  userDetails!: UserDetails;

  //store user type value
  UserType: string = '';

  //store sub plan name
  subPlanName: string = '';

  //store trial exp date
  TrialExpiredOn: string = "";
  //store trial exceeded 
  trialExceeded: boolean = false;
  constructor(private messageService: MessageService, private router: Router, private adminService: AdminService, private stripeUserDataService: StripeUserDataService, private stripeService: StripeService) {
    // Initialize the models
    this.adminModel = new AdminModel(this.adminService);
    this.overallCookieInterface = new OverallCookieModel();
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



  }

  ngOnInit() {
    // Getting all the contact list
    this.GetAllContactList();
    // Getting AssigneeCountList
    this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
    // Getting  SubscriptionPlans
    this.GetSubscriptionPlans();
    //set user type for variable
    this.UserType = this.overallCookieInterface.GetUserType();




    // Read from localStorage
    const storedData = localStorage.getItem('StripeDetails');

    if (storedData) {
      const parsedData: StripePaymentOverdue = JSON.parse(storedData);

      // Convert date strings back to Date objects
      parsedData.TrialExpiredOn = new Date(parsedData.TrialExpiredOn);
      parsedData.SubscriptionExpiredOn = new Date(parsedData.SubscriptionExpiredOn);

      this.TrialExpiredOn = new Date(parsedData.TrialExpiredOn).toISOString().split('T')[0];

      // Parse the date from local storage
      const trialDate = new Date(parsedData.TrialExpiredOn);

      // Get today's date (set time to 00:00:00 for comparison)
      const today = new Date();

      // Compare dates to set boolean
      this.trialExceeded = trialDate < today;
    }
  }

  // Getting all the contact list
  GetAllContactList() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllContacts(this.currentFilter, this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.contactList = <UserDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetAllContactList();
  }

  // On click event of sort name
  sortNameOnClick() {
    // Check the conditions
    if (this.currentFilter.SortCol == "") {
      // Setting the filter
      this.currentFilter.SortCol = "NAME";
      this.currentFilter.SortAsc = true;
    } else if (this.currentFilter.SortCol == "NAME" && this.currentFilter.SortAsc == true) {
      // Setting the filter
      this.currentFilter.SortCol = "NAME";
      this.currentFilter.SortAsc = false;
    } else if (this.currentFilter.SortCol == "NAME" && this.currentFilter.SortAsc == false) {
      // Setting the filter
      this.currentFilter.SortCol = "";
      this.currentFilter.SortAsc = true;
    }
    // End of Check the conditions

    // Getting all the contact list
    this.GetAllContactList();
  }

  // On click function of edit client
  editClientOnClick(currentContactId: number, creatorId: number, contactType: string) {
    this.addNewOverallDisplayState = 'ADD_NEW';
    // Check the client type
    if (contactType != 'CL') {
      // Check if the logged user is the creator
      if (this.overallCookieInterface.GetUserId() == creatorId || this.overallCookieInterface.GetUserId() < 0) {
        this.SelectedPersonContactId = currentContactId;
        this.isAddNewClientDetailsVisible = false;
        this.SelectedPersonClientId = 0;
        setTimeout(() => {
          // Setting the side panel visible
          this.isAddNewClientDetailsVisible = true;
        }, 1)
      }
      // End of Check if the logged user is the creator
    } else {
      // Check if the logged user is the creator
      if (this.overallCookieInterface.GetUserId() == creatorId || this.overallCookieInterface.GetUserId() < 0) {
        this.SelectedPersonContactId = currentContactId;
        this.isEditClientDetailsVisible = false;
        this.SelectedPersonClientId = 0;
        setTimeout(() => {
          // Setting the side panel visible
          this.isEditClientDetailsVisible = true;
        }, 1)
      }
      // End of Check if the logged user is the creator
    }
    // End of Check the client type
  }

  // On click function of new client
  addNewClientOnClick() {
    this.IsShowPurchaseButton = false;

    //Ghost login check
    if (this.overallCookieInterface.GetUserId() < 0) {
      this.addNewOverallDisplayState = 'SELECTION';
      this.SelectedPersonContactId = 0;
      this.isAddNewClientDetailsVisible = false;
      setTimeout(() => {
        // Setting the side panel visible
        this.isAddNewClientDetailsVisible = true;
      }, 1);
      return;
    } else {
      //if current created accounts greater than user type limit

      if (this.currentTotalCount < this.creatingTotalCountLimit) {
        this.addNewOverallDisplayState = 'SELECTION';
        this.SelectedPersonContactId = 0;
        this.isAddNewClientDetailsVisible = false;
        setTimeout(() => {
          // Setting the side panel visible
          this.isAddNewClientDetailsVisible = true;
        }, 1)
      } else {
        this.addNewOverallDisplayState = 'SELECTION';
        this.SelectedPersonContactId = 0;
        this.isAddNewClientDetailsVisible = false;
        setTimeout(() => {
          // Setting the side panel visible
          this.isAddNewClientDetailsVisible = true;
        }, 1)
        //limitation massage
        this.messageService.add({
          severity: 'error',
          summary: 'Limit Exceed.',
          detail: 'User limit reached..',
          life: 3000 // Toast disappears after 3 seconds
        });

        this.IsShowPurchaseButton = true;
      }
    }


  }

  // Closing the slide in popup
  closeSlideInPopup(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewClientDetailsVisible = false;
    this.isEditClientDetailsVisible = false;
    // Check the event
    if (event) {
      // Refresh the list
      // Getting all the client list
      this.GetAllContactList();
      // Getting AssigneeCountList
      this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
    }
    // End of Check the event
  }

  // On emit function of refresh list
  refreshList(event: any) {
    // Getting all the client list
    this.GetAllContactList();
    // Getting AssigneeCountList
    this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
  }

  //get Assignee Count List
  GetAssigneeCountList(FilterId: number) {
    this.stripeModel.GetAssigneeCountListServiceCall(FilterId).then(
      (data: any) => {
        let Details = this.stripeModel.GetAssigneeCountList();
        this.AssigneeCountList = Details;

        // ✅ Extract and assign total count
        const totalItem = this.AssigneeCountList.find(item => item.UserType === 'Total');
        this.currentTotalCount = totalItem ? totalItem.UserTypeCount : 0;
        const totalCountLimit = this.AssigneeCountList.find(item => item.UserType === 'Total');
        this.creatingTotalCountLimit = totalCountLimit ? totalCountLimit.LimitOfAccounts : 0;

        this.restCreatingTotal = this.creatingTotalCountLimit - this.currentTotalCount;
        this.subPlanName = this.AssigneeCountList[0].PlanName;

        if (this.currentTotalCount >= this.creatingTotalCountLimit) {
          this.IsShowPurchaseButton = true;
        } else {
          this.IsShowPurchaseButton = false;
        }
      }
    );
  }


  // Getting  SubscriptionPlans
  GetSubscriptionPlans() {

    // Call the model to check if there is any overdue payment for the given email
    this.stripeModel.GetSubscriptionPlans().then(() => {
      // Fetching the payment overdue details from the model
      let Details = this.stripeModel.GetStripeSubscriptionPlans();
      this.StripeSubscriptionPlansList = Details;

      this.overallCookieInterface.GetUserType()

      const limitation = this.StripeSubscriptionPlansList.find(item => item.Plan_Name === this.UserType);

    }
    );
    // End of Calling the model to retrieve the data
  }

  addPurchaseClick() {
    this.userDetails.Plan_Name = this.subPlanName;
    this.userDetails.UserType = this.UserType;
    this.userDetails.Email = this.overallCookieInterface.GetUserEmail();
     
    if (!this.trialExceeded) {
      this.userDetails.ISTrialIncrease = true;
    }
    //check stripe limit increase request
    this.userDetails.IsStripeLimitIncreaseReqLogin = true;

    this.stripeUserDataService.setUserDetails(this.userDetails);

    // Redirect to the stripe page
    this.router.navigate(['/stripePayment']);
  }

}
