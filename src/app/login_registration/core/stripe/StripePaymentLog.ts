import { StripeSubscriptionPlans } from "./StripeSubscriptionPlans";

export interface StripePaymentLog {
    Payment_Log_ID: number;
    BK_SubscriptionId: number;
    BK_StripePayStatusId: number;
    BK_PlanId: string;
    StripePaymentToken: string;
    StripeSubscriptionId: string;
    StripePayStatusName: string;
    StripeCustomerId: string;
    PaymentIntentId: string;
    Payment: number;
    TotalRecords:number;
    PaymentDate?: Date;  // Optional since it's nullable in C#
    TrialExpiredOn?: Date;  // Optional since it's nullable in C#
    SubscriptionExpiredOn?: Date;  // Optional since it's nullable in C#
    Plans: StripeSubscriptionPlans; // Assuming you have this interface defined
}
