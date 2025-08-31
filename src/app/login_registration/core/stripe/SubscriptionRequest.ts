export interface SubscriptionRequest {

  CustomerId: string;
  PaymentMethodId: string;
  PriceId: string;
  Email: string;
  Name: string;
  PlanName: string;
  UserType: string;
  Price: number;
  ExtraCharge: number;
  NoOfUserAccounts: number;
  IsStripeLimitIncreaseReqLogin?: boolean;
  TrialDays: number;
  SetupFeePriceId: string;
  Quantity: number;

}