import { Component, AfterViewInit, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement, StripeCardElementOptions, StripeError } from '@stripe/stripe-js';

import { HttpClient } from '@angular/common/http';
import { StripeService } from '../../services/stripe.service';
import { StripeModel } from '../../models/stripe.model';
import { SubscriptionRequest } from '../../core/stripe/SubscriptionRequest';
import { StripeUserDataService } from '../../services/stripe.userData.service';
import { UserDetails } from '../../core/userDetails';
import { Router } from '@angular/router';
import { AuthenticationModel } from '../../models/authenticationModel';
import { AuthenticationService } from '../../services/authentication.service';
import { IErrorMessage } from '../../core/iErrorMessage';
import { StripePaymentOverdue } from '../../core/stripe/StripePaymentOverdue';
import { StripeSubscriptionPlans } from '../../core/stripe/StripeSubscriptionPlans';
import { AssigneeCount } from '../../core/stripe/AssigneeCount';
import { OverallCookieInterface } from '../../core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { ConfirmSubscriptionRequest } from '../../core/Adyen/ConfirmSubscriptionRequest';
import { AdyenModel } from '../../models/adyen.model';
import { AdyenService } from '../../services/adyen.service';

declare var AdyenCheckout: any;
@Component({
  selector: 'app-adyentest',
  templateUrl: './adyentest.component.html',
  styleUrl: './adyentest.component.scss',
  standalone: false
})
export class AdyentestComponent implements OnInit {
  @ViewChild('dropinContainer', { static: false }) dropinContainer!: ElementRef;

  // Indicates whether the application is currently loading data or processing a request  
  isLoading: boolean = false;

  // Stores a list of error messages encountered during Stripe payment processing  
  errorMessagesList: IErrorMessage[] = [];

  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;

  // Stripe.js instance for handling payments  
  stripe: any;

  // Stripe Elements instance used for creating input fields  
  elements: any;

  // Reference to the Stripe card input field  
  card: any;

  // Stores the user's email address for Stripe payment processing  
  email: string = '';

  // Stores the user's full name required for the Stripe transaction  
  name: string = '';

  // Stores the unique Stripe Price ID associated with the selected plan or product  
  priceId: string = '';

  // Stores the unique Stripe Customer ID for identifying the user within Stripe  
  customerId: any = '';

  // Represents the user type, defaulting to 'PM' (Project Manager)  
  userType: string = '';
  Plan_Name: string = '';
  // Stores the authenticated user’s details such as name, email, and role  
  userDetails!: UserDetails;

  // Object to store subscription request data sent to the Stripe API  
  // Object to store subscription request data sent to the Stripe API
  subscriptionRequest: ConfirmSubscriptionRequest = {
    PaymentMethod: "",
    CustomerId: this.customerId,         // Stripe Customer ID
    PaymentMethodId: '',                 // To be assigned during transaction
    PriceId: '',                         // Selected Stripe Price ID
    Email: '',
    PlanId: '',
    Name: '',
    PlanName: '',
    UserType: '',
    Price: 0,
    ExtraCharge: 0,
    NoOfUserAccounts: 0,
    TrialDays: 0,
    // SetupFeePriceId: '',
    Quantity: 0,
    IsStripeLimitIncreaseReqLogin: false // Set default if needed
  };


  // Stores authentication-related details such as tokens or session data  
  authenticationModel!: AuthenticationModel;

  // Flag to check if the entered email already exists in the system  
  isEmailExists: boolean = true;

  // Stores data related to overdue Stripe payments for the user  
  StripePaymentOverdue!: StripePaymentOverdue;

  // Stores the  StripeSubscriptionPlans
  StripeSubscriptionPlansList: StripeSubscriptionPlans[] = [];

  // Stores the  PriceToken
  /*   ADPriceToken: string = '';
    PMPriceToken: string = '';
    SPPriceToken: string = ''; */

  //LimitPrice token
  /*   LMPlan1Token: string = '';
    LMPlan2Token: string = '';
    LMPlan3Token: string = '';
   */
  //Stores Plan Name
  //PlanName: string = '';

  //Stores Plan Price
  PlanPrice: number = 0;

