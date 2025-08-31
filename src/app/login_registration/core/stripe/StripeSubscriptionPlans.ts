export interface StripeSubscriptionPlans {
    Plan_ID: number;
    Plan_Name: string;
    Plan_Price: number; // decimal in C# corresponds to number in TypeScript
    PriceToken: string;
    Trial_Period_Days: number;
    Plan_Valid_Start_Date: Date;
    Plan_Valid_End_Date: Date;
    Is_Plan_Disabled: boolean;
    Plan_Limitation:number;
    LimitExRatio:number;
    LimitPriceToken: string;
}
