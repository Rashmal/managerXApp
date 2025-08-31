import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement, StripeCardElementOptions, StripeError } from '@stripe/stripe-js';

import { HttpClient } from '@angular/common/http';
import { StripeService } from '../../services/stripe.service';
import { StripeModel } from '../../models/stripe.model';
import { SubscriptionRequest } from '../../core/stripe/SubscriptionRequest';
import { StripeUserDataService } from '../../services/stripe.userData.service';
import { UserDetails } from '../../core/userDetails';
import { Router } from '@angular/router';
import { StripeSubscriptionPlans } from '../../core/stripe/StripeSubscriptionPlans';

@Component({
  selector: 'app-stripe-plans',
  templateUrl: './stripe-plans.component.html',
  styleUrl: './stripe-plans.component.scss',
  standalone: false
})
export class StripePlansComponent implements OnInit {


  // Store the user details object
  userDetails!: UserDetails;

  // Stores the  StripeSubscriptionPlans
  StripeSubscriptionPlansList: StripeSubscriptionPlans[] = [];

  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;

  //Start Stores  price plans
  AdminPlanPrice: number = 0;
  PmPlanPrice: number = 0;
  SupplierPlanPrice: number = 0;
  //End Stores  price plans

  //Start store user account limitations
  AdminLimitationAccount: number = 0;
  PMLimitationAccount: number = 0;
  SupplerLimitationAccount: number = 0;
  //End store user account limitations

  constructor(private http: HttpClient, private router: Router, private stripeUserDataService: StripeUserDataService, private stripeService: StripeService) {
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


    this.stripeModel = new StripeModel(this.stripeService);
  }

  ngOnInit() {
    // Getting  SubscriptionPlans
    this.GetSubscriptionPlans();

    const userDetails = this.stripeUserDataService.getUserDetails();
    if (userDetails) {
      this.userDetails = userDetails;
    }

  }


  //function for pass the details to the stripe page
  doThePayment(Plan_Name: any) {

    this.userDetails.Plan_Name = Plan_Name;
    this.userDetails.IsStripeLimitIncreaseReqLogin = false;
    this.stripeUserDataService.setUserDetails(this.userDetails);
    // Redirect to the stripe page
    this.router.navigate(['/adyenTest']);
  }

  //back function
  backFunction() {
    // Redirect to the login page
    this.router.navigate(['/login']);
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
        this.StripeSubscriptionPlansList.forEach(plan => {
          if (plan.Plan_Name === 'Plan1') {
            this.AdminPlanPrice = plan.Plan_Price;
            this.AdminLimitationAccount = plan.Plan_Limitation;
          } else if (plan.Plan_Name === 'Plan2') {
            this.PmPlanPrice = plan.Plan_Price;
            this.PMLimitationAccount = plan.Plan_Limitation;
          } else if (plan.Plan_Name === 'Plan3') {
            this.SupplierPlanPrice = plan.Plan_Price;
            this.SupplerLimitationAccount = plan.Plan_Limitation;
          }
        });
      }
    }
    );
    // End of Calling the model to retrieve the data
  }
}
