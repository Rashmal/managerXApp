export interface ConfirmSubscriptionRequest {
  PaymentMethod?: string;
  Email: string;
  PlanId: string;
  CustomerId: string;
  PaymentMethodId: string;
  PriceId: string;  
  Name: string;
  PlanName: string;
  UserType: string;
  Price: number;
  ExtraCharge: number;
  NoOfUserAccounts: number;
  IsStripeLimitIncreaseReqLogin?: boolean;
  TrialDays: number;
 // SetupFeePriceId: string;
  Quantity: number;

}