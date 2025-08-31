export interface StripePaymentOverdue {
    PaymentLogId:number ;
    TrialExpiredOn: Date;
    SubscriptionExpiredOn: Date; // Optional in case it fails
    SubscriptionStatusName : string,
    PaymentStatusName: string,
    StripeSubscriptionId: string
  }
  