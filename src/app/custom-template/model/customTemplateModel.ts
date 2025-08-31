import { Subscription } from "rxjs";
import { UserType } from "../../admin/core/userType";
import { CustomTemplateService } from "../service/custom-template.service";
import { ConfigValues } from "../core/configValues";

export class CustomTemplateModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private customTemplateService: CustomTemplateService) {

    }

    // Unsubscribe all
    UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // Getting the config values
    GetConfigValues(styleType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.customTemplateService.GetConfigValues(styleType).subscribe(
                data => {
                    let returnData = <ConfigValues[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the login page button styles
    SetConfigValues(configValuesList: ConfigValues[]) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.customTemplateService.SetConfigValues(configValuesList).subscribe(
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