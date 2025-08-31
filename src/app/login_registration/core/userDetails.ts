import { AddressDetails } from "./addressDetails";

export interface UserDetails {
    UserId: number;
    FirstName: string;
    LastName: string;
    Avatar: string;
    Email: string;
    Password: string;
    ContactNumber: string;
    BuilderCompanyName: string;
    RoleId: number;
    UserType: string;
    RoleCode: string;
    RoleName: string;
    AddressDetails: AddressDetails;
    TotalRecords: number;
    ProjectStartDate: Date;
    ProjectEndDate: Date;
    CreatorId: number;
    TempDisabled: false;
    Plan_Name?: string;
    IsStripeLimitIncreaseReqLogin ?: boolean;
    ISTrialIncrease?:boolean;
}