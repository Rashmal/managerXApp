import { StripePerson } from "./StripePerson";

 
export interface StripeSubscription {
    SubscriptionId: number;
    Email: string;
    StripeCustomerId: string;
    BK_StripeStatusId: number;
    StripeStatusName: string;
    StartedDate: Date;
    EndDate: Date;
    
    // Nested StripePerson Object
    Person: StripePerson;

    TotalRecords:number;
}
