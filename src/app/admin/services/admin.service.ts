import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../login_registration/core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ErrorMessage } from '../../login_registration/core/errorMessage';
import { ClientAddress } from '../../login_registration/core/clientAddress';
import { ProjectDetails } from '../core/projectDetails';
import { StageDetails } from '../core/stageDetails';
import { Filter } from '../../main_containers/core/filter';
import { SubStageCategoryDetails } from '../core/subStageCategoryDetails';
import { SubStageDetails } from '../core/subStageDetails';
import { TaskDetails } from '../core/taskDetails';
import { SubTaskDetails } from '../core/subTaskDetails';
import { SubTaskNote } from '../core/subTaskNote';
import { AttachmentDetails } from '../core/attachmentDetails';
import { ContractStage } from '../core/contractStage';
import { UserDetails } from '../core/userDetails';
import { UserBasicDetails } from '../core/userBasicDetails';
import { CalendarTaskDetails } from '../core/calendarTaskDetails';
import { DatePipe } from '@angular/common';
import { NotificationDetails } from '../core/notificationDetails';
import { RoleManagement } from '../core/roleManagement';
import { ClientDetails } from '../../project_manager/core/clientDetails';
import { UserTypeName } from '../core/userTypeName';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // API Urls
  private GetAllClientAddressUrl = API$DOMAIN + 'api/Admin/GetAllClientAddress';
  private GetBasicProjectDetailsUrl = API$DOMAIN + 'api/Admin/GetBasicProjectDetails';
  private GetStageListBasedOnLazyLoadingUrl = API$DOMAIN + 'api/Admin/GetStageListBasedOnLazyLoading';
  private GetCurrentStageDetailsUrl = API$DOMAIN + 'api/Admin/GetCurrentStageDetails';
  private GetAllStageListUrl = API$DOMAIN + 'api/Admin/GetAllStageList';
  private GetAllSubStageListUrl = API$DOMAIN + 'api/Admin/GetAllSubStageList';
  private GetAllSubStageCategoryListUrl = API$DOMAIN + 'api/Admin/GetAllSubStageCategoryList';
  private GetAllTaskListUrl = API$DOMAIN + 'api/Admin/GetAllTaskList';
  private GeTaskDetailsUrl = API$DOMAIN + 'api/Admin/GeTaskDetails';
  private GetSubTaskDetailsUrl = API$DOMAIN + 'api/Admin/GetSubTaskDetails';
  private GetSubTaskNoteDetailsUrl = API$DOMAIN + 'api/Admin/GetSubTaskNoteDetails';
  private GetTaskAttachmentsWithPaginationUrl = API$DOMAIN + 'api/Admin/GetTaskAttachmentsWithPagination';
  private GetAllContractStagesUrl = API$DOMAIN + 'api/Admin/GetAllContractStages';
  private GetAllContractStageAttachmentsUrl = API$DOMAIN + 'api/Admin/GetAllContractStageAttachments';
  private UploadStageAttachmentsUrl = API$DOMAIN + 'api/Admin/UploadStageAttachments';
  private RemoveStageAttachmentsUrl = API$DOMAIN + 'api/Admin/RemoveStageAttachments';
  private GetAllContactsUrl = API$DOMAIN + 'api/Admin/GetAllContacts';
  private GetAllBasicUserDetailsUrl = API$DOMAIN + 'api/Admin/GetAllBasicUserDetails';
  private SetAllBasicUserDetailsUrl = API$DOMAIN + 'api/Admin/SetAllBasicUserDetails';
  private GetAllTasksBasedDateUrl = API$DOMAIN + 'api/Admin/GetAllTasksBasedDate';
  private GetAllNotificationsUrl = API$DOMAIN + 'api/Admin/GetAllNotifications';
  private GetFileBlobDataUrl = API$DOMAIN + 'api/Common/GetFileBlobData';
  private GetAllRoleManagementUrl = API$DOMAIN + 'api/Admin/GetAllRoleManagement';
  private SetRoleManagementUrl = API$DOMAIN + 'api/Admin/SetRoleManagement';
  private GetAllProjectManagersUrl = API$DOMAIN + 'api/Admin/GetAllProjectManagers';
  private GetAllContractorsUrl = API$DOMAIN + 'api/Admin/GetAllContractors';
  private GetAllProjectManagersWithPaginationUrl = API$DOMAIN + 'api/Admin/GetAllProjectManagersWithPagination';
  private SetProjectManagerAccessLevelUrl = API$DOMAIN + 'api/Admin/SetProjectManagerAccessLevel';
  private SetContractorAccessLevelUrl = API$DOMAIN + 'api/Admin/SetContractorAccessLevel';
  private GetAllClientsUrl = API$DOMAIN + 'api/Admin/GetAllClients';
  private GetAllSupplierContactsUrl = API$DOMAIN + 'api/Admin/GetAllSupplierContacts';
  private GetAllUserTypesUrl = API$DOMAIN + 'api/Admin/GetAllUserTypes';
  private SetAdminUserTypeUrl = API$DOMAIN + 'api/Admin/SetAdminUserType';
  private SetRoleNameManagementUrl = API$DOMAIN + 'api/Admin/SetRoleNameManagement';
  private GetAllRoleManagementBasedUTUrl = API$DOMAIN + 'api/Admin/GetAllRoleManagementBasedUT';
  private SetSubTaskDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetSubTaskDetails';
  private SetNoteTaskDetailsUrl = API$DOMAIN + 'api/ProjectManager/SetNoteTaskDetails';
  private GetAllPersonsUrl = API$DOMAIN + 'api/Admin/GetAllPersons';
  private SetDisablePersonUrl = API$DOMAIN + 'api/Admin/SetDisablePerson';

  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }

  // Disabled the person
  SetDisablePerson(userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString());

    return this.http.get<boolean>(this.SetDisablePersonUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetDisablePerson', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // GetAllPersons
  GetAllPersons(filter: Filter) {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.post<UserDetails[]>(this.GetAllPersonsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllPersons', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Set note details
  SetNoteTaskDetails(subTaskNote: SubTaskNote, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetNoteTaskDetailsUrl, subTaskNote, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetNoteTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Set sub task details
  SetSubTaskDetails(subTaskDetails: SubTaskDetails, taskId: number, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetSubTaskDetailsUrl, subTaskDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetSubTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the role management
  GetAllRoleManagementBasedUT(filter: Filter, userTypeId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userTypeId", userTypeId.toString());

    return this.http.post<RoleManagement[]>(this.GetAllRoleManagementBasedUTUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllRoleManagementBasedUT', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the role name management
  SetRoleNameManagement(roleManagement: RoleManagement, actionType: string, userTypeId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString())
      .set("userTypeId", userTypeId.toString());

    return this.http.post<boolean>(this.SetRoleNameManagementUrl, roleManagement, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetRoleNameManagement', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the user types
  SetAdminUserType(userTypeName: UserTypeName, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetAdminUserTypeUrl, userTypeName, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetAdminUserType', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the user types
  GetAllUserTypes() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<UserTypeName[]>(this.GetAllUserTypesUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllUserTypes', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the client details
  GetAllClients(filter: Filter) {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.post<ClientDetails[]>(this.GetAllClientsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllClients', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Update Contractor Access Levels
  SetContractorAccessLevel(parentId: number, contractorId: number, isTicked: boolean) {
    // Setting the params
    let my_params = new HttpParams()
      .set("parentId", parentId.toString())
      .set("contractorId", contractorId.toString())
      .set("isTicked", isTicked.toString());

    return this.http.get<boolean>(this.SetContractorAccessLevelUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetContractorAccessLevel', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Update Project Manager Access Levels
  SetProjectManagerAccessLevel(parentId: number, childId: number, isTicked: boolean) {
    // Setting the params
    let my_params = new HttpParams()
      .set("parentId", parentId.toString())
      .set("childId", childId.toString())
      .set("isTicked", isTicked.toString());

    return this.http.get<boolean>(this.SetProjectManagerAccessLevelUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetProjectManagerAccessLevel', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the project managers
  GetAllProjectManagersWithPagination(filter: Filter, currentProjectManagerId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("currentProjectManagerId", currentProjectManagerId.toString());

    return this.http.post<UserBasicDetails[]>(this.GetAllProjectManagersWithPaginationUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllProjectManagersWithPagination', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the project managers
  GetAllContractors(filter: Filter, currentProjectManagerId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("currentProjectManagerId", currentProjectManagerId.toString());

    return this.http.post<UserBasicDetails[]>(this.GetAllContractorsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContractors', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the project managers
  GetAllProjectManagers(currentProjectManagerId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("currentProjectManagerId", currentProjectManagerId.toString());

    return this.http.get<UserBasicDetails[]>(this.GetAllProjectManagersUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllProjectManagers', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the role management
  SetRoleManagement(roleManagement: RoleManagement, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetRoleManagementUrl, roleManagement, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetRoleManagement', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the role management
  GetAllRoleManagement() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<RoleManagement[]>(this.GetAllRoleManagementUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllRoleManagement', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Downloading the file
  DownloadFile(url: string, fileName: string): Observable<Blob> {
    // Setting the params
    let my_params = new HttpParams()
      .set("fileUrl", url.toString())
      .set("fileName", fileName.toString());

    return this.http.get(this.GetFileBlobDataUrl + "?fileUrl=" + url.toString() + "&" + "fileName=" + fileName.toString(), { responseType: 'blob' });
  }

  // Getting all the notifications
  GetAllNotifications(filter: Filter, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString());

    return this.http.post<NotificationDetails[]>(this.GetAllNotificationsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllNotifications', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the tasks based on the date
  GetAllTasksBasedDate(dateTime: string, projectId: number, searchQuery: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString())
      .set("dateTime", dateTime.toString())
      .set("searchQuery", searchQuery.toString());

    return this.http.get<CalendarTaskDetails[]>(this.GetAllTasksBasedDateUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllTasksBasedDate', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting all the basic user details
  SetAllBasicUserDetails(userBasicDetails: UserBasicDetails) {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.post<boolean>(this.SetAllBasicUserDetailsUrl, userBasicDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetAllBasicUserDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the basic user details
  GetAllBasicUserDetails(userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("userId", userId.toString());

    return this.http.get<UserBasicDetails>(this.GetAllBasicUserDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContacts', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the contacts
  GetAllContacts(filter: Filter, SelectedClientId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("SelectedClientId", SelectedClientId.toString());

    return this.http.post<UserDetails[]>(this.GetAllContactsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContacts', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the suppliers
  GetAllSupplierContacts(filter: Filter, SelectedClientId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("SelectedClientId", SelectedClientId.toString());

    return this.http.post<UserDetails[]>(this.GetAllSupplierContactsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllSupplierContacts', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Removing the file attachment
  RemoveStageAttachments(fileId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("fileId", fileId.toString());

    return this.http.get<boolean>(this.RemoveStageAttachmentsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RemoveStageAttachments', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Uploading the stage attachment files
  UploadStageAttachments(file: FormData, stageId: number, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("StageId", stageId.toString())
      .set("projectId", projectId.toString());

    return this.http.post<boolean>(this.UploadStageAttachmentsUrl, file, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UploadStageAttachments', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the contract stage attachments
  GetAllContractStageAttachments(filter: Filter, contractStageId: number, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("contractStageId", contractStageId.toString())
      .set("projectId", projectId.toString());

    return this.http.post<AttachmentDetails[]>(this.GetAllContractStageAttachmentsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContractStageAttachments', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting all the contract stages
  GetAllContractStages(projectId: number, searchQuery: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString())
      .set("searchQuery", searchQuery.toString());

    return this.http.get<ContractStage[]>(this.GetAllContractStagesUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllContractStages', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the attachments for the task
  GetTaskAttachmentsWithPagination(taskId: number, filter: Filter) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.post<AttachmentDetails[]>(this.GetTaskAttachmentsWithPaginationUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetTaskAttachmentsWithPagination', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the task note details
  GetSubTaskNoteDetails(taskId: number, filter: Filter) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.post<SubTaskNote[]>(this.GetSubTaskNoteDetailsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetSubTaskNoteDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the task detailsGetting the sub task details
  GetSubTaskDetails(taskId: number, filter: Filter) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.post<SubTaskDetails[]>(this.GetSubTaskDetailsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetSubTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the task details
  GeTaskDetails(taskId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.get<TaskDetails>(this.GeTaskDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GeTaskDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the All the task list
  GetAllTaskList(filter: Filter, subStageCategoryId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subStageCategoryId", subStageCategoryId.toString());

    return this.http.post<TaskDetails[]>(this.GetAllTaskListUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllTaskList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the All the sub Stage categories list
  GetAllSubStageCategoryList(filter: Filter, subStageId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subStageId", subStageId.toString());

    return this.http.post<SubStageCategoryDetails[]>(this.GetAllSubStageCategoryListUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllSubStageCategoryList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the All the sub Stages list
  GetAllSubStageList(filter: Filter, stageId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("stageId", stageId.toString());

    return this.http.post<SubStageDetails[]>(this.GetAllSubStageListUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllSubStageList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the All the Stages list
  GetAllStageList(projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString());

    return this.http.get<StageDetails[]>(this.GetAllStageListUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllStageList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the current stage sub stage category list 
  GetCurrentStageDetails(filter: Filter, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString());

    return this.http.post<SubStageCategoryDetails>(this.GetCurrentStageDetailsUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetCurrentStageDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the Stages list based on lazy loading
  GetStageListBasedOnLazyLoading(firstIndex: number, lastIndex: number, projectId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("firstIndex", firstIndex.toString())
      .set("lastIndex", lastIndex.toString())
      .set("projectId", projectId.toString());

    return this.http.get<StageDetails[]>(this.GetStageListBasedOnLazyLoadingUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetStageListBasedOnLazyLoading', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the basic project details
  GetBasicProjectDetails(clientId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("clientId", clientId.toString());

    return this.http.get<ProjectDetails>(this.GetBasicProjectDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetBasicProjectDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the all the client address details
  GetAllClientAddress() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<ClientAddress[]>(this.GetAllClientAddressUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllClientAddress', error)
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
