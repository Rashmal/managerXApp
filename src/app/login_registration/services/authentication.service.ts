import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ErrorMessage } from '../core/errorMessage';
import { Country } from '../core/country';
import { UserDetails } from '../core/userDetails';
import { UserType } from '../../admin/core/userType';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // API Urls
  private CheckEmailExistsWithUserTypeUrl = API$DOMAIN + 'api/Authentication/CheckEmailExistsWithUserType';
  private LoginAuthenticationUrl = API$DOMAIN + 'api/Authentication/LoginAuthentication';
  private GetRoleDetailsUrl = API$DOMAIN + 'api/Common/GetRoleDetails';
  private GetCountryDetailsUrl = API$DOMAIN + 'api/Common/GetCountryDetails';
  private RegisterSetUserUrl = API$DOMAIN + 'api/Authentication/RegisterSetUser';
  private RegisterSetUserWithChatRoomUrl = API$DOMAIN + 'api/Authentication/RegisterSetUserWithChatRoom';
  private GetUserTypeDetailsUrl = API$DOMAIN + 'api/Common/GetUserTypeDetails';

  private GetRoleByUserTypeUrl = API$DOMAIN + 'api/Admin/GetRoleByUserType';

  private GetUserPasswordUrl = API$DOMAIN + 'api/Common/GetUserPassword';
  private SetUserPasswordUrl = API$DOMAIN + 'api/Common/SetUserPassword';

  private CheckIfEmailIsDisabledUrl = API$DOMAIN + 'api/Authentication/CheckIfEmailIsDisabled';

  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }

  // CheckIfEmailIsDisabled
  CheckIfEmailIsDisabled(userEmail: string, userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userEmail", userEmail.toString())
      .set("userType", userType.toString());

    return this.http.get<boolean>(this.CheckIfEmailIsDisabledUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('CheckIfEmailIsDisabled', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the user password
  SetUserPassword(userId: number, newPassword: string, userEmail: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString())
      .set("newPassword", newPassword.toString())
      .set("userEmail", userEmail.toString());

    return this.http.get<boolean>(this.SetUserPasswordUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetUserPassword', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the user password
  GetUserPassword(userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString());

    return this.http.get<string>(this.GetUserPasswordUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetUserPassword', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the user type details
  GetUserTypeDetails() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<UserType[]>(this.GetUserTypeDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetUserTypeDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Registering the new user
  RegisterSetUser(UserDetails: UserDetails, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.RegisterSetUserUrl, UserDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RegisterSetUser', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Registering the new user with chat room
  RegisterSetUserWithChatRoom(UserDetails: UserDetails, roomId: number, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("roomId", roomId.toString())
      .set("projectId", projectId.toString());

    return this.http.post<boolean>(this.RegisterSetUserWithChatRoomUrl, UserDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RegisterSetUserWithChatRoom', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the country details
  GetCountryDetails() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<Country[]>(this.GetCountryDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetCountryDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the role details
  GetRoleDetails(userTypeId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userTypeId", userTypeId.toString());

    return this.http.get<string>(this.GetRoleDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetRoleDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Authenticating the login
  LoginAuthentication(email: string, password: string, userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("email", email.toString())
      .set("password", password.toString())
      .set("userType", userType.toString());

    return this.http.get<string>(this.LoginAuthenticationUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('LoginAuthentication', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Check if the email exists with user type
  CheckEmailExistsWithUserType(userEmail: string, userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userEmail", userEmail.toString())
      .set("userType", userType.toString());

    return this.http.get<boolean>(this.CheckEmailExistsWithUserTypeUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('CheckEmailExistsWithUserType', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }


  // Getting the role details
  GetRoleByUserType(userType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userType", userType.toString());

    return this.http.get<string>(this.GetRoleByUserTypeUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetRoleByUserType', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  //----------- Common methods------------------//
  //The function of handling the error
  private handleError(methodName: string, exception: any) {
    // Creating the error message object 
    let errorMessage: ErrorMessage = {
      Name: exception.name,
      Message: exception.message,
      StatusText: exception['statusText'],
      Url: exception['url'].toString()
    };
    // Redirect to the error message
    this.router.navigate(['errorMessage'], { state: { response: errorMessage } });
  }
}