  //store is card is valid
  isCardValid: boolean = true;
  //store noOfAccounts value
  noOfAccounts: number = 0;
  //store minNoOfAccounts value
  minNoOfAccounts: number = 0;
  //store LimitExRatio value
  LimitExRatio: number = 0;
  //store TotalPrice value
  TotalPrice: number = 0;
  //store   extraNoOfAccounts value
  extraNoOfAccounts: number = 0;
  //store extra added price
  extraAddedPrice: number = 0;

  //store extra added price
  previousNoOfAccount: number = 0;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Stores the  Assignee CountL ist
  AssigneeCountList: AssigneeCount[] = [];
  // Stores the   creating Total Accounts Count Limit
  creatingTotalCountLimit: number = 0;
  // Declare the list with initial values
  ProhibitedEmailList: string[] = [
    'ghost_four@gmail.com - Ghost Four',
    'ghost_three@gmail.com - Ghost Three',
    'ghost_two@gmail.com - Ghost Two',
    'ghost_one@gmail.com - Ghost One',
    'ghost_default@gmail.com - Ghost Default'
  ];
  //store trial days
  setTrialDays: number = 0;
  //store Fee price token
  SetupFeePriceId: string = '';
  //store admin email validation
  checkIsAdminEmail: boolean = true;

  adyenModel!: AdyenModel;

  message: string = '';
  checkout: any;
  dropin: any;
  userEmail: string = '';
  selectedPlanId: string = '';

  constructor(private adyenService: AdyenService, private router: Router, private renderer: Renderer2, private http: HttpClient, private stripeService: StripeService, private stripeUserDataService: StripeUserDataService, private authenticationService: AuthenticationService) {
    this.stripeModel = new StripeModel(this.stripeService);
    this.adyenModel = new AdyenModel(this.adyenService);
    this.overallCookieInterface = new OverallCookieModel();
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
  }




  ngOnInit() {



    // Retrieve user details from the Stripe user data service
    this.userDetails = this.stripeUserDataService.getUserDetails();


    // Store user details in localStorage for persistence across sessions
    if (this.userDetails) {
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    } else {
      // If user details are not available, attempt to retrieve them from localStorage
      const storedUser = localStorage.getItem('userDetails');

      if (storedUser) {
        // Parse and assign the retrieved user details
        this.userDetails = JSON.parse(storedUser);
      }
    }
    //get subscription plan details
    this.GetSubscriptionPlans();



    // Load Adyen JS script dynamically
    const script = this.renderer.createElement('script');
    script.src = 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.27.0/adyen.js';
    script.async = true;
    script.onload = () => this.loadStylesAndInit();
    this.renderer.appendChild(document.body, script);

  }

  loadStylesAndInit() {
    // Load Adyen CSS dynamically
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.27.0/adyen.css';
    this.renderer.appendChild(document.head, link);



    setTimeout(() => {
      this.loadCards();
      console.log('Stripe initialized at:', new Date().toISOString());
    }, 1000); // 5000 milliseconds = 5 seconds

  }



  initializeAdyen() {
    this.message = '';

    // Clear old drop-in if any
    if (this.dropin) {
      this.dropin.unmount();
      this.dropin = null;
    }

    // Call backend API to get payment methods and client key
    this.http.post<any>('https://liveapi.managerxpro.com/ManagerXAPI/api/adyen/initiate', {
      email: this.userEmail,
      planId: this.selectedPlanId
    }).subscribe({
      next: async (paymentData) => {
        if (typeof AdyenCheckout !== 'function') {
          this.message = 'AdyenCheckout SDK is not loaded.';
          return;
        }

        try {
          // Initialize AdyenCheckout instance
          this.checkout = await AdyenCheckout({
            environment: 'test',
            clientKey: paymentData.clientKey,
            paymentMethodsResponse: paymentData.paymentMethods,
            countryCode: paymentData.countryCode || 'AU',
            analytics: { enabled: false },
            onSubmit: this.handleAdyenSubmit.bind(this),  // Link to new handler
            onError: (error: any) => {
              this.message = 'Error: ' + error.message;
            }
          });

          // Create and mount the drop-in component
          this.dropin = await this.checkout.create('dropin');
          this.dropin.mount(this.dropinContainer.nativeElement);

        } catch (err: any) {
          console.error('Error initializing Adyen Checkout:', err);
          this.message = 'Failed to load payment form.';
        }
      },
      error: () => {
        this.message = 'Failed to initialize payment.';
      }
    });
  }

