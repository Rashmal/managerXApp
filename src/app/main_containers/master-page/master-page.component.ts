import { Component, NgZone, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { OverallCookieInterface } from '../../login_registration/core/overallCookieInterface';
import { AuthenticationModel } from '../../login_registration/models/authenticationModel';
import { Router } from '@angular/router';
import { OverallCookieModel } from '../../login_registration/core/overallCookieModel';
import { AuthenticationService } from '../../login_registration/services/authentication.service';
import { AdminModel } from '../../admin/models/adminModel';
import { AdminService } from '../../admin/services/admin.service';
import { ClientAddress } from '../../login_registration/core/clientAddress';
import { AdminOverviewComponent } from '../../admin/components/admin-overview/admin-overview.component';
import { ContractorModel } from '../../contractor/models/contractorModel';
import { ContractorService } from '../../contractor/services/contractor.service';
import { UserTypeName } from '../../admin/core/userTypeName';
import { ChatService } from '../../chat/services/chat.service';
import { NotificationsService } from 'angular2-notifications';
import { ChatModel } from '../../chat/models/chatModel';
import { StripePaymentOverdue } from '../../login_registration/core/stripe/StripePaymentOverdue';
import { StripeUserDataService } from '../../login_registration/services/stripe.userData.service';
import { StripeModel } from '../../login_registration/models/stripe.model';
import { StripeService } from '../../login_registration/services/stripe.service';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrl: './master-page.component.scss',
  providers: [MessageService],
  standalone: false
})
export class MasterPageComponent {
  // View child declaration
  @ViewChild('adminOverviewComponent') adminOverviewComponent!: AdminOverviewComponent;
  // Default class for side nav menu
  sidebarClasses = '';
  // Set toggle activation false
  isSidebarActive = true;
  // Store the display address list
  displayAddressList: SelectItem[] = [];
  // Store the selected menu item
  selectedMenuItem: string = "NOTIFICATIONS";
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the current user type
  userType: string = "";
  // Store the Admin model
  adminModel: AdminModel;
  // Selected client address Id
  selectedClientId: number = 0;
  // Store the contractor model
  contractorModel: ContractorModel;
  // Store temp hide components
  tempHide: boolean = true;
  // Stoer the chat model
  chatModel: ChatModel;
  // Store the unread count
  unreadCount: number = 0;
  //store logged user id
  userId: number = 0;
  //store logged user name
  loggedUserName: string = '';
  //store trial exp date
  TrialExpiredOn: string = "";
  //store trial exceeded 
  trialExceeded: boolean = false;


  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  constructor(private authenticationService: AuthenticationService, private router: Router,
    private adminService: AdminService, private contractorService: ContractorService, private chatService: ChatService,
    private messageService: MessageService, private ngZone: NgZone, private _service: NotificationsService, private stripeService: StripeService, private confirmationService: ConfirmationService
  ) {
    this.stripeModel = new StripeModel(this.stripeService);
    this.tempHide = true;
    // Initialize the model
    this.chatModel = new ChatModel(this.chatService);
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.overallCookieInterface = new OverallCookieModel();
    // Setting the user type
    this.userType = this.overallCookieInterface.GetUserType();

    this.userId = this.overallCookieInterface.GetUserId();

    // Check the user type
    switch (this.userType) {
      case 'AD':
        this.selectedMenuItem = "CUSTOM$TEMP";
        break;
      case 'PM':
        this.selectedMenuItem = "PROJECTS";
        break;
      case 'SP':
        this.selectedMenuItem = "TASKS";
        break;
    }
    // End of Check the user type



    // Initializing the client address details
    this.initClientAddress();
    this.chatService.startConnection();
  }

