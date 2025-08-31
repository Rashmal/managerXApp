import { Subscription } from "rxjs";
import { ProjectManagerService } from "../services/project-manager.service";
import { Filter } from "../../main_containers/core/filter";
import { AssignedTaskMoreDetails } from "../../contractor/core/assignedTaskMoreDetails";
import { ClientDetails } from "../core/clientDetails";
import { UserDetails } from "../../admin/core/userDetails";
import { TaskDetails } from "../../admin/core/taskDetails";
import { StageDetails } from "../../admin/core/stageDetails";
import { SubStageDetails } from "../../admin/core/subStageDetails";
import { SubStageCategoryDetails } from "../../admin/core/subStageCategoryDetails";
import { UserBasicDetails } from "../../admin/core/userBasicDetails";

export class ProjectManagerModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private projectManagerService: ProjectManagerService) {

    }

    // Unsubscribe all
    UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }


    // Getting the tasks based on the date
    GetAllTasksBasedDate(filter: Filter, projectId: number, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllTasksBasedDate(filter, projectId, personId).subscribe(
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

    // Getting the tasks based on the date
    GetAllTasksBasedDateForCalendar(dateTime: string, projectId: number, personId: number, searchQuery: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllTasksBasedDateForCalendar(dateTime, projectId, personId, searchQuery).subscribe(
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

    // Getting all the client details for the project manager
    GetClientForPM(filter: Filter, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetClientForPM(filter, personId).subscribe(
                data => {
                    let returnData = <ClientDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the client details
    SetClientDetails(userDetails: UserDetails, projectManagerId: number, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetClientDetails(userDetails, projectManagerId, actionType).subscribe(
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

    // Getting the client details
    GetClientDetails(userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetClientDetails(userId).subscribe(
                data => {
                    let returnData = <UserDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the contact details
    SetContactDetails(userDetails: UserDetails, projectManagerId: number, actionType: string, selectedPersonClientId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetContactDetails(userDetails, projectManagerId, actionType, selectedPersonClientId).subscribe(
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

    // Getting the client details
    GetContactDetails(userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetContactDetails(userId).subscribe(
                data => {
                    let returnData = <UserDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the task details
    SetTaskDetails(taskDetails: TaskDetails, personId: number, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetTaskDetails(taskDetails, personId, actionType).subscribe(
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

    // Setting all the stage details
    SetAllStageDetails(projectDetailsId: number, stageName: string, stageType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetAllStageDetails(projectDetailsId, stageName, stageType).subscribe(
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

    // Getting all the sub stage category details
    GetAllSubStageCategoryDetails(subStageId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllSubStageCategoryDetails(subStageId).subscribe(
                data => {
                    let returnData = <SubStageCategoryDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the sub stage details
    GetAllSubStageDetails(stageId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllSubStageDetails(stageId).subscribe(
                data => {
                    let returnData = <SubStageDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the stage details
    GetAllStageDetails(projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllStageDetails(projectId).subscribe(
                data => {
                    let returnData = <StageDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Remove stage details
    RemoveStageDetails(stageId: number, stageType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.RemoveStageDetails(stageId, stageType).subscribe(
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

    // Getting all the contacts for import
    GetAllContactsForImport(filter: Filter, userType: string, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetAllContactsForImport(filter, userType, projectId).subscribe(
                data => {
                    let returnData = <UserBasicDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Set contact to project details
    SetContactToProjectDetails(projectId: number, userId: number, actionType: string, CreatorId :number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetContactToProjectDetails(projectId, userId, actionType,CreatorId).subscribe(
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

    // Set contact to task details
    SetContactToTaskDetails(taskId: number, userId: number, actionType: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetContactToTaskDetails(taskId, userId, actionType, personId).subscribe(
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

    // Set contact to task category ID
    SetTaskCategoryId(taskId: number, categoryId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.SetTaskCategoryId(taskId, categoryId).subscribe(
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

    // Get task details based on ID
    GetTaskDetailsBasedId(taskId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.projectManagerService.GetTaskDetailsBasedId(taskId).subscribe(
                data => {
                    let returnData = <TaskDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }
}