  async handleAdyenSubmit(state: any, component: any) {
    if (!state.isValid) {
      this.message = 'Please complete the payment form correctly.';
      return;
    }

    try {
      // ✅ Call this BEFORE Adyen submit logic
      await this.checkEmailRegistered(state, component);


    } catch (err) {
      console.error('Error in paySubscription:', err);
      this.message = 'An error occurred before payment. Please try again.';
    }
  }




  //pay subscription 
  async paySubscription(state: any, component: any) {

    /* if (this.Plan_Name = 'Plan1') {
      //   this.SetupFeePriceId = 'price_1ROwSrPLLkQE7cszsrWx7vjD';
      this.SetupFeePriceId = this.LMPlan1Token;
    } else if (this.Plan_Name = 'Plan2') {
      //  this.SetupFeePriceId = '';
      this.SetupFeePriceId = this.LMPlan2Token;
    } else {
      //  this.SetupFeePriceId = 'price_1ROwgvPLLkQE7cszQcTJ9YiO';
      this.SetupFeePriceId = this.LMPlan3Token;
    } */
    try {
      // Check if the user already has a Stripe customer account associated with their email
      const result: any = await this.stripeModel.CheckStripeCustomerServiceCall(this.email);

      if (result === 'No') {

        //set default settings for initial customer
        this.setTrialDays = 14;

      } else {
        this.setTrialDays = 0;
        // If customer exists, store their customer ID
        this.customerId = result;
      }


      if (this.userDetails.IsStripeLimitIncreaseReqLogin == true) {

        // Prepare subscription request for only   limit increase request
        this.subscriptionRequest = {
          PaymentMethod: state.data.paymentMethod,
          CustomerId: this.customerId,
          PaymentMethodId: "",
          PriceId: "price_1RLySWPLLkQE7cszskn77vBZ",
          Email: this.email,
          Name: this.name,
          PlanName: this.Plan_Name,
          Price: 0,
          UserType: this.userType,
          ExtraCharge: this.extraAddedPrice,
          NoOfUserAccounts: this.noOfAccounts,
          IsStripeLimitIncreaseReqLogin: true,
          TrialDays: this.userDetails.ISTrialIncrease ? 14 : 0,
          // SetupFeePriceId: this.SetupFeePriceId,
          Quantity: this.extraNoOfAccounts,
          PlanId: this.selectedPlanId
        };

        if (this.extraAddedPrice === 0) {
          const error = {
            ErrorCode: 'PAYMENT$FAILED',
            ErrorMessage: 'Payment Cannot be $0'
          };

          this.errorMessagesList.push(error);
          this.isLoading = false;

          // Remove the error message after 5 seconds
          setTimeout(() => {
            const index = this.errorMessagesList.indexOf(error);
            if (index !== -1) {
              this.errorMessagesList.splice(index, 1);
            }
          }, 2000);
          this.dropInReloadCard();
          return;
        }


      } else {
        // Prepare subscription request
        this.subscriptionRequest = {
          PaymentMethod: state.data.paymentMethod,
          CustomerId: this.customerId,
          PaymentMethodId: "",
          PriceId: this.priceId,
          Email: this.email,
          Name: this.name,
          PlanName: this.Plan_Name,
          Price: this.PlanPrice,
          UserType: this.userType,
          ExtraCharge: this.extraAddedPrice,
          NoOfUserAccounts: this.noOfAccounts,
          TrialDays: this.setTrialDays,
          //   SetupFeePriceId: this.SetupFeePriceId,
          Quantity: this.extraNoOfAccounts,
          PlanId: this.selectedPlanId
        };

      }

      //do the payment    

      this.confirmPayment(this.subscriptionRequest, component);



    } catch (error) {
      console.error('Error processing subscription:', error);
    }
  }




  dropInReloadCard() {
    this.dropin.unmount();
    this.dropin.mount(this.dropinContainer.nativeElement);
  }




