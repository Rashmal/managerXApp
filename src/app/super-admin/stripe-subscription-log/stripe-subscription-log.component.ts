import { Component, AfterViewInit, OnInit, Input, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { StripeModel } from '../../login_registration/models/stripe.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StripeUserDataService } from '../../login_registration/services/stripe.userData.service';
import { StripeService } from '../../login_registration/services/stripe.service';
import { StripeSubscription } from '../../login_registration/core/stripe/StripeSubscription';
import { StripePaymentLog } from '../../login_registration/core/stripe/StripePaymentLog';
import { Filter } from '../../main_containers/core/filter';

@Component({
  selector: 'app-stripe-subscription-log',
  templateUrl: './stripe-subscription-log.component.html',
  styleUrl: './stripe-subscription-log.component.scss',
  standalone: false
})
export class StripeSubscriptionLogComponent implements OnInit {
  @Output() callBack = new EventEmitter<boolean>();
  @ViewChild('cancelBtn') cancelBtn !: ElementRef;
  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  // Stores the  StripeSubscriptionPlans

  StripeSubscriptionList: StripeSubscription[] = []

  StripePaymentLogList: StripePaymentLog[] = []
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  constructor(private http: HttpClient, private router: Router, private stripeUserDataService: StripeUserDataService, private stripeService: StripeService) {


    this.stripeModel = new StripeModel(this.stripeService);
  }

  ngOnInit() {
    // Getting  SubscriptionPlans
    this.GetStripeSubscriptionList(0, 1);
  }

  // Getting  SubscriptionList
  GetStripeSubscriptionList(FilterId: number, SPType: number) {
    // Call the model to check if there is any overdue payment for the given email
    this.stripeModel.GetSubscriptionAccountsListServiceCall(this.currentFilter,FilterId, SPType).then(() => {
      // Fetching the payment overdue details from the model
      let Details = this.stripeModel.GetStripeSubscriptionList();
      this.StripeSubscriptionList = Details;
      // Ensure the list is not empty

    }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetStripeSubscriptionList(0, 1);
  }




 selectedEmail : string= '';
selectedName : string= '';

  OpenPaymentLog(FilterId: number,Email: string,Name: string) {
    // Setting the selected product ID for editing.
    this.SelectedProductItemId = FilterId;
    this.selectedEmail= Email;
    this.isAddNewProductVisible = true;
    this.selectedName = Name;
  }

  SelectedProductItemId: number = 0;
  isAddNewProductVisible: boolean = false;

  // Closing the slide in popup
  closeSlideInPopup(event: boolean) {

    this.isAddNewProductVisible = false;
    // Check the event
    if (event) {  
      this.callBack.emit(true);
      this.cancelBtn.nativeElement.click();
    }
    // End of Check the event
  }

  backFunction(){
    this.isAddNewProductVisible = false;
  }
}


