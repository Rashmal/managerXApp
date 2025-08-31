export interface OverallCookieInterface {
    // ----------------------------- Setters ----------------------------- 
    SetUserToken(userToken: string): void;
    ClearCookies(): void;
    // ----------------------------- Getters ----------------------------- 
    GetUserToken(): string;
    GetUserFullName(): string;
    GetUserAvatar(): string;
    GetUserId(): number;
    GetUserEmail(): string;
    GetUserRole(): string;
    GetUserType(): string;
}