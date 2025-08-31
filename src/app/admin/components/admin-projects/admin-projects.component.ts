import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { Filter } from '../../../main_containers/core/filter';
import { ClientDetails } from '../../../project_manager/core/clientDetails';
import { ProjectManagerModel } from '../../../project_manager/models/projectManagerModel';
import { ProjectManagerService } from '../../../project_manager/services/project-manager.service';
import { ProjectDetails } from '../../core/projectDetails';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { StripeModel } from '../../../login_registration/models/stripe.model';
import { StripeService } from '../../../login_registration/services/stripe.service';
import { AssigneeCount } from '../../../login_registration/core/stripe/AssigneeCount';
import { MessageService } from 'primeng/api';
import { UserDetails } from '../../../login_registration/core/userDetails';
import { StripeSubscriptionPlans } from '../../../login_registration/core/stripe/StripeSubscriptionPlans';
import { StripeUserDataService } from '../../../login_registration/services/stripe.userData.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
  standalone: false
})
export class AdminProjectsComponent {
  @Output() refreshAddressList = new EventEmitter<number>();
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
  // Input params
  @Input() SelectedClientId: number = 0;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
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
  currentProjectDetails: ProjectDetails = {
    Id: 0,
    Address: '',
    BuilderCompany: '',
    DeliveryDate: new Date(),
    Owner: '',
    ProjectDuration: '',
    StartDate: new Date(),
    CreatedId: 0
  };
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store all client list
  clientList: ClientDetails[] = [];
  // Store the current state
  currentState: string = "DISPLAY_TABLE";
  // Store the client name
  currentClientDetails!: ClientDetails;
  // Store the selected sub tab
  selectedSubTab: string = "PROJECT_INFORMATION";
  // Store display side panel
  isAddNewClientDetailsVisible: boolean = false;
  // Store the selected client Id
  SelectedPersonClientId: number = 0;
  // Stores the  Assignee CountL ist
  AssigneeCountList: AssigneeCount[] = [];
  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  loggedUserId: number = 0;



  // Stores the user creating creatingCountLimit
  creatingTotalCountLimit: number = 0;

  // Stores the user current countLimit
  currentTotalCount: number = 0;

  // Stores the user rest Creating Total
  restCreatingTotal: number = 0;


  //store sub plan name
  subPlanName: string = '';

  // Stores the IsShowPurchaseButton
  IsShowPurchaseButton: boolean = false;


  // Store the user details object
  userDetails!: UserDetails;


  //store user type value
  UserType: string = '';

