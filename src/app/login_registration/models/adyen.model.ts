import { Subscription } from "rxjs";
import { AdyenService } from "../services/adyen.service";
import { ConfirmSubscriptionRequest } from "../core/Adyen/ConfirmSubscriptionRequest";




export class AdyenModel {

    
    //Store subscriptions
    allSubscriptions: Subscription[] = [];
    // Constructor
    constructor(private adyenService: AdyenService) {

    }
    // Check if the email exists with user type
    InitiateMethodServiceCall(email: string, selectedPlanId: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adyenService.InitiateMethodService(email, selectedPlanId).subscribe(
                data => {
                    let returnData = <any>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }



    ConfirmSubscriptionMethodServiceCall(confirmSubscriptionRequest: ConfirmSubscriptionRequest) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adyenService.ConfirmSubscriptionMethodService(confirmSubscriptionRequest).subscribe(
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


}