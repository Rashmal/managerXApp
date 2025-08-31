import { Subscription } from "rxjs";
import { ContractorService } from "../services/contractor.service";
import { ClientAddress } from "../../login_registration/core/clientAddress";
import { Filter } from "../../main_containers/core/filter";
import { AssignTaskDetails } from "../core/assignTaskDetails";
import { StatusDetails } from "../core/statusDetails";
import { AssignedTaskMoreDetails } from "../core/assignedTaskMoreDetails";
import { SubTaskNote } from "../../admin/core/subTaskNote";
import { SubTaskDetails } from "../../admin/core/subTaskDetails";

export class ContractorModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private contractorService: ContractorService) {

    }

    // Unsubscribe all
    UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // Getting the all the client address details
    GetAllClientAddress(contractorId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.GetAllClientAddress(contractorId).subscribe(
                data => {
                    let returnData = <ClientAddress[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the all the assigned task details
    GetAllAssignedTasks(filter: Filter, projectId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.GetAllAssignedTasks(filter, projectId, personId).subscribe(
                data => {
                    let returnData = <AssignTaskDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the status details
    GetStatusDetails() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.GetStatusDetails().subscribe(
                data => {
                    let returnData = <StatusDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the task status
    UpdateTaskStatus(taskId: number, statusId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateTaskStatus(taskId, statusId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the assigned task more details section
    GetAssignedTaskMoreDetails(taskId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.GetAssignedTaskMoreDetails(taskId).subscribe(
                data => {
                    let returnData = <AssignedTaskMoreDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the task due date
    UpdateTaskDueDate(taskId: number, dueDate: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateTaskDueDate(taskId, dueDate, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the task start date
    UpdateTaskStartDate(taskId: number, dueDate: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateTaskStartDate(taskId, dueDate, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the task description
    UpdateTaskDescription(taskId: number, taskDescription: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateTaskDescription(taskId, taskDescription, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the sub task status
    UpdateSubTaskStatus(subTaskId: number, statusId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateSubTaskStatus(subTaskId, statusId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Inserting a new note
    InsertNewNote(subTaskNote: SubTaskNote, subTaskId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.InsertNewNote(subTaskNote, subTaskId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Removing a new note
    RemoveNote(noteId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.RemoveNote(noteId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Uploading the task attachment files
    UploadStageAttachments(file: FormData, taskId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UploadStageAttachments(file, taskId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Remove Attachment file
    RemoveTaskAttachments(attachmentId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.RemoveTaskAttachments(attachmentId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the tasks based on the date
    GetAllTasksBasedDate(dateTime: string, projectId: number, personId: number, searchQuery: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.GetAllTasksBasedDate(dateTime, projectId, personId, searchQuery).subscribe(
                data => {
                    let returnData = <AssignedTaskMoreDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Inserting a new sub task
    InsertNewSubtask(subTaskDetails: SubTaskDetails, taskId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.InsertNewSubtask(subTaskDetails, taskId, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Updating the task name
    UpdateTaskName(taskId: number, taskName: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.contractorService.UpdateTaskName(taskId, taskName, personId).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

}