  ngOnInit() {

    if (this.overallCookieInterface.GetUserId() == 0) {
      this.onClickSideMenu('LOGOUT');

    }
    else if (this.overallCookieInterface.GetUserId() < 0) {
      // Try and set to read the ghost email; if it's ever null, fall back to an empty string
      this.loggedUserName = this.overallCookieInterface.GetUserFullName() + ' (' + localStorage.getItem('ghostEmail')! + ')';
    } else {
      //set default logged name
      this.loggedUserName = this.overallCookieInterface.GetUserFullName();
    }


    // Getting all the user types
    this.GetAllUserTypes();
    // setTimeout(() => {
    //   if (this.chatService) {
    //     // Setting the side panel visible
    //     this.chatService.joinChatPage(this.overallCookieInterface.GetUserId());

    //     this.chatService.onMessageChatPageReceived((notificationMessage) => {
    //       this._service.info('Chat Notification', notificationMessage, {
    //         timeOut: 5000,
    //         showProgressBar: true,
    //         pauseOnHover: true,
    //         clickToClose: true,
    //         maxLength: 10
    //       })
    //       //this.messageService.add({ severity: 'info', summary: 'Chat Notification', detail: notificationMessage, key: 'br', life: 3000 });
    //     });

    //     this.chatService.JoinMasterPageComponent(this.overallCookieInterface.GetUserId());

    //     this.chatService.onMasterMessageReceived(() => {
    //       // Getting the unread count
    //       this.GetUnreadCount();
    //     });
    //   }
    // }, 1000)



    // Getting the unread count
    this.GetUnreadCount();


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
      this.subscriptionId = parsedData.StripeSubscriptionId;
    }
  }

  subscriptionId: string = '';
  // Getting the unread count
  GetUnreadCount() {
    // Calling the model to retrieve the data for all client address list
    this.chatModel.GetUnreadCount(this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting all the count
        this.unreadCount = <number>data;
      }
    );
    // End of Calling the model to retrieve the data for all client address list
  }

  ngOnDestroy() {
    this.chatService.leaveChatPage(this.overallCookieInterface.GetUserId());
  }

  // Getting all the user types
  GetAllUserTypes() {
    // Calling the model to retrieve the data for all client address list
    this.adminModel.GetAllUserTypes().then(
      (data) => {
        // Getting all the client address list
        let allUserTypes: UserTypeName[] = <UserTypeName[]>data;

        // Setting in the local storage
        localStorage.setItem("UTN_DATA", btoa(JSON.stringify(allUserTypes)));
      }
    );
    // End of Calling the model to retrieve the data for all client address list
  }

  // Initializing the client address details
  initClientAddress() {
    // Check the user type
    if (this.userType && this.userType == 'AD' || this.userId < 0) {
      // Calling the model to retrieve the data for all client address list
      this.adminModel.GetAllClientAddress().then(
        (data) => {
          // Getting all the client address list
          let clientAddressList: ClientAddress[] = <ClientAddress[]>data;

          // Clear the list
          this.displayAddressList = [];

          // Loop through the client address list
          for (let i = 0; i < clientAddressList.length; i++) {
            // Pushing the items
            this.displayAddressList.push(
              {
                value: clientAddressList[i].PersonId,
                label: clientAddressList[i].Address
              }
            );
          }
          // End of Loop through the client address list

          // Setting the default selected client address
          this.selectedClientId = (this.selectedClientId == 0) ? (this.displayAddressList.length > 0) ? this.displayAddressList[0].value : 0 : this.displayAddressList[this.displayAddressList.length - 1].value;
          // Setting the selection
          if (this.adminOverviewComponent) {
            this.adminOverviewComponent.SelectedClientId = this.selectedClientId;
            this.adminOverviewComponent.GetBasicProjectDetails();
          }

          this.tempHide = false;
        }
      );
      // End of Calling the model to retrieve the data for all client address list
    } else if (this.userType && (this.userType == 'SP' || this.userType == 'PM')) {
      // Calling the model to retrieve the data for all client address list
      this.contractorModel.GetAllClientAddress(this.overallCookieInterface.GetUserId()).then(
        (data) => {
          // Getting all the client address list
          let clientAddressList: ClientAddress[] = <ClientAddress[]>data;

          // Clear the list
          this.displayAddressList = [];

          // Loop through the client address list
          for (let i = 0; i < clientAddressList.length; i++) {
            // Pushing the items
            this.displayAddressList.push(
              {
                value: clientAddressList[i].PersonId,
                label: clientAddressList[i].Address
              }
            );
          }
          // End of Loop through the client address list

          // Setting the default selected client address
          this.selectedClientId = (this.selectedClientId == 0) ? (this.displayAddressList.length > 0) ? this.displayAddressList[0].value : 0 : this.selectedClientId;
          // Setting the selection
          if (this.adminOverviewComponent) {
            this.adminOverviewComponent.SelectedClientId = this.selectedClientId;
            this.adminOverviewComponent.GetBasicProjectDetails();
          }

          this.tempHide = false;
        }
      );
      // End of Calling the model to retrieve the data for all client address list
    }
    // End of Check the user type
  }

  // Toggle side menu visibility
  toggleSideMenu() {
    if (this.isSidebarActive) {
      this.sidebarClasses = 'margin-left: -264px;';
    } else {
      this.sidebarClasses = 'margin-left: 0px;';
    }
    this.isSidebarActive = !this.isSidebarActive;
  }

  // on click event of the side menu
  onClickSideMenu(sideMenu: string) {
    // Setting the selected menu
    this.selectedMenuItem = sideMenu;

    if (this.selectedMenuItem == "LOGOUT") {
      // Optionally clear ghostEmail or any other localStorage items
      localStorage.removeItem('ghostEmail');
      // Clear cookies and session data via interface method
      this.overallCookieInterface.ClearCookies();
      // Navigate to logout
      this.router.navigate(['login']);
    }
  }

  // On change event of client address
  onChangeClientAddress() {
    let selectedClientID = this.selectedClientId;

    this.tempHide = true;
    setTimeout(() => {
      this.selectedClientId = selectedClientID;
      this.tempHide = false;
      // Setting the child selection
      if (this.adminOverviewComponent) {
        this.adminOverviewComponent.SelectedClientId = this.selectedClientId;
        this.adminOverviewComponent.GetBasicProjectDetails();
      }
      // End of Setting the child selection
    }, 1)
  }

  // Refreshing the list
  refreshAddressList(event: any) {
    this.selectedClientId = -1;
    // Initializing the client address details
    this.initClientAddress();
  }


  onCancelSubscription() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel your subscription?',
      header: 'Confirm Cancellation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stripeModel.CancelSubscriptionAsyncServiceCall(this.subscriptionId).then((data: any) => {
          if (data === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Subscription Cancelled',
              detail: 'Your subscription has been successfully cancelled.',
            });
            this.router.navigate(['login']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Cancellation Failed',
              detail: 'Failed to cancel the subscription. Please try again.',
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Subscription cancellation aborted.',
        });
      }
    });
  }


}
