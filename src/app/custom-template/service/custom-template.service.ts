import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../login_registration/core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigValues } from '../core/configValues';
import { ErrorMessage } from '../../login_registration/core/errorMessage';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTemplateService {
  // API Urls
  private GetConfigValuesUrl = API$DOMAIN + 'api/CustomTemplate/GetConfigValues';
  private SetConfigValuesUrl = API$DOMAIN + 'api/CustomTemplate/SetConfigValues';

  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }

  // Setting the login page button styles
  SetConfigValues(configValuesList: ConfigValues[]) {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.post<boolean>(this.SetConfigValuesUrl, configValuesList, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetConfigValues', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the config values
  GetConfigValues(styleType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("styleType", styleType.toString());

    return this.http.get<ConfigValues[]>(this.GetConfigValuesUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetConfigValues', error)
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
