import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../login_registration/core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Filter } from '../../main_containers/core/filter';
import { AssignedTaskMoreDetails } from '../../contractor/core/assignedTaskMoreDetails';
import { catchError, of } from 'rxjs';
import { ErrorMessage } from '../../login_registration/core/errorMessage';
import { ClientDetails } from '../core/clientDetails';
import { UserDetails } from '../../admin/core/userDetails';
import { TaskDetails } from '../../admin/core/taskDetails';
import { SubStageCategoryDetails } from '../../admin/core/subStageCategoryDetails';
import { SubStageDetails } from '../../admin/core/subStageDetails';
import { StageDetails } from '../../admin/core/stageDetails';
import { UserBasicDetails } from '../../admin/core/userBasicDetails';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  // API Urls
  private GetAllAssignedTasksUrl = API$DOMAIN + 'api/ProjectManager/GetAllAssignedTasks';
  private GetAllTasksBasedDateUrl = API$DOMAIN + 'api/ProjectManager/GetAllTasksBasedDate';
  private GetClientForPMUrl = API$DOMAIN + 'api/ProjectManager/GetClientForPM';
  private SetClientDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetClientDetails';
  private GetClientDetailsUrl = API$DOMAIN + 'api/ProjectManager/GetClientDetails';
  private SetContactDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetContactDetails';
  private GetContactDetailsUrl = API$DOMAIN + 'api/ProjectManager/GetContactDetails';
  private GetAllStageDetailsUrl = API$DOMAIN + 'api/Common/GetAllStageDetails';
  private GetAllSubStageDetailsUrl = API$DOMAIN + 'api/Common/GetAllSubStageDetails';
  private GetAllSubStageCategoryDetailsUrl = API$DOMAIN + 'api/Common/GetAllSubStageCategoryDetails';
  private SetAllStageDetailsUrl = API$DOMAIN + 'api/Common/SetAllStageDetails';
  private SetTaskDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetTaskDetails';
  private RemoveStageDetailsUrl = API$DOMAIN + 'api/Common/RemoveStageDetails';
  private GetAllContactsForImportUrl = API$DOMAIN + 'api/ProjectManager/GetAllContactsForImport';
  private SetContactToProjectDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetContactToProjectDetails';
  private SetContactToTaskDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetContactToTaskDetails';
  private GetTaskDetailsBasedIdUrl = API$DOMAIN + 'api/ProjectManager/GetTaskDetailsBasedId';
  private SetTaskCategoryIdUrl = API$DOMAIN + 'api/ProjectManager/SetTaskCategoryId';

  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }

  // Set contact to task category ID
  SetTaskCategoryId(taskId: number, categoryId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("categoryId", categoryId.toString())
      .set("taskId", taskId.toString());

    return this.http.get<boolean>(this.SetTaskCategoryIdUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetTaskCategoryId', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Set contact to task details
  SetContactToTaskDetails(taskId: number, userId: number, actionType: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString())
      .set("taskId", taskId.toString())
      .set("actionType", actionType.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.SetContactToTaskDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetContactToTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Get task details based on ID
  GetTaskDetailsBasedId(taskId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.get<TaskDetails>(this.GetTaskDetailsBasedIdUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetTaskDetailsBasedId', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Set contact to project details
  SetContactToProjectDetails(projectId: number, userId: number, actionType: string, CreatorId :number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString())
      .set("projectId", projectId.toString())
      .set("actionType", actionType.toString())
      .set("CreatorId", CreatorId.toString());

    return this.http.get<boolean>(this.SetContactToProjectDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetContactToProjectDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the contacts for import
  GetAllContactsForImport(filter: Filter, userType: string, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userType", userType.toString())
      .set("projectId", projectId.toString());

    return this.http.post<UserBasicDetails[]>(this.GetAllContactsForImportUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContactsForImport', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Remove stage details
  RemoveStageDetails(stageId: number, stageType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("stageId", stageId.toString())
      .set("stageType", stageType.toString());

    return this.http.get<boolean>(this.RemoveStageDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RemoveStageDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the stage details
  GetAllStageDetails(projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString());

    return this.http.get<StageDetails[]>(this.GetAllStageDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllStageDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the sub stage details
  GetAllSubStageDetails(stageId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("stageId", stageId.toString());

    return this.http.get<SubStageDetails[]>(this.GetAllSubStageDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllSubStageDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the sub stage category details
  GetAllSubStageCategoryDetails(subStageId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subStageId", subStageId.toString());

    return this.http.get<SubStageCategoryDetails[]>(this.GetAllSubStageCategoryDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllSubStageCategoryDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting all the stage details
  SetAllStageDetails(projectDetailsId: number, stageName: string, stageType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectDetailsId", projectDetailsId.toString())
      .set("stageName", stageName.toString())
      .set("stageType", stageType.toString());

    return this.http.get<boolean>(this.SetAllStageDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetAllStageDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the task details
  SetTaskDetails(taskDetails: TaskDetails, personId: number, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("personId", personId.toString())
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetTaskDetailsUrl, taskDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the client details
  GetContactDetails(userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString());

    return this.http.get<UserDetails>(this.GetContactDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetClientDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the contact details
  SetContactDetails(userDetails: UserDetails, projectManagerId: number, actionType: string, selectedPersonClientId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectManagerId", projectManagerId.toString())
      .set("actionType", actionType.toString())
      .set("selectedPersonClientId", selectedPersonClientId.toString());

    return this.http.post<boolean>(this.SetContactDetailsUrl, userDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetClientDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the client details
  GetClientDetails(userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString());

    return this.http.get<UserDetails>(this.GetClientDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetClientDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the client details
  SetClientDetails(userDetails: UserDetails, projectManagerId: number, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectManagerId", projectManagerId.toString())
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetClientDetailsUrl, userDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetClientDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the client details for the project manager
  GetClientForPM(filter: Filter, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("personId", personId.toString());

    return this.http.post<ClientDetails[]>(this.GetClientForPMUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetClientForPM', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the tasks based on the date
  GetAllTasksBasedDateForCalendar(dateTime: string, projectId: number, personId: number, searchQuery: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("dateTime", dateTime.toString())
      .set("projectId", projectId.toString())
      .set("personId", personId.toString())
      .set("searchQuery", searchQuery.toString());

    return this.http.get<AssignedTaskMoreDetails[]>(this.GetAllTasksBasedDateUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllTasksBasedDate', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the tasks based on the date
  GetAllTasksBasedDate(filter: Filter, projectId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString())
      .set("personId", personId.toString());

    return this.http.post<AssignedTaskMoreDetails[]>(this.GetAllAssignedTasksUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllTasksBasedDate', error)
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
