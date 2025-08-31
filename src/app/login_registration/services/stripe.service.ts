
import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ErrorMessage } from '../core/errorMessage';
import { Country } from '../core/country';
import { UserDetails } from '../core/userDetails';
import { UserType } from '../../admin/core/userType';
import { SubscriptionRequest } from '../core/stripe/SubscriptionRequest';
import { StripePaymentOverdue } from '../core/stripe/StripePaymentOverdue';
import { StripeSubscriptionPlans } from '../core/stripe/StripeSubscriptionPlans';
import { StripePaymentLog } from '../core/stripe/StripePaymentLog';
import { StripeSubscription } from '../core/stripe/StripeSubscription';
import { Filter } from '../../main_containers/core/filter';
import { AssigneeCount } from '../core/stripe/AssigneeCount';
import { LoginLog } from '../core/stripe/LoginLog';




@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private CreateStripeCustomerUrl = API$DOMAIN + 'api/Stripe/CreateStripeCustomer';
  private ConfirmPaymentIntentUrl = API$DOMAIN + 'api/Stripe/confirmSubscription';
  private CheckStripeCustomerUrl = API$DOMAIN + 'api/Stripe/CheckStripeCustomer';
  private CheckStripePaymentOverdueUrl = API$DOMAIN + 'api/Stripe/CheckStripePaymentOverdue';
  private GetSubscriptionPlansUrl = API$DOMAIN + 'api/Stripe/GetSubscriptionPlans';
  private GetSubscriptionAccountsUrl = API$DOMAIN + 'api/Stripe/GetSubscriptionAccounts';
  private GetStripePaymentLogListUrl = API$DOMAIN + 'api/Stripe/GetStripePaymentLogList';
  private RefundPaymentAsyncUrl = API$DOMAIN + 'api/Adyen/RefundPaymentAsync';


  private GetAssigneeCountUrl = API$DOMAIN + 'api/Stripe/GetAssigneeCount';
  private GetNoOfAccountCanBeCreateUrl = API$DOMAIN + 'api/Stripe/GetNoOfAccountCanBeCreate';
 private CancelSubscriptionAsyncUrl = API$DOMAIN + 'api/Stripe/CancelSubscriptionAsync';


   private  GetLoginLogListUrl = API$DOMAIN + 'api/Stripe/GetLoginLogList';
  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }


  CreateCustomerMethod(email: string, name: string, userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("email", email.toString())
      .set("name", name.toString())
      .set("userType", userType.toString());

    return this.http.post<string>(this.CreateStripeCustomerUrl, null, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(error);
      })
    );
  }

  ConfirmSubscription(subscriptionRequest: SubscriptionRequest) {
    return this.http.post<boolean>(this.ConfirmPaymentIntentUrl, subscriptionRequest).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }



  CheckStripeCustomer(email: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("email", email.toString());
    return this.http.get<string>(this.CheckStripeCustomerUrl, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }


  CheckStripePaymentOverdue(email: string, userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("email", email.toString())
      .set("userType", userType.toString());
    return this.http.get<StripePaymentOverdue>(this.CheckStripePaymentOverdueUrl, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }

  // Getting the GetSubscriptionPlans
  GetSubscriptionPlans() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<StripeSubscriptionPlans[]>(this.GetSubscriptionPlansUrl, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }



  // Getting the GetSubscriptionAccounts
  GetSubscriptionAccountsList(filter: Filter, FilterId: number, SPType: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("FilterId", FilterId.toString())
      .set("SPType", SPType.toString());

    return this.http.post<StripeSubscription[]>(this.GetSubscriptionAccountsUrl, filter, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }


  // Getting the GetStripePaymentLogList
  GetStripePaymentLogList(filter: Filter, FilterId: number, SPType: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("FilterId", FilterId.toString()).set("SPType", SPType.toString());

    return this.http.post<StripePaymentLog[]>(this.GetStripePaymentLogListUrl, filter, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }


  RefundMethod(StripeSubscriptionId: string, selectedEmail: string, planName: string, Name: string, payment: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subscriptionId", StripeSubscriptionId.toString())
      .set("selectedEmail", selectedEmail.toString())
      .set("planName", planName.toString())
      .set("Name", Name.toString())
      .set("payment", payment.toString());

    return this.http.post<string>(this.RefundPaymentAsyncUrl, null, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the GetAssigneeCount 
  GetAssigneeCountList(FilterId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("FilterId", FilterId.toString());

    return this.http.get<AssigneeCount[]>(this.GetAssigneeCountUrl, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }

 // Getting the GetAssigneeCount 
 GetNoOfAccountCanBeCreateService(FilterName: string, userType: string) {
  // Setting the params
  let my_params = new HttpParams()
    .set("FilterName", FilterName.toString())
    .set("userType", userType.toString());

  return this.http.get<number>(this.GetNoOfAccountCanBeCreateUrl, { params: my_params }).pipe(
    catchError(error => {
      return of(false); // or return throwError(() => new Error(error));
    })
  );
}
 
  CancelSubscriptionAsyncService(subscriptionId: string) {
     
    // Setting the params
    let my_params = new HttpParams()
      .set("subscriptionId", subscriptionId.toString()) ;

    return this.http.post<boolean>(this.CancelSubscriptionAsyncUrl, null, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(error);
      })
    );
  }


  // Getting the GetStripePaymentLogList
  GetLoginLogListService(filter: Filter, FilterId: number, SPType: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("FilterId", FilterId.toString()).set("SPType", SPType.toString());

    return this.http.post<LoginLog[]>(this.GetLoginLogListUrl, filter, { params: my_params }).pipe(
      catchError(error => {
        return of(false); // or return throwError(() => new Error(error));
      })
    );
  }

  

  //----------- Common methods------------------//
  //The function of handling the error
  private handleError(methodName: string, exception: any) {
    // Creating the error message object 
    let errorMessage: ErrorMessage = {
      Name: exception.name,
      Message: exception.message,
      StatusText: exception['statusText'],
      Url: exception['url'].toString()
    };
    // Redirect to the error message
    this.router.navigate(['errorMessage'], { state: { response: errorMessage } });
  }
}