  // Stores the  StripeSubscriptionPlans
  StripeSubscriptionPlansList: StripeSubscriptionPlans[] = [];
  constructor(private router: Router, private projectManagerService: ProjectManagerService, private contractorService: ContractorService,
    private adminService: AdminService, private stripeService: StripeService, private messageService: MessageService, private stripeUserDataService: StripeUserDataService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
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
    // Getting the basic project details
    this.GetBasicProjectDetails();
    this.loggedUserId = this.overallCookieInterface.GetUserId();

    // Getting AssigneeCountList
    this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
    // Getting  SubscriptionPlans
    this.GetSubscriptionPlans();
    //set user type for variable
    this.UserType = this.overallCookieInterface.GetUserType();
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the client list
        this.GetAllClientListDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the client list
  GetAllClientListDetails() {
    //this.clientList = [];
    // Calling the model to retrieve the data
    this.adminModel.GetAllClients(this.currentFilter).then(
      (data) => {
        // Getting the project details
        this.clientList = <ClientDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the client list
    this.GetAllClientListDetails();
  }

  // On click event of project row
  projectOnClick(projectId: number, creatorId: number) {
    // Check if the logged user is the creator
    // if (this.overallCookieInterface.GetUserId() == creatorId) {
    // Setting the individual projects display
    this.currentState = "PROJECT";

    // Getting the client index
    let clientIndex = this.clientList.findIndex(obj => obj.Id == projectId);

    // Setting the client name
    this.currentClientDetails = this.clientList[clientIndex];

    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.currentClientDetails.Id).then(
      (data) => {
        // Getting the project details
        this.currentProjectDetails = <ProjectDetails>data;
        // Getting the stage details
        //this.GetAllStageDetails();
        // Getting the current stage details
        //this.GetCurrentStageDetails();
      }
    );
    // End of Calling the model to retrieve the data
    //  }
    // End of Check if the logged user is the creator
  }

  // on click function of go back
  goBackOnClick() {
    this.currentState = "DISPLAY_TABLE";
  }

  // On click event of select the client id
  clientOnClick(clientId: number, creatorId: number) {

    // Check if the logged user is the creator
    if (this.overallCookieInterface.GetUserId() == creatorId || this.overallCookieInterface.GetUserId() < 0) {
      this.isAddNewClientDetailsVisible = false;
      this.SelectedPersonClientId = clientId;
      setTimeout(() => {
        // Setting the side panel visible
        this.isAddNewClientDetailsVisible = true;
      }, 1)
    }
    // End of Check if the logged user is the creator
  }

  // On click function of new client
  addNewClientOnClick() {

    /*  this.isAddNewClientDetailsVisible = false;
     this.SelectedPersonClientId = 0;
     setTimeout(() => {
       // Setting the side panel visible
       this.isAddNewClientDetailsVisible = true;
     }, 1) */

    this.IsShowPurchaseButton = false;

    //Ghost login check
    if (this.overallCookieInterface.GetUserId() < 0) {
      this.SelectedPersonClientId = 0;
      this.isAddNewClientDetailsVisible = false;
      setTimeout(() => {
        // Setting the side panel visible
        this.isAddNewClientDetailsVisible = true;
      }, 1);
      return;
    } else {
      //if current created accounts greater than user type limit

      if (this.currentTotalCount < this.creatingTotalCountLimit) {

        this.SelectedPersonClientId = 0;
        this.isAddNewClientDetailsVisible = false;
        setTimeout(() => {
          // Setting the side panel visible
          this.isAddNewClientDetailsVisible = true;
        }, 1)
      } else {

        this.SelectedPersonClientId = 0;
        this.isAddNewClientDetailsVisible = false;
        setTimeout(() => {
          // Setting the side panel visible
          this.isAddNewClientDetailsVisible = false;
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
    // Check the event
    if (event) {
      // Refresh the list
      // Getting all the client list
      this.GetAllClientListDetails();
      // Getting AssigneeCountList
      this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
      this.refreshAddressList.emit();
    }
    // End of Check the event
  }

  closeSlideInPopupRefresh(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewClientDetailsVisible = false;
    // Check the event
    if (event) {
      // Refresh the list
      this.currentFilter.CurrentPage = 1;
      // Getting all the client list
      this.GetAllClientListDetails();
      // Getting AssigneeCountList
      this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
      this.refreshAddressList.emit();
      // Getting AssigneeCountList 
    }
    // End of Check the event
  }

  closeSlideInPopupDeleteRefresh(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewClientDetailsVisible = false;
    // Check the event
    if (event) {
      this.clientList = [];
      // Refresh the list
      this.currentFilter.CurrentPage = 1;
      // Getting all the client list
      this.GetAllClientListDetails();
      // Getting AssigneeCountList
      this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
      this.refreshAddressList.emit();
    }
    // End of Check the event
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


  addPurchaseClick() {
    this.userDetails.Plan_Name = this.subPlanName;
    this.userDetails.UserType = this.UserType;
    this.userDetails.Email = this.overallCookieInterface.GetUserEmail();
    //check stripe limit increase request
    this.userDetails.IsStripeLimitIncreaseReqLogin = true;
    this.stripeUserDataService.setUserDetails(this.userDetails);

    // Redirect to the stripe page
    this.router.navigate(['/stripePayment']);
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
}

