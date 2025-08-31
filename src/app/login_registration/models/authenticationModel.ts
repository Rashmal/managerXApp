import { Subscription } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { Country } from "../core/country";
import { UserDetails } from '../core/userDetails';
import { UserType } from "../../admin/core/userType";

export class AuthenticationModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private authenticationService: AuthenticationService) {

    }

    // Unsubscribe all
    UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // Check if the email exists with user type
    CheckEmailExistsWithUserType(userEmail: string, userType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.CheckEmailExistsWithUserType(userEmail, userType).subscribe(
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

    // Authenticating the login
    LoginAuthentication(email: string, password: string, userType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.LoginAuthentication(email, password, userType).subscribe(
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

    // Getting the role details
    GetRoleDetails(userTypeId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.GetRoleDetails(userTypeId).subscribe(
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

    // Getting the country details
    GetCountryDetails() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.GetCountryDetails().subscribe(
                data => {
                    let returnData = <Country[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Registering the new user
    RegisterSetUser(UserDetails: UserDetails, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.RegisterSetUser(UserDetails, actionType).subscribe(
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


    // Registering the new user with chat room
    RegisterSetUserWithChatRoom(UserDetails: UserDetails, roomId: number, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.RegisterSetUserWithChatRoom(UserDetails, roomId, projectId).subscribe(
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

    // Getting the user type details
    GetUserTypeDetails() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.GetUserTypeDetails().subscribe(
                data => {
                    let returnData = <UserType[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the user password
    SetUserPassword(userId: number, newPassword: string, userEmail: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.SetUserPassword(userId, newPassword, userEmail).subscribe(
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

    // Getting the user password
    GetUserPassword(userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.GetUserPassword(userId).subscribe(
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

    // CheckIfEmailIsDisabled
    CheckIfEmailIsDisabled(userEmail: string, userType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authenticationService.CheckIfEmailIsDisabled(userEmail, userType).subscribe(
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
}