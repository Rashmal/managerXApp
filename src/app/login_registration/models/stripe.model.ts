
import { Subscription } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { Country } from "../core/country";
import { UserDetails } from '../core/userDetails';
import { UserType } from "../../admin/core/userType";
import { StripeService } from "../services/stripe.service";
import { SubscriptionRequest } from "../core/stripe/SubscriptionRequest";
import { StripePaymentOverdue } from "../core/stripe/StripePaymentOverdue";
import { StripeSubscriptionPlans } from "../core/stripe/StripeSubscriptionPlans";
import { StripeSubscription } from "../core/stripe/StripeSubscription";
import { StripePaymentLog } from "../core/stripe/StripePaymentLog";
import { Filter } from "../../main_containers/core/filter";
import { AssigneeCount } from "../core/stripe/AssigneeCount";
import { LoginLog } from "../core/stripe/LoginLog";



export class StripeModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Store the user token
    CustomerId: string = "";

    StripePaymentOverdue !: StripePaymentOverdue;

    StripeSubscriptionPlansList: StripeSubscriptionPlans[] = [];

    StripeSubscriptionList: StripeSubscription[] = [];

    LoginLogList: LoginLog[] = [];

    StripePaymentLogList: StripePaymentLog[] = [];

    AssigneeCountList: AssigneeCount[] = [];

    NoOfUserAccounts: number = 0;

    status: boolean = false;
    GetCustomerId() {
        return this.CustomerId;
    }

    GetStripePaymentOverdue() {
        return this.StripePaymentOverdue;
    }


    GetStripeSubscriptionPlans() {
        return this.StripeSubscriptionPlansList;
    }

    GetStripeSubscriptionList() {
        return this.StripeSubscriptionList;
    }

    GetStripePaymentLogList() {
        return this.StripePaymentLogList;
    }

    GetAssigneeCountList() {
        return this.AssigneeCountList;
    }


    GetNoOfUserAccounts() {
        return this.NoOfUserAccounts;
    }

    GetLoginLogList() {
        return this.LoginLogList;
    }




    // Constructor
    constructor(private stripeService: StripeService) {

    }

    // Check if the email exists with user type
    CreateCustomerMethodServiceCall(customerId: string, requestData: string, userType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.CreateCustomerMethod(customerId, requestData, userType).subscribe(
                data => {
                    let returnData = <string>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }


    // Check if the email exists with user type
    ConfirmSubscriptionServiceCall(subscriptionRequest: SubscriptionRequest) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.ConfirmSubscription(subscriptionRequest).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }




    CheckStripeCustomerServiceCall(email: string) {
        // Setting the promise
        var promise = new Promise((resolve, reject) => {
            // Adding to the all subscriptions
            this.allSubscriptions.push(
                // Calling the service
                this.stripeService.CheckStripeCustomer(email).subscribe(
                    data => {
                        // Assigne the data
                        this.CustomerId = <string>data;
                        // Resolve the promise
                        resolve(this.CustomerId);
                    }
                )
                // End of Calling the service
            );
            // End of Adding to the all subscriptions
        });
        // End of Setting the promise

        // return the promise
        return promise;
    }






    CheckStripePaymentOverdueServiceCall(email: string, userType: string) {
        // Setting the promise
        var promise = new Promise((resolve, reject) => {
            // Adding to the all subscriptions
            this.allSubscriptions.push(
                // Calling the service
                this.stripeService.CheckStripePaymentOverdue(email, userType).subscribe(
                    data => {
                        // Assigne the data
                        this.StripePaymentOverdue = <StripePaymentOverdue>data;
                        // Resolve the promise
                        resolve(this.CustomerId);
                    }
                )
                // End of Calling the service
            );
            // End of Adding to the all subscriptions
        });
        // End of Setting the promise

        // return the promise
        return promise;
    }


    // Getting the GetSubscriptionPlans
    GetSubscriptionPlans() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetSubscriptionPlans().subscribe(
                data => {
                    this.StripeSubscriptionPlansList = <StripeSubscriptionPlans[]>data;
                    // Resolve the promise
                    resolve(this.StripeSubscriptionPlansList);
                })
            );
        });
        // return the promise
        return promise;
    }





    // Getting the GetSubscriptionAccountsList
    GetSubscriptionAccountsListServiceCall(filter: Filter, FilterId: number, SPType: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetSubscriptionAccountsList(filter, FilterId, SPType).subscribe(
                data => {
                    this.StripeSubscriptionList = <StripeSubscription[]>data;
                    // Resolve the promise
                    resolve(this.StripeSubscriptionList);
                })
            );
        });
        // return the promise
        return promise;
    }


    // Getting the GetStripePaymentLogList
    GetStripePaymentLogListServiceCall(filter: Filter, FilterId: number, SPType: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetStripePaymentLogList(filter, FilterId, SPType).subscribe(
                data => {
                    this.StripePaymentLogList = <StripePaymentLog[]>data;
                    // Resolve the promise
                    resolve(this.StripePaymentLogList);
                })
            );
        });
        // return the promise
        return promise;
    }



    // RefundMethodServiceCall
    RefundMethodServiceCall(StripeSubscriptionId: string, selectedEmail: string, planName: string, Name: string, payment: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.RefundMethod(StripeSubscriptionId, selectedEmail, planName, Name, payment).subscribe(
                data => {
                    let returnData = <string>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }


    // Getting the GetAssigneeCountListServiceCall
    GetAssigneeCountListServiceCall(FilterId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetAssigneeCountList(FilterId).subscribe(
                data => {
                    this.AssigneeCountList = <AssigneeCount[]>data;
                    // Resolve the promise
                    resolve(this.AssigneeCountList);
                })
            );
        });
        // return the promise
        return promise;
    }


    // Getting the GetNoOfAccountCanBeCreateService Call
    GetNoOfAccountCanBeCreateServiceCall(FilterName: string, userType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetNoOfAccountCanBeCreateService(FilterName, userType).subscribe(
                data => {
                    this.NoOfUserAccounts = <number>data;
                    // Resolve the promise
                    resolve(this.NoOfUserAccounts);
                })
            );
        });
        // return the promise
        return promise;
    }




    // Getting the GetNoOfAccountCanBeCreateService Call
    CancelSubscriptionAsyncServiceCall(subscriptionId: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.CancelSubscriptionAsyncService(subscriptionId).subscribe(
                data => {
                    this.status = <boolean>data;
                    // Resolve the promise
                    resolve(this.status);
                })
            );
        });
        // return the promise
        return promise;
    }




    // Getting the GetLoginLogListServiceCall
    GetLoginLogListServiceCall(filter: Filter, FilterId: number, SPType: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.stripeService.GetLoginLogListService(filter, FilterId, SPType).subscribe(
                data => {
                    this.LoginLogList = <LoginLog[]>data;
                    // Resolve the promise
                    resolve(this.LoginLogList);
                })
            );
        });
        // return the promise
        return promise;
    }
}