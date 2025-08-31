import { Component, OnInit, Input, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { StripeModel } from '../../login_registration/models/stripe.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StripeUserDataService } from '../../login_registration/services/stripe.userData.service';
import { StripeService } from '../../login_registration/services/stripe.service';
import { StripeSubscription } from '../../login_registration/core/stripe/StripeSubscription';
import { StripePaymentLog } from '../../login_registration/core/stripe/StripePaymentLog';
import { Filter } from '../../main_containers/core/filter';
import { LoginLog } from '../../login_registration/core/stripe/LoginLog';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  standalone: false
})
export class ActivityLogComponent implements OnInit {

  @Output() callBack = new EventEmitter<boolean>(); // EventEmitter for parent component communication
  @ViewChild('cancelBtn') cancelBtn!: ElementRef;   // Reference to the cancel button

  // Instance of StripeModel to handle Stripe operations
  stripeModel!: StripeModel;

  // Array to hold login logs fetched from the backend
  LoginLogList: LoginLog[] = [];

  // Object to manage pagination, sorting, and filtering
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };

  // UI fields (used for filtering or displaying)
  selectedEmail: string = '';
  selectedName: string = '';
  startingIndex: number = 0;
  constructor(
    private http: HttpClient,
    private router: Router,
    private stripeUserDataService: StripeUserDataService,
    private stripeService: StripeService
  ) {
    // Initialize the StripeModel with its service dependency
    this.stripeModel = new StripeModel(this.stripeService);
  }

  // Lifecycle hook: runs once on component initialization
  ngOnInit() {
    // Fetch initial data for Stripe subscription log list
    this.GetStripeSubscriptionList(0, 16);
  }

  /**
   * Fetches the Stripe login log list using the current filters.
   * @param FilterId - Any specific filter ID to apply
   * @param SPType - Stripe subscription type or category
   */
  GetStripeSubscriptionList(FilterId: number, SPType: number) {
    this.stripeModel.GetLoginLogListServiceCall(this.currentFilter, FilterId, SPType).then(() => {
      // Assign response to the local list for display
      const Details = this.stripeModel.GetLoginLogList();
      this.LoginLogList = Details;
    });
  }

  /**
   * Handles pagination event from the table paginator
   * @param event - The paginator event object
   */
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
      this.startingIndex = (this.currentFilter.CurrentPage - 1) * this.currentFilter.RecordsPerPage;

    this.GetStripeSubscriptionList(0, 16);
  }

  /**
   * Resets the search filter and sets page to 1
   */
  searchResetFunction() {
    this.currentFilter.CurrentPage = 1;
  }

  /**
   * Handles sorting logic on table column click
   * @param column - Column name to sort by
   */
  sortOnClick(column: string) {
    if (this.currentFilter.SortCol === '') {
      // Apply new sort column
      this.currentFilter.SortCol = column;
      this.currentFilter.SortAsc = true;
    } else if (this.currentFilter.SortCol === column && this.currentFilter.SortAsc) {
      // Toggle to descending
      this.currentFilter.SortAsc = false;
    } else if (this.currentFilter.SortCol === column && !this.currentFilter.SortAsc) {
      // Clear sort
      this.currentFilter.SortCol = '';
      this.currentFilter.SortAsc = true;
    } else {
      // Set new column sort
      this.currentFilter.SortCol = column;
      this.currentFilter.SortAsc = true;
    }

    // Re-fetch data with new sort settings
    this.GetStripeSubscriptionList(0, 16);
  }
}
