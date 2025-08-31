import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../login_registration/core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ClientAddress } from '../../login_registration/core/clientAddress';
import { ErrorMessage } from '../../login_registration/core/errorMessage';
import { Filter } from '../../main_containers/core/filter';
import { AssignTaskDetails } from '../core/assignTaskDetails';
import { StatusDetails } from '../core/statusDetails';
import { AssignedTaskMoreDetails } from '../core/assignedTaskMoreDetails';
import { SubTaskNote } from '../../admin/core/subTaskNote';
import { SubTaskDetails } from '../../admin/core/subTaskDetails';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  // API Urls
  private GetAllClientAddressUrl = API$DOMAIN + 'api/Contractor/GetAllClientAddress';
  private GetAllAssignedTasksUrl = API$DOMAIN + 'api/Contractor/GetAllAssignedTasks';
  private GetStatusDetailsUrl = API$DOMAIN + 'api/Common/GetStatusDetails';
  private UpdateTaskStatusUrl = API$DOMAIN + 'api/Contractor/UpdateTaskStatus';
  private GetAssignedTaskMoreDetailsUrl = API$DOMAIN + 'api/Contractor/GetAssignedTaskMoreDetails';
  private UpdateTaskDueDateUrl = API$DOMAIN + 'api/Contractor/UpdateTaskDueDate';
  private UpdateTaskStartDateUrl = API$DOMAIN + 'api/Contractor/UpdateTaskStartDate';
  private UpdateTaskDescriptionUrl = API$DOMAIN + 'api/Contractor/UpdateTaskDescription';
  private UpdateTaskNameUrl = API$DOMAIN + 'api/Contractor/UpdateTaskName';
  private UpdateSubTaskStatusUrl = API$DOMAIN + 'api/Contractor/UpdateSubTaskStatus';
  private InsertNewNoteUrl = API$DOMAIN + 'api/Contractor/InsertNewNote';
  private RemoveNoteUrl = API$DOMAIN + 'api/Contractor/RemoveNote';
  private UploadTaskAttachmentsUrl = API$DOMAIN + 'api/Contractor/UploadTaskAttachments';
  private RemoveTaskAttachmentsUrl = API$DOMAIN + 'api/Contractor/RemoveTaskAttachments';
  private GetAllTasksBasedDateUrl = API$DOMAIN + 'api/Contractor/GetAllTasksBasedDate';
  private InsertNewSubtaskUrl = API$DOMAIN + 'api/Contractor/InsertNewSubtask';
  private SetSubtaskUrl = API$DOMAIN + 'api/Contractor/SetSubtask';


  
  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }

  // Updating the task name
  UpdateTaskName(taskId: number, taskName: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("taskName", taskName.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateTaskNameUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateTaskName', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Inserting a new sub task
  InsertNewSubtask(subTaskDetails: SubTaskDetails, taskId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("personId", personId.toString());

    return this.http.post<boolean>(this.InsertNewSubtaskUrl, subTaskDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('InsertNewSubtask', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

   // Update a new sub task
   SetSubtask(subTaskDetails: SubTaskDetails, taskId: number, personId: number, actionType : string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("personId", personId.toString())
      .set("actionType", actionType);

    return this.http.post<boolean>(this.SetSubtaskUrl, subTaskDetails, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('InsertNewSubtask', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }




  // Getting the tasks based on the date
  GetAllTasksBasedDate(dateTime: string, projectId: number, personId: number, searchQuery: string) {
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

  // Remove Attachment file
  RemoveTaskAttachments(attachmentId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("attachmentId", attachmentId.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.RemoveTaskAttachmentsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RemoveTaskAttachments', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Uploading the task attachment files
  UploadStageAttachments(file: FormData, taskId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("personId", personId.toString());

    return this.http.post<boolean>(this.UploadTaskAttachmentsUrl, file, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UploadStageAttachments', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Removing a new note
  RemoveNote(noteId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("noteId", noteId.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.RemoveNoteUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('RemoveNote', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Inserting a new note
  InsertNewNote(subTaskNote: SubTaskNote, subTaskId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subTaskId", subTaskId.toString())
      .set("personId", personId.toString());

    return this.http.post<boolean>(this.InsertNewNoteUrl, subTaskNote, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('InsertNewNote', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Updating the sub task status
  UpdateSubTaskStatus(subTaskId: number, statusId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("subTaskId", subTaskId.toString())
      .set("statusId", statusId.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateSubTaskStatusUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateSubTaskStatus', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Updating the task description
  UpdateTaskDescription(taskId: number, taskDescription: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("taskDescription", taskDescription.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateTaskDescriptionUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateTaskDescription', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Updating the task due date
  UpdateTaskDueDate(taskId: number, dueDate: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("dueDate", dueDate.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateTaskDueDateUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateTaskDueDate', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Updating the task start date
  UpdateTaskStartDate(taskId: number, dueDate: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("dueDate", dueDate.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateTaskStartDateUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateTaskStartDate', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the assigned task more details section
  GetAssignedTaskMoreDetails(taskId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString());

    return this.http.get<AssignedTaskMoreDetails>(this.GetAssignedTaskMoreDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAssignedTaskMoreDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Updating the task status
  UpdateTaskStatus(taskId: number, statusId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("taskId", taskId.toString())
      .set("statusId", statusId.toString())
      .set("personId", personId.toString());

    return this.http.get<boolean>(this.UpdateTaskStatusUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('UpdateTaskStatus', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the status details
  GetStatusDetails() {
    // Setting the params
    let my_params = new HttpParams();

    return this.http.get<StatusDetails[]>(this.GetStatusDetailsUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetStatusDetails', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the all the assigned task details
  GetAllAssignedTasks(filter: Filter, projectId: number, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("projectId", projectId.toString())
      .set("personId", personId.toString());

    return this.http.post<AssignTaskDetails[]>(this.GetAllAssignedTasksUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllAssignedTasks', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the all the client address details
  GetAllClientAddress(contractorId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("contractorId", contractorId.toString());

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
