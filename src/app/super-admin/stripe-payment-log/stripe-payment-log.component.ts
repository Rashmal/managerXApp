import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StripeModel } from '../../login_registration/models/stripe.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StripeUserDataService } from '../../login_registration/services/stripe.userData.service';
import { StripeService } from '../../login_registration/services/stripe.service';
import { StripeSubscription } from '../../login_registration/core/stripe/StripeSubscription';
import { StripePaymentLog } from '../../login_registration/core/stripe/StripePaymentLog';
import { MessageService } from 'primeng/api';
import { Filter } from '../../main_containers/core/filter';

@Component({
  selector: 'app-stripe-payment-log',
  templateUrl: './stripe-payment-log.component.html',
  styleUrl: './stripe-payment-log.component.scss',
  standalone: false
})
export class StripePaymentLogComponent implements OnInit {
  @Input() SelectedProductItemId: number = 0; // passing parameter from main component
  @Input() selectedEmail: string = '';
  @Input() selectedName: string = '';
  @Output() closeSlideInPopup = new EventEmitter<boolean>();
  @Output() callBack = new EventEmitter<boolean>(); // EventEmitter to handle callback


  // Stores the Stripe payment details and response  
  stripeModel!: StripeModel;
  // Stores the  StripeSubscriptionPlans
  StripePaymentLogList: StripePaymentLog[] = []

  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };

  constructor(private http: HttpClient, private router: Router, private stripeUserDataService: StripeUserDataService, private stripeService: StripeService, private messageService: MessageService) {

    // Initialize the models
    this.stripeModel = new StripeModel(this.stripeService);
  }

  ngOnInit() {
    // Getting  SubscriptionPlans
    this.GetStripePaymentLogList(this.SelectedProductItemId, 6);

  }

  // Closing the slide in popup
  closeCategoryPopup(event: boolean) {
    if (event) {
      this.callBack.emit(true); // Emit callback if event is true
    }
  }



  // Getting  PaymentLog
  GetStripePaymentLogList(FilterId: number, SPType: number) {
    // Call the model to check if there is any overdue payment for the given email
    this.stripeModel.GetStripePaymentLogListServiceCall(this.currentFilter, FilterId, SPType).then(() => {
      // Fetching the payment overdue details from the model
      let Details = this.stripeModel.GetStripePaymentLogList();
      this.StripePaymentLogList = Details;
      // Ensure the list is not empty

    }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetStripePaymentLogList(this.SelectedProductItemId, 6);
  }


  refund(StripeSubscriptionId: string, planCode: string, payment: number) {
    let planName = '';
    if (planCode == 'AD') {
      planName = 'Admin Plan'
    } else if (planCode == 'PM') {
      planName = 'Project Manager Plan'
    } else {
      planName = 'Suppler Plan'
    }

    // Call the service to confirm the subscription with the provided payment method
    this.stripeModel.RefundMethodServiceCall(StripeSubscriptionId, this.selectedEmail, planName, this.selectedName, payment).then(
      (data: any) => {
        // Getting  SubscriptionPlans
        this.GetStripePaymentLogList(this.SelectedProductItemId, 6);
        if (data.Error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Refund Failed',
            detail: 'An error occurred while processing the refund.',
            life: 3000 // Toast disappears after 3 seconds
          });

        } else {
          // Getting  SubscriptionPlans
          this.GetStripePaymentLogList(this.SelectedProductItemId, 6);
          // Show success toast
          this.messageService.add({
            severity: 'success',
            summary: 'Refund Successful',
            detail: 'The refund has been processed successfully.',
            life: 3000
          });

        }
      }
    );
  }


}