  //check db email is already registered
  checkEmailRegistered(state: any, component: any) {



    if (this.email.trim() === '') {
      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'This Email is empty'
      });
      this.dropInReloadCard();
      return;
    }

    // Check if any email in the list matches the input email
    const found = this.ProhibitedEmailList.some(item => item.toLowerCase().startsWith(this.email.toLowerCase()));

    if (found) {
      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'This Email cannot do the payment'
      });
      this.dropInReloadCard();
      return;
    }


    //check no of accounts with previousle bought
    if (this.previousNoOfAccount > this.noOfAccounts) {
      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'The number of accounts previously purchased cannot be less than the number currently being purchased.'
      });
      return;
    }

    //check no of accounts with limits
    if (this.noOfAccounts < this.minNoOfAccounts) {
      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'The number of accounts currently being purchased cannot be below the limit.'
      });
      this.dropInReloadCard();
      return;
    }

    // Clear the error list initially
    this.errorMessagesList = [];

    // Check if email is empty
    if (this.email.length === 0) {
      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'Email is Invalid'
      });
    }

    // Check if name is empty
    if (this.name.length === 0) {
      this.errorMessagesList.push({
        ErrorCode: 'NAME$ERROR',
        ErrorMessage: 'Name is Invalid'
      });
    }

    // If there are errors, stop execution
    if (this.errorMessagesList.length > 0) {
      this.dropInReloadCard();
      return;
    }

    // No errors, so clear the error list
    this.errorMessagesList = [];

    if (this.isCardValid == false) {
      this.isLoading = false;
      // Push an error message indicating the email doesn't exist
      this.errorMessagesList.push(
        {
          ErrorCode: 'CARD$ERROR',
          ErrorMessage: 'Your card details are Invalid'
        }
      );
      this.dropInReloadCard();
      return;
    }


    // Start loading state (e.g., show a loading spinner)
    this.isLoading = true;

    // Call the method to perform Stripe validation
    this.checkStripeValidation(state, component);

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

  // Redirect to create account
  registerUser() {
    this.router.navigate(['/createAccount']);
  }

  // Redirect to subscribePlan
  subscribePlan() {
    this.router.navigate(['/stripePlan']);
  }


  //check Stripe Validation
  checkStripeValidation(state: any, component: any) {
    //check limit increase request
    if (this.userDetails.IsStripeLimitIncreaseReqLogin == true) {

      // If there is no overdue payment, proceed with the payment function
      this.paySubscription(state, component);
    } else {


      // Call the model to check if there is any overdue payment for the given email
      this.stripeModel.CheckStripePaymentOverdueServiceCall(this.email, 'AD').then(() => {
        // Fetching the payment overdue details from the model
        let Details = this.stripeModel.GetStripePaymentOverdue();
        this.StripePaymentOverdue = Details;

        // Check if there is any overdue payment record
        if (this.StripePaymentOverdue === null || this.StripePaymentOverdue === undefined || this.StripePaymentOverdue.PaymentStatusName != 'Active') {
          // If there is no overdue payment, proceed with the payment function
          this.paySubscription(state, component);
        } else {
          this.dropin.unmount();
          this.dropin = null;
          this.dropInReloadCard();
          // If there is an overdue payment, show an error message to the user
          this.errorMessagesList.push(
            {
              ErrorCode: 'ALREADY$PAID',
              ErrorMessage: 'You already have an active subscription.'
            }
          );
          // Set the flag indicating email exists to false as payment validation failed
          this.isEmailExists = false;
        }
      });
    }
  }

  // Getting  SubscriptionPlans
  GetSubscriptionPlans() {

    // Call the model to check if there is any overdue payment for the given email
    this.stripeModel.GetSubscriptionPlans().then(() => {
      // Fetching the payment overdue details from the model
      let Details = this.stripeModel.GetStripeSubscriptionPlans();
      this.StripeSubscriptionPlansList = Details;


      // Ensure the list is not empty
      if (this.StripeSubscriptionPlansList.length > 0) {

        this.StripeSubscriptionPlansList.forEach(token => {

          /* if (token.Plan_Name === 'Plan1') {
            this.ADPriceToken = token.PriceToken;
            //  this.Plan_Name = 'Admin Plan';
          //  this.LMPlan1Token = token.LimitPriceToken;
          } else if (token.Plan_Name === 'Plan2') {
            this.PMPriceToken = token.PriceToken;
            //  this.Plan_Name = 'Project Manager Plan';
          //  this.LMPlan2Token = token.LimitPriceToken;
          } else if (token.Plan_Name === 'Plan3') {
            this.SPPriceToken = token.PriceToken;
            // this.Plan_Name = 'Supplier Plan';
          //  this.LMPlan3Token = token.LimitPriceToken;
          } */
        });
      }


      // If user details exist, assign values to respective variables
      if (this.userDetails) {
        this.email = this.userDetails.Email;      // Set user email
        this.name = this.userDetails.FirstName;   // Set user first name
        this.Plan_Name = this.userDetails.Plan_Name ?? ''// Set user type (e.g., PM, AD, SP)
        this.userType = this.userDetails.UserType;

        //get limitations
        const limitation = this.StripeSubscriptionPlansList.find(item => item.Plan_Name === this.Plan_Name);
        //for validation
        this.minNoOfAccounts = limitation ? limitation.Plan_Limitation : 0;
        //for store data
        this.noOfAccounts = limitation ? limitation.Plan_Limitation : 0;
        this.creatingTotalCountLimit = limitation ? limitation.Plan_Limitation : 0;
        //for store percentage
        this.LimitExRatio = limitation ? limitation.LimitExRatio : 0;
        this.PlanPrice = limitation ? limitation.Plan_Price : 0;
        this.priceId = limitation ? limitation.PriceToken : '';
        this.extraNoOfAccounts = this.noOfAccounts - this.minNoOfAccounts;
        //calculation
        const limitExRatio = this.LimitExRatio;
        const noOfAccounts = this.noOfAccounts;
        const minNoOfAccounts = this.minNoOfAccounts;
        const extraNoOfAccounts = noOfAccounts - minNoOfAccounts;

        const basePrice = this.PlanPrice;

        if (this.userDetails.IsStripeLimitIncreaseReqLogin) {
          this.TotalPrice = (basePrice * (limitExRatio * extraNoOfAccounts)) / 100;
        } else {
          this.TotalPrice = (basePrice * (limitExRatio * extraNoOfAccounts)) / 100 + basePrice;
        }


        if (this.userDetails.IsStripeLimitIncreaseReqLogin) {
          // Getting AssigneeCountList
          this.GetAssigneeCountList(this.overallCookieInterface.GetUserId());
        }


      }
    }
    );
    // End of Calling the model to retrieve the data
  }



  //calculation
  calculation() {

    //only calculate when no of accounts exceed the limit
    if (this.noOfAccounts >= this.minNoOfAccounts && this.noOfAccounts >= this.creatingTotalCountLimit) {


      //check limit increase request or default request
      if (this.userDetails.IsStripeLimitIncreaseReqLogin) {
        const limitExRatio = this.LimitExRatio;
        const noOfAccounts = this.noOfAccounts;
        const minNoOfAccounts = this.creatingTotalCountLimit;
        const extraNoOfAccounts = noOfAccounts - minNoOfAccounts;
        const basePrice = this.PlanPrice;
        this.extraNoOfAccounts = this.noOfAccounts - this.minNoOfAccounts;
        this.extraAddedPrice = (basePrice * (limitExRatio * extraNoOfAccounts)) / 100;
        this.TotalPrice = this.extraAddedPrice;
      } else {
        const limitExRatio = this.LimitExRatio;
        const noOfAccounts = this.noOfAccounts;
        const minNoOfAccounts = this.minNoOfAccounts;
        const extraNoOfAccounts = noOfAccounts - minNoOfAccounts;
        const basePrice = this.PlanPrice;
        this.extraNoOfAccounts = this.noOfAccounts - this.minNoOfAccounts;
        this.extraAddedPrice = (basePrice * (limitExRatio * extraNoOfAccounts)) / 100;
        this.TotalPrice = this.extraAddedPrice + basePrice;
      }


    }


  }


  //check Stripe Validation
  checkNoOfUserAccounts() {
    this.checkIsAdminEmail = true;
    this.errorMessagesList = [];


    // Call the model to check if there is any overdue payment for the given email
    this.stripeModel.GetNoOfAccountCanBeCreateServiceCall(this.email, 'AD').then(() => {

      // Fetching the payment overdue details from the model
      const currentNoOfAccounts = this.stripeModel.GetNoOfUserAccounts();


      if (currentNoOfAccounts > 0) {
        //  if (this.noOfAccounts < currentNoOfAccounts) {

        this.previousNoOfAccount = currentNoOfAccounts;
        this.creatingTotalCountLimit = currentNoOfAccounts;
        this.noOfAccounts = currentNoOfAccounts;
        //do the calculation
        this.calculation();
        //  }
        this.checkIsAdminEmail = true;
        this.dropInReloadCard();
      } else {

        this.checkIsAdminEmail = false;
        this.errorMessagesList.push({
          ErrorCode: 'NOT$EXISTS$USER$EMAIL',
          ErrorMessage: 'This Email cannot do the payment!'
        });
        this.dropin.unmount();


      }


    });
  }


  //get Assignee Count List
  GetAssigneeCountList(FilterId: number) {
    this.stripeModel.GetAssigneeCountListServiceCall(FilterId).then(
      (data: any) => {

        let Details = this.stripeModel.GetAssigneeCountList();
        this.AssigneeCountList = Details;
        const totalCountLimit = this.AssigneeCountList.find(item => item.UserType === 'Total');
        this.creatingTotalCountLimit = totalCountLimit ? totalCountLimit.LimitOfAccounts : 0;
        this.noOfAccounts = this.creatingTotalCountLimit;

      }
    );
  }


  backToHome() {
    this.router.navigate(['/main']);
  }


  resetFields() {
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
      TempDisabled: false,
      Plan_Name: '',
      IsStripeLimitIncreaseReqLogin: false
    };
    this.stripeUserDataService.setUserDetails(this.userDetails); // clear the service cache
  }



  loadCards() {
    this.message = '';

    // Clear any existing Drop-in instance
    if (this.dropin) {
      this.dropin.unmount();
      this.dropin = null;
    }

    // Call model service to initiate Adyen and retrieve necessary data
    this.adyenModel.InitiateMethodServiceCall(this.email, this.selectedPlanId)
      .then((paymentData: any) => {
        if (typeof AdyenCheckout !== 'function') {
          this.message = 'AdyenCheckout SDK is not loaded.';
          return;
        }

        // Initialize Adyen Checkout
        return AdyenCheckout({
          environment: 'test',
          clientKey: paymentData.clientKey,
          paymentMethodsResponse: paymentData.paymentMethods,
          countryCode: paymentData.countryCode || 'AU',
          analytics: { enabled: false },
          onSubmit: this.handleAdyenSubmit.bind(this),
          onError: (error: any) => {
            this.message = 'Error: ' + error.message;
          }
        });
      })
      .then((checkout: any) => {
        this.checkout = checkout;

        // Create and mount drop-in component
        return this.checkout.create('dropin');
      })
      .then((dropin: any) => {
        this.dropin = dropin;
        this.dropin.mount(this.dropinContainer.nativeElement);
      })
      .catch((error: any) => {
        console.error('Adyen initialization error:', error);
        this.message = 'Failed to load payment form.';
      });

    // Optionally: check for any Stripe overdue payments
    const details = this.stripeModel.GetStripePaymentOverdue();
    // You can do something with `details` here if needed
  }



  //confirm Payment
  confirmPayment(confirmSubscriptionRequest: ConfirmSubscriptionRequest, component: any) {
    this.adyenModel.ConfirmSubscriptionMethodServiceCall(confirmSubscriptionRequest)
      .then((response: any) => {
        if (response.action) {
          component.handleAction(response.action);
        } else if (response.data === 'Authorised') {
          this.message = '✅ Payment successful! Your subscription is now active.';
          component.unmount();

          this.errorMessagesList.push({
            ErrorCode: 'PAYMENT$SUCCESS',
            ErrorMessage: 'Payment Success'
          });

          this.resetFields();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (response.data === 'Refused') {
          this.dropInReloadCard();

          this.errorMessagesList.push({
            ErrorCode: 'PAYMENT$FAILED',
            ErrorMessage: 'Payment Failed. Please check card details or try another card.'
          });

          this.message = '❌ Payment was refused. Please try another card.';
        } else {
          this.dropInReloadCard();

          this.errorMessagesList.push({
            ErrorCode: 'PAYMENT$FAILED',
            ErrorMessage: 'Payment Failed. Please check card details or try another card.'
          });

          this.message = '⚠️ Payment status: ' + response.resultCode;
        }
      })
      .catch(() => {
        this.message = 'Subscription failed. Please try again.';
      });
  }

}