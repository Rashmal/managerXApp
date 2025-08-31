export interface UserBasicDetails {
    UserId: number;
    FirstName: string;
    LastName: string;
    RoleName: string;
    RoleCode: string;
    Email: string;
    UserType: string;
    Avatar: string;
    ContactNumber: string;
    CompanyName: string;
    ManageNotificationViaEmail: boolean;
    ManageNotificationViaSms: boolean;
    ManageNotificationViaInApp: boolean;
    TotalRecords: number;
}