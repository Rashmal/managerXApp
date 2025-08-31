import { Subscription } from "rxjs";
import { AdminService } from "../services/admin.service";
import { ClientAddress } from "../../login_registration/core/clientAddress";
import { ProjectDetails } from "../core/projectDetails";
import { StageDetails } from "../core/stageDetails";
import { Filter } from "../../main_containers/core/filter";
import { SubStageCategoryDetails } from "../core/subStageCategoryDetails";
import { SubStageDetails } from "../core/subStageDetails";
import { TaskDetails } from "../core/taskDetails";
import { SubTaskDetails } from "../core/subTaskDetails";
import { SubTaskNote } from "../core/subTaskNote";
import { AttachmentDetails } from "../core/attachmentDetails";
import { ContractStage } from "../core/contractStage";
import { UserDetails } from "../core/userDetails";
import { UserBasicDetails } from "../core/userBasicDetails";
import { CalendarTaskDetails } from "../core/calendarTaskDetails";
import { NotificationDetails } from "../core/notificationDetails";
import { RoleManagement } from "../core/roleManagement";
import { ClientDetails } from "../../project_manager/core/clientDetails";
import { UserTypeName } from "../core/userTypeName";

export class AdminModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private adminService: AdminService) {

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
    GetAllClientAddress() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllClientAddress().subscribe(
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

    // Getting the basic project details
    GetBasicProjectDetails(clientId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetBasicProjectDetails(clientId).subscribe(
                data => {
                    let returnData = <ProjectDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the Stages list based on lazy loading
    GetStageListBasedOnLazyLoading(firstIndex: number, lastIndex: number, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetStageListBasedOnLazyLoading(firstIndex, lastIndex, projectId).subscribe(
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

    // Getting the current stage sub stage category list 
    GetCurrentStageDetails(filter: Filter, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetCurrentStageDetails(filter, projectId).subscribe(
                data => {
                    let returnData = <SubStageCategoryDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the All the Stages list
    GetAllStageList(projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllStageList(projectId).subscribe(
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

    // Getting the All the sub Stages list
    GetAllSubStageList(filter: Filter, stageId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllSubStageList(filter, stageId).subscribe(
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

    // Getting the All the sub Stage categories list
    GetAllSubStageCategoryList(filter: Filter, subStageId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllSubStageCategoryList(filter, subStageId).subscribe(
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

    // Getting the All the task list
    GetAllTaskList(filter: Filter, subStageCategoryId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllTaskList(filter, subStageCategoryId).subscribe(
                data => {
                    let returnData = <TaskDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the task details
    GeTaskDetails(taskId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GeTaskDetails(taskId).subscribe(
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

    // Getting the task detailsGetting the sub task details
    GetSubTaskDetails(taskId: number, filter: Filter) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetSubTaskDetails(taskId, filter).subscribe(
                data => {
                    let returnData = <SubTaskDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the task note details
    GetSubTaskNoteDetails(taskId: number, filter: Filter) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetSubTaskNoteDetails(taskId, filter).subscribe(
                data => {
                    let returnData = <SubTaskNote[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the attachments for the task
    GetTaskAttachmentsWithPagination(taskId: number, filter: Filter) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetTaskAttachmentsWithPagination(taskId, filter).subscribe(
                data => {
                    let returnData = <AttachmentDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the contract stages
    GetAllContractStages(projectId: number, searchQuery: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllContractStages(projectId, searchQuery).subscribe(
                data => {
                    let returnData = <ContractStage[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the contract stage attachments
    GetAllContractStageAttachments(filter: Filter, contractStageId: number, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllContractStageAttachments(filter, contractStageId, projectId).subscribe(
                data => {
                    let returnData = <AttachmentDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Uploading the stage attachment files
    UploadStageAttachments(file: FormData, stageId: number, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.UploadStageAttachments(file, stageId, projectId).subscribe(
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

    // Removing the file attachment
    RemoveStageAttachments(fileId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.RemoveStageAttachments(fileId).subscribe(
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

    // Getting all the suppliers
    GetAllSupplierContacts(filter: Filter, SelectedClientId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllSupplierContacts(filter, SelectedClientId).subscribe(
                data => {
                    let returnData = <UserDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the contacts
    GetAllContacts(filter: Filter, SelectedClientId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllContacts(filter, SelectedClientId).subscribe(
                data => {
                    let returnData = <UserDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }


    // Getting all the basic user details
    GetAllBasicUserDetails(userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllBasicUserDetails(userId).subscribe(
                data => {
                    let returnData = <UserBasicDetails>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting all the basic user details
    SetAllBasicUserDetails(userBasicDetails: UserBasicDetails) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetAllBasicUserDetails(userBasicDetails).subscribe(
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
    GetAllTasksBasedDate(dateTime: string, projectId: number, searchQuery: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllTasksBasedDate(dateTime, projectId, searchQuery).subscribe(
                data => {
                    let returnData = <CalendarTaskDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the notifications
    GetAllNotifications(filter: Filter, projectId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllNotifications(filter, projectId).subscribe(
                data => {
                    let returnData = <NotificationDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Downloading the file
    DownloadFile(fileUrl: string, fileName: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.DownloadFile(fileUrl, fileName).subscribe(
                data => {
                    let returnData = <Blob>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting all the role management
    GetAllRoleManagement() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllRoleManagement().subscribe(
                data => {
                    let returnData = <RoleManagement[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the role management
    SetRoleManagement(roleManagement: RoleManagement, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetRoleManagement(roleManagement, actionType).subscribe(
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

    // Getting all the project managers
    GetAllProjectManagers(currentProjectManagerId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllProjectManagers(currentProjectManagerId).subscribe(
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

    // Getting all the project managers
    GetAllContractors(filter: Filter, currentProjectManagerId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllContractors(filter, currentProjectManagerId).subscribe(
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

    // Getting all the project managers
    GetAllProjectManagersWithPagination(filter: Filter, currentProjectManagerId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllProjectManagersWithPagination(filter, currentProjectManagerId).subscribe(
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

    // Update Project Manager Access Levels
    SetProjectManagerAccessLevel(parentId: number, childId: number, isTicked: boolean) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetProjectManagerAccessLevel(parentId, childId, isTicked).subscribe(
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

    // Update Contractor Access Levels
    SetContractorAccessLevel(parentId: number, contractorId: number, isTicked: boolean) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetContractorAccessLevel(parentId, contractorId, isTicked).subscribe(
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

    // Getting all the client details for the project manager
    GetAllClients(filter: Filter) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllClients(filter).subscribe(
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

    // Getting all the user types
    GetAllUserTypes() {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllUserTypes().subscribe(
                data => {
                    let returnData = <UserTypeName[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Setting the user types
    SetAdminUserType(userTypeName: UserTypeName, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetAdminUserType(userTypeName, actionType).subscribe(
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

    // Setting the role name management
    SetRoleNameManagement(roleManagement: RoleManagement, actionType: string, userTypeId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetRoleNameManagement(roleManagement, actionType, userTypeId).subscribe(
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

    // Getting all the role management
    GetAllRoleManagementBasedUT(filter: Filter, userTypeId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllRoleManagementBasedUT(filter, userTypeId).subscribe(
                data => {
                    let returnData = <RoleManagement[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Set sub task details
    SetSubTaskDetails(subTaskDetails: SubTaskDetails, taskId: number, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetSubTaskDetails(subTaskDetails, taskId, actionType).subscribe(
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

    // Set note details
    SetNoteTaskDetails(subTaskNote: SubTaskNote, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetNoteTaskDetails(subTaskNote, actionType).subscribe(
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

    // GetAllPersons
    GetAllPersons(filter: Filter) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.GetAllPersons(filter).subscribe(
                data => {
                    let returnData = <UserDetails[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Disabled the person
    SetDisablePerson(userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.adminService.SetDisablePerson(userId).subscribe(
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