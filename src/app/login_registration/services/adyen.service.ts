
import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ErrorMessage } from '../core/errorMessage';
import { ConfirmSubscriptionRequest } from '../core/Adyen/ConfirmSubscriptionRequest';




@Injectable({
    providedIn: 'root'
})
export class AdyenService {

    private initiateUrl = API$DOMAIN + 'api/adyen/initiate';
    private confirmSubscriptionUrl = API$DOMAIN + 'api/adyen/confirmSubscription';
    // Constructor
    constructor(private http: HttpClient, private router: Router) {

    }

    InitiateMethodService(email: string, selectedPlanId: string) {
        // Setting the params
        let my_params = new HttpParams()
            .set("email", email.toString())
            .set("planId", selectedPlanId.toString());
        return this.http.post<any>(this.initiateUrl, null, { params: my_params }).pipe(
            catchError(error => {
                return of(false); // or return throwError(error);
            })
        );
    }

    ConfirmSubscriptionMethodService(confirmSubscriptionRequest:ConfirmSubscriptionRequest) {
        // Setting the params
        let my_params = new HttpParams();

        return this.http.post<string>(this.confirmSubscriptionUrl, confirmSubscriptionRequest, { params: my_params }).pipe(
            catchError(error => {
                return of(false); // or return throwError(error);
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