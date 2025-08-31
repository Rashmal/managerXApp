import { Component, AfterViewInit, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrl: './stripe-payment.component.scss',
  standalone: false
})
export class StripePaymentComponent implements OnInit {

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
  subscriptionRequest: SubscriptionRequest = {
    CustomerId: this.customerId,  // Stripe Customer ID  
    PaymentMethodId: '',          // Stripe Payment Method ID (to be assigned during transaction)  
    PriceId: '',                  // Selected Stripe Price ID for the subscription  
    Email: '',
    Name: '',
    PlanName: '',
    UserType: '',
    Price: 0,
    ExtraCharge: 0,
    NoOfUserAccounts: 0,
    TrialDays: 0,
    SetupFeePriceId: '',
    Quantity: 0

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
  ADPriceToken: string = '';
  PMPriceToken: string = '';
  SPPriceToken: string = '';

  //LimitPrice token
  LMPlan1Token: string = '';
  LMPlan2Token: string = '';
  LMPlan3Token: string = '';

  //Stores Plan Name
  //PlanName: string = '';

  //Stores Plan Price
  PlanPrice: number = 0;

  //store is card is valid
  isCardValid: boolean = false;
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

  constructor(private router: Router, private http: HttpClient, private stripeService: StripeService, private stripeUserDataService: StripeUserDataService, private authenticationService: AuthenticationService) {
    this.stripeModel = new StripeModel(this.stripeService);
    this.overallCookieInterface = new OverallCookieModel();
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
  }

  ngOnInit() {

    // Initialize Stripe elements, including the card input field
    this.initializeStripe();

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





  }



  //initalize  the stripe 
  initializeStripe() {
    loadStripe('pk_test_51R4JTGPLLkQE7csziRVGXhuQVEDwbMB9OrMJcXKDmAWUBnN9woE2Pgte0lZURjQRAVKsjlFV05DsdKvtFPoMC8SF000aguTYc3')
      .then((stripe: any) => {
        this.stripe = stripe;
        this.elements = stripe.elements();

        // Create an instance of the card element
        this.card = this.elements.create('card', {
          hidePostalCode: false // Include postal code
        });

        this.card.mount('#card-element');

        // Listen for real-time validation errors from the card Element
        this.card.addEventListener('change', (event: any) => {
          if (event.error || !event.complete) {
            this.isCardValid = false;
          } else {
            this.isCardValid = true;
          }
        });
      });
  }




  //pay subscription 
  async paySubscription() {
    if (this.Plan_Name = 'Plan1') {
      //   this.SetupFeePriceId = 'price_1ROwSrPLLkQE7cszsrWx7vjD';
      this.SetupFeePriceId = this.LMPlan1Token;
    } else if (this.Plan_Name = 'Plan2') {
      //  this.SetupFeePriceId = '';
      this.SetupFeePriceId = this.LMPlan2Token;
    } else {
      //  this.SetupFeePriceId = 'price_1ROwgvPLLkQE7cszQcTJ9YiO';
      this.SetupFeePriceId = this.LMPlan3Token;
    }
    try {
      // Check if the user already has a Stripe customer account associated with their email
      const result: any = await this.stripeModel.CheckStripeCustomerServiceCall(this.email);

      if (result === 'No') {
        // If no existing Stripe customer, create a new one and wait for it to complete
        this.customerId = await this.createCustomer();
        //set default settings for initial customer
        this.setTrialDays = 14;

      } else if (result === 'TrialGiven') {
        this.setTrialDays = 0;
        this.customerId = result;
      } else {
        this.setTrialDays = 0;
        // If customer exists, store their Stripe customer ID
        this.customerId = result;
      }

      // Ensure customer ID is available before proceeding
      if (!this.customerId) {
        console.error('Customer ID is missing!');
        return;
      }

      // Create a new payment method using Stripe
      const paymentMethodResponse = await this.createPaymentMethod();
      if (this.userDetails.IsStripeLimitIncreaseReqLogin == true) {

        // Prepare subscription request for only   limit increase request
        this.subscriptionRequest = {
          CustomerId: this.customerId,
          PaymentMethodId: paymentMethodResponse.id,
          PriceId: "price_1RLySWPLLkQE7cszskn77vBZ",
          Email: this.email,
          Name: this.name,
          PlanName: this.Plan_Name,
          Price: 0,
          UserType: this.userType,
          ExtraCharge: this.extraAddedPrice,
          NoOfUserAccounts: this.noOfAccounts,
          IsStripeLimitIncreaseReqLogin: true,
          TrialDays: 0,
          SetupFeePriceId: this.SetupFeePriceId,
          Quantity: this.extraNoOfAccounts
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

          return;
        }


      } else {
        // Prepare subscription request
        this.subscriptionRequest = {
          CustomerId: this.customerId,
          PaymentMethodId: paymentMethodResponse.id,
          PriceId: this.priceId,
          Email: this.email,
          Name: this.name,
          PlanName: this.Plan_Name,
          Price: this.PlanPrice,
          UserType: this.userType,
          ExtraCharge: this.extraAddedPrice,
          NoOfUserAccounts: this.noOfAccounts,
          TrialDays: this.setTrialDays,
          SetupFeePriceId: this.SetupFeePriceId,
          Quantity: this.extraNoOfAccounts
        };

      }

      // Confirm the subscription by linking the payment method with the Stripe subscription
      await this.confirmSubscriptionWithPaymentMethod(this.subscriptionRequest);

    } catch (error) {
      console.error('Error processing subscription:', error);
    }
  }

  //create customer
  async createCustomer(): Promise<string> {
    try {
      // Call the service to create a customer and wait for the response
      const result: any = await this.stripeModel.CreateCustomerMethodServiceCall(this.email, this.name, this.userType);

      // Ensure the result contains a valid customer ID
      if (!result) {
        throw new Error("Failed to create Stripe customer.");
      }

      return result; // Return the newly created customer ID
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }




  // Create the payment method
  async createPaymentMethod() {


    // Attempt to create a Stripe payment method using the provided card information
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',  // Specifies that the payment method type is a card
      card: this.card, // The Stripe card element that holds card details
    });

    // If there is an error during payment method creation, log it and throw an error
    if (error) {
      console.error('Payment Method creation error:', error);
      throw error;  // Propagate the error for further handling
    }

    // Return the created payment method if successful
    return paymentMethod;
  }


  // Confirm subscription with the payment method
  async confirmSubscriptionWithPaymentMethod(subscriptionRequest: SubscriptionRequest) {
    // Call the service to confirm the subscription with the provided payment method
    this.stripeModel.ConfirmSubscriptionServiceCall(subscriptionRequest).then(
      (data: any) => {

        if (data == 'succeeded') {
          // If the subscription confirmation is successful
          this.isLoading = false; // Stop the loading state once the process is complete

          // Push a success message to the errorMessagesList (you could rename this to successMessagesList for clarity)
          this.errorMessagesList.push(
            {
              ErrorCode: 'PAYMENT$SUCCESS', // Code indicating the payment was successful
              ErrorMessage: 'Payment Success' // Success message
            }
          );

          // Set a timeout to redirect the user to the login page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to login page
          }, 2000); // Wait for 2 seconds before navigating
        } else {

          // Push a success message to the errorMessagesList (you could rename this to successMessagesList for clarity)
          this.errorMessagesList.push(
            {
              ErrorCode: 'PAYMENT$FAILED', // Code indicating the payment was successful
              ErrorMessage: 'Payment Failed' // Success message
            }
          );

          // If the subscription confirmation is successful
          this.isLoading = false; // Stop the loading state once the process is complete

        }
      }
    );
  }



  //check db email is already registered
  checkEmailRegistered() {



    if (this.email.trim() === '' || this.checkIsAdminEmail == false) {
      return;
    }

    // Check if any email in the list matches the input email
    const found = this.ProhibitedEmailList.some(item => item.toLowerCase().startsWith(this.email.toLowerCase()));

    if (found) {

      this.errorMessagesList.push({
        ErrorCode: 'NOT$EXISTS$USER$EMAIL',
        ErrorMessage: 'This Email cannot do the payment'
      });
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
      return;
    }


    // Start loading state (e.g., show a loading spinner)
    this.isLoading = true;

    // Call the method to perform Stripe validation
    this.checkStripeValidation();
    /*  // Calling the model/service to check if the email already exists for the given user type
     this.authenticationModel.CheckEmailExistsWithUserType(this.email, this.userType).then(
       (data) => {
         // Parse the response to get the email existence status
         let emailExists: boolean = <boolean>data;
 
         // Check if the email exists
         if (emailExists) {
           // If the email exists, update the flag to true and proceed with further validation
           this.isEmailExists = true;
 
           // Call the method to perform Stripe validation
           this.checkStripeValidation();
 
         } else {
           // If the email does not exist, update the flag and stop loading
           this.isEmailExists = false;
           this.isLoading = false; // Stop the loading spinner
 
           // Push an error message indicating the email doesn't exist
           this.errorMessagesList.push(
             {
               ErrorCode: 'NOT$EXISTS$USER$EMAIL',
               ErrorMessage: 'User email does not exist or The plan does not match with registered account type'
             }
           );
         }
       }
     ); */
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
  checkStripeValidation() {
    //check limit increase request
    if (this.userDetails.IsStripeLimitIncreaseReqLogin == true) {

      // If there is no overdue payment, proceed with the payment function
      this.paySubscription();
    } else {


      // Call the model to check if there is any overdue payment for the given email
      this.stripeModel.CheckStripePaymentOverdueServiceCall(this.email, this.userType).then(() => {
        // Fetching the payment overdue details from the model
        let Details = this.stripeModel.GetStripePaymentOverdue();
        this.StripePaymentOverdue = Details;

        // Check if there is any overdue payment record
        if (this.StripePaymentOverdue === null || this.StripePaymentOverdue === undefined || this.StripePaymentOverdue.PaymentStatusName != 'Active') {
          // If there is no overdue payment, proceed with the payment function
          this.paySubscription();
        } else {
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

          if (token.Plan_Name === 'Plan1') {
            this.ADPriceToken = token.PriceToken;
            //  this.Plan_Name = 'Admin Plan';
            this.LMPlan1Token = token.LimitPriceToken;
          } else if (token.Plan_Name === 'Plan2') {
            this.PMPriceToken = token.PriceToken;
            //  this.Plan_Name = 'Project Manager Plan';
            this.LMPlan2Token = token.LimitPriceToken;
          } else if (token.Plan_Name === 'Plan3') {
            this.SPPriceToken = token.PriceToken;
            // this.Plan_Name = 'Supplier Plan';
            this.LMPlan3Token = token.LimitPriceToken;
          }
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
    if (this.noOfAccounts >= this.minNoOfAccounts) {


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
        if (this.noOfAccounts < currentNoOfAccounts) {

          this.previousNoOfAccount = currentNoOfAccounts;
          this.noOfAccounts = currentNoOfAccounts;
          //do the calculation
          this.calculation();
        }
        this.checkIsAdminEmail = true;
      } else {

        this.checkIsAdminEmail = false;
        this.errorMessagesList.push({
          ErrorCode: 'NOT$EXISTS$USER$EMAIL',
          ErrorMessage: 'This Email cannot do the payment!'
        });

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
}
