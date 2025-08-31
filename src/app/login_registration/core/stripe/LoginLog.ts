export interface LoginLog {
  JWTID: number;
  PersonID: number;
  JWTToken: string;
  TokenAddedDate: string; // ISO date string (can be converted to Date if needed)
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  UserTypeName: string;
  TotalRecords: number;
}
