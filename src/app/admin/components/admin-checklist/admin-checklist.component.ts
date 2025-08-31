import { Component, Input } from '@angular/core';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { ProjectDetails } from '../../core/projectDetails';
import { SelectItem } from 'primeng/api';
import { StageDetails } from '../../core/stageDetails';
import { Filter } from '../../../main_containers/core/filter';
import { SubStageDetails } from '../../core/subStageDetails';
import { SubStageCategoryDetails } from '../../core/subStageCategoryDetails';
import { TaskDetails } from '../../core/taskDetails';
import { SubTaskDetails } from '../../core/subTaskDetails';
import { SubTaskNote } from '../../core/subTaskNote';
import { AttachmentDetails } from '../../core/attachmentDetails';
import { ContractorModel } from '../../../contractor/models/contractorModel';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { StatusDetails } from '../../../contractor/core/statusDetails';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { AssignTaskDetails } from '../../../contractor/core/assignTaskDetails';
import { DatePipe } from '@angular/common';
import { AssignedTaskMoreDetails } from '../../../contractor/core/assignedTaskMoreDetails';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { DownloadConfirmationComponent } from '../../../main_containers/download-confirmation/download-confirmation.component';

@Component({
  selector: 'app-admin-checklist',
  templateUrl: './admin-checklist.component.html',
  styleUrl: './admin-checklist.component.scss',
  providers: [DatePipe, DialogService],
  standalone: false
})
export class AdminChecklistComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
  @Input() DisplayTopBar: boolean = true;
  // Declare the admin model
  adminModel: AdminModel;
  // Store the basic project details
  projectDetails: ProjectDetails = {
    Id: 0,
    Address: '',
    BuilderCompany: '',
    DeliveryDate: new Date(),
    Owner: '',
    ProjectDuration: '',
    StartDate: new Date(),
    CreatedId: 0
  };
  // Store display stage list
  displayStageList: SelectItem[] = [];
  // Store the selected stage Id
  selectedStageId: number = 0;
  // Store the current sub stage filter object
  currentSubStageFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the current sub stage category filter object
  currentSubStageCategoryFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the task filter object
  currentTaskCategoryFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the sub stages list
  subStageList: SubStageDetails[] = [];
  // Store display side panel
  isTaskDetailsVisible: boolean = false;
  // Store the display task details
  displayTaskDetails!: AssignedTaskMoreDetails;
  // Store the display task sub tasks
  displaySubTasksFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the display task notes
  displayTaskNotesFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the display task attachments
  displayTaskAttachmentsFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the display status list
  displayStatusDetailsList: SelectItem[] = [];
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the status list
  statusDetailsList: StatusDetails[] = [];
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the tasks list
  assignedTasksList: AssignTaskDetails[] = [];
  // Store the add note state
  addNoteState: boolean = false;
  // Store the add subtask state
  addSubtaskState: boolean = false;
  // Store the new note
  newSubTaskNote: SubTaskNote = {
    Id: 0,
    AddedDate: new Date(),
    Description: '',
    TotalRecords: 0
  };
  // Store the new subtask
  newSubTask: SubTaskDetails = {
    Id: 0,
    AddedDate: new Date(),
    Name: '',
    StatusCode: '',
    StatusName: '',
    TotalRecords: 0
  };
  // Store the edit sub task
  editSubTaskId: number = 0;
  editSubNoteId: number = 0;
  // Store current task id
  currentTaskId: number = 0;

  constructor(private adminService: AdminService, private contractorService: ContractorService,
    private datePipe: DatePipe, public dialogService: DialogService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();
    // Getting the status list
    this.GetAllStatusList();
  }

  // On click event of the attachment
  removeAttachmentOnClick(attachmentId: number) {
    // Open popup to select user roles
    let ref = this.dialogService.open(DeleteConfirmationComponent, {
      showHeader: false,
      width: '22%',
      data: {
      }
    });
    // Perform an action on close the popup
    ref.onClose.subscribe((data: any) => {
      if (data) {
        // Calling the model to retrieve the data
        this.contractorModel.RemoveTaskAttachments(attachmentId, this.overallCookieInterface.GetUserId()).then(
          (data) => {
            // On click event of cancel new note
            this.cancelNewNote();

            // Calling the model to retrieve the data
            this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
              (data) => {
                // Getting the project details
                let taskList = <AssignedTaskMoreDetails>data;
                // Setting the categories
                this.displayTaskDetails = taskList;
              }
            );
            // End of Calling the model to retrieve the data
          }
        );
        // End of Calling the model to retrieve the data
      }
    });
  }

  // On click event of adding a new  attachment
  addNewAttachment(taskId: number) {
    // Open popup to select user roles
    let ref = this.dialogService.open(UploadFilesComponent, {
      showHeader: false,
      width: '22%',
      data: {
        stageId: taskId,
        projectId: this.overallCookieInterface.GetUserId(),
        uploadType: "TASK"
      }
    });
    // Perform an action on close the popup
    ref.onClose.subscribe((data: any) => {
      // Check if the return value is true
      if (data) {
        // Open the alert box
        let refAlert = this.dialogService.open(AlertBoxComponent, {
          showHeader: false,
          width: '22%'
        });
        // End of Open the alert box

        // Calling the model to retrieve the data
        this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
          (data) => {
            // Getting the project details
            let taskList = <AssignedTaskMoreDetails>data;
            // Setting the categories
            this.displayTaskDetails = taskList;
          }
        );
        // End of Calling the model to retrieve the data
      }
      // End of Check if the return value is true
    });
  }

  // On click function of add note
  addNoteOnClick() {
    // Enable add note
    this.addNoteState = true;
    // initialize the new note
    this.newSubTaskNote = {
      Id: 0,
      AddedDate: new Date(),
      Description: '',
      TotalRecords: 0
    };
  }


  // On click function of add sub task
  addSubtaskOnClick() {
    // Enable add note
    this.addSubtaskState = true;
    // initialize the new note
    this.newSubTask = {
      Id: 0,
      AddedDate: new Date(),
      TotalRecords: 0,
      Name: '',
      StatusCode: '',
      StatusName: ''
    };
  }


  // On click event of new sub task
  createNewSubtask(taskId: number) {
    // Calling the model to retrieve the data
    this.contractorModel.InsertNewSubtask(this.newSubTask, taskId, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // On click event of cancel new note
        this.cancelNewSubtask();

        // Calling the model to retrieve the data
        this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
          (data) => {
            // Getting the project details
            let taskList = <AssignedTaskMoreDetails>data;
            // Setting the categories
            this.displayTaskDetails = taskList;
          }
        );
        // End of Calling the model to retrieve the data
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of new note
  createNewNote(taskId: number) {
    // Calling the model to retrieve the data
    this.contractorModel.InsertNewNote(this.newSubTaskNote, taskId, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // On click event of cancel new note
        this.cancelNewNote();

        // Calling the model to retrieve the data
        this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
          (data) => {
            // Getting the project details
            let taskList = <AssignedTaskMoreDetails>data;
            // Setting the categories
            this.displayTaskDetails = taskList;
          }
        );
        // End of Calling the model to retrieve the data
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of the task note
  deleteNoteOnClick(notId: number) {
    // Open popup to select user roles
    let ref = this.dialogService.open(DeleteConfirmationComponent, {
      showHeader: false,
      width: '22%',
      data: {
      }
    });
    // Perform an action on close the popup
    ref.onClose.subscribe((data: any) => {
      if (data) {
        // Calling the model to retrieve the data
        this.contractorModel.RemoveNote(notId, this.overallCookieInterface.GetUserId()).then(
          (data) => {
            // On click event of cancel new note
            this.cancelNewNote();

            // Calling the model to retrieve the data
            this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
              (data) => {
                // Getting the project details
                let taskList = <AssignedTaskMoreDetails>data;
                // Setting the categories
                this.displayTaskDetails = taskList;
              }
            );
            // End of Calling the model to retrieve the data
          }
        );
        // End of Calling the model to retrieve the data
      }
    });
  }

  // On click event of cancel new note
  cancelNewSubtask() {
    // Enable add note
    this.addSubtaskState = false;
    // initialize the new note
    this.newSubTask = {
      Id: 0,
      AddedDate: new Date(),
      TotalRecords: 0,
      Name: '',
      StatusCode: '',
      StatusName: ''
    };
  }

  // On click event of cancel new note
  cancelNewNote() {
    // Enable add note
    this.addNoteState = false;
    // initialize the new note
    this.newSubTaskNote = {
      Id: 0,
      AddedDate: new Date(),
      Description: '',
      TotalRecords: 0
    };
  }


  // On change event of task status complete on change
  subTaskStatusCodeCompleteOnChange(event: any, subTaskId: number) {
    // Check if the checkbox is checked
    if (event.currentTarget.checked) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 3, this.overallCookieInterface.GetUserId()).then(
        (data) => {
          // Calling the model to retrieve the data
          this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
            (data) => {
              // Getting the project details
              let taskList = <AssignedTaskMoreDetails>data;
              // Setting the categories
              this.displayTaskDetails = taskList;
            }
          );
          // End of Calling the model to retrieve the data
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 1, this.overallCookieInterface.GetUserId()).then(
        (data) => {
          // Calling the model to retrieve the data
          this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
            (data) => {
              // Getting the project details
              let taskList = <AssignedTaskMoreDetails>data;
              // Setting the categories
              this.displayTaskDetails = taskList;
            }
          );
          // End of Calling the model to retrieve the data
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the checkbox is checked
  }

  // Getting the task status value
  getStatusCodeValue(taskCode: string) {
    return { value: (taskCode == 'COM') };
  }

  // Input event of task description
  taskDescriptionInput() {
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskDescription(this.displayTaskDetails.Id, this.displayTaskDetails.Description, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Calling the model to retrieve the data
        this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
          (data) => {
            // Getting the project details
            let taskList = <AssignedTaskMoreDetails>data;
            // Setting the categories
            this.displayTaskDetails = taskList;
          }
        );
        // End of Calling the model to retrieve the data
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On select event of due date
  dueDateOnSelect() {
    let currentDate = this.datePipe.transform(this.displayTaskDetails.DueDate, 'dd-MM-yyyy');
    const hostname = window.location.hostname;

    if (hostname === 'localhost') {
      currentDate = this.datePipe.transform(this.displayTaskDetails.DueDate, 'MM-dd-yyyy');
    } else {
      currentDate = this.datePipe.transform(this.displayTaskDetails.DueDate, 'MM-dd-yyyy');
    }
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskDueDate(this.displayTaskDetails.Id, currentDate!, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Calling the model to retrieve the data
        this.contractorModel.GetAssignedTaskMoreDetails(this.displayTaskDetails.Id).then(
          (data) => {
            // Getting the project details
            let taskList = <AssignedTaskMoreDetails>data;
            // Setting the categories
            this.displayTaskDetails = taskList;
            // Getting the sub stages list
            this.GetSubStagesList(this.selectedStageId);
          }
        );
        // End of Calling the model to retrieve the data
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the status list
  GetAllStatusList() {
    this.displayStatusDetailsList = [];
    // Calling the model to retrieve the data
    this.contractorModel.GetStatusDetails().then(
      (data) => {
        // Getting the project details
        this.statusDetailsList = <StatusDetails[]>data;

        // Loop through the status list
        for (let i = 0; i < this.statusDetailsList.length; i++) {
          this.displayStatusDetailsList.push(
            {
              value: this.statusDetailsList[i].Id,
              label: this.statusDetailsList[i].Name
            }
          );
        }
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On change event of the task status
  taskStatusOnChange(taskId: number, statusId: number) {
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskStatus(taskId, statusId, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting all the assigned tasks list 
        this.GetAllAssignedTasksDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the assigned tasks list 
  GetAllAssignedTasksDetails() {
    // Calling the model to retrieve the data
    this.contractorModel.GetAllAssignedTasks(this.currentFilter, this.projectDetails.Id, this.overallCookieInterface.GetUserId()).then(
      (data) => {
        // Getting the project details
        this.assignedTasksList = <AssignTaskDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the stages list
        this.GetAllStageDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the stages list
  GetAllStageDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllStageList(this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        let stagesList = <StageDetails[]>data;
        // Clear the list
        this.displayStageList = [];
        // Loop through the stages list
        for (let i = 0; i < stagesList.length; i++) {
          // Adding the options
          this.displayStageList.push(
            {
              value: stagesList[i].Id,
              label: stagesList[i].Name
            }
          );
        }
        // End of Loop through the stages list

        // Setting the default selection
        this.selectedStageId = (this.displayStageList.length > 0) ? this.displayStageList[0].value : 0;

        // Getting the sub stages list
        this.GetSubStagesList(this.selectedStageId);
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the sub stages list
  GetSubStagesList(stageId: number) {
    // Calling the model to retrieve the data
    this.adminModel.GetAllSubStageList(this.currentSubStageFilter, stageId).then(
      (data) => {
        // Getting the project details
        this.subStageList = <SubStageDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data

  }

  // Getting the sub stage category list
  GetSubStagesCategoryList(subStageId: number) {
    // Calling the model to retrieve the data
    this.adminModel.GetAllSubStageCategoryList(this.currentSubStageCategoryFilter, subStageId).then(
      (data) => {
        // Getting the project details
        let subStageCategoryList = <SubStageCategoryDetails[]>data;
        // Setting the categories
        let subStageIndex = this.subStageList.findIndex(obj => obj.Id == subStageId);
        this.subStageList[subStageIndex].SubStageCategoryDetailsList = subStageCategoryList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the task list
  GetTaskList(subStageId: number, subStageCategoryId: number) {
    // Calling the model to retrieve the data
    this.adminModel.GetAllTaskList(this.currentTaskCategoryFilter, subStageCategoryId).then(
      (data) => {
        // Getting the project details
        let taskList = <TaskDetails[]>data;
        // Setting the categories
        let subStageIndex = this.subStageList.findIndex(obj => obj.Id == subStageId);
        let subStageCategoryIndex = this.subStageList[subStageIndex].SubStageCategoryDetailsList.findIndex(obj => obj.Id == subStageCategoryId);
        this.subStageList[subStageIndex].SubStageCategoryDetailsList[subStageCategoryIndex].TaskDetailsList = taskList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On change event of stage selection
  onChangeStageSelection() {
    // Getting the sub stages list
    this.GetSubStagesList(this.selectedStageId);
  }

  //on change event of sub stage paginator
  onChangeSubStagePaginator(event: any) {
    this.currentSubStageFilter.CurrentPage = event.page + 1;
    // Getting the sub stages list
    this.GetSubStagesList(this.selectedStageId);
  }

  //on change event of sub stage category paginator
  onChangeSubStageCategoryPaginator(event: any, subStageId: number) {
    this.currentSubStageCategoryFilter.CurrentPage = event.page + 1;
    // Getting the sub stages list
    this.GetSubStagesCategoryList(subStageId);
  }

  //on change event of task paginator
  onChangeTaskPaginator(event: any, subStageId: number, subStageCategoryId: number) {
    this.currentTaskCategoryFilter.CurrentPage = event.page + 1;
    // Getting the task list
    this.GetTaskList(subStageId, subStageCategoryId);
  }

  // Show task details for the selected task ID
  showTaskDetails(taskId: number) {
    this.currentTaskId = taskId;
    this.isTaskDetailsVisible = true; // Set task details visibility to true
    // Calling the model to retrieve the data
    this.adminModel.GeTaskDetails(taskId).then(
      (data) => {
        // Getting the project details
        let taskList = <any>data;
        // Setting the categories
        this.displayTaskDetails = taskList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Close task details
  closeTaskDetails() {
    this.isTaskDetailsVisible = false; // Set task details visibility to false
  }

  //on change event of display sub tasks
  onChangeDisplaySubTasksPaginator(event: any) {
    this.displaySubTasksFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskDetails(this.displayTaskDetails.Id, this.displaySubTasksFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskDetails[]>data;
        // Setting the categories
        this.displayTaskDetails.SubTaskDetailsList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change event of display task note
  onChangeDisplayTaskNotesPaginator(event: any) {
    this.displayTaskNotesFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskNoteDetails(this.displayTaskDetails.Id, this.displayTaskNotesFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskNote[]>data;
        // Setting the categories
        this.displayTaskDetails.SubTaskNoteList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change event of display task attachments
  onChangeDisplayTaskAttachmentsPaginator(event: any) {
    this.displayTaskAttachmentsFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetTaskAttachmentsWithPagination(this.displayTaskDetails.Id, this.displayTaskAttachmentsFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <AttachmentDetails[]>data;
        // Setting the categories
        this.displayTaskDetails.AttachmentList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of edit sub task
  editSubTaskSection(subtaskId: number) {
    // Setting the sub task id
    this.editSubTaskId = subtaskId;
  }

  // On click function of edit sub note
  editSubNoteSection(subNoteId: number) {
    // Setting the sub task id
    this.editSubNoteId = subNoteId;
  }

  // On click function of cancel sub task
  cancelSubTaskOnClick() {
    this.editSubTaskId = 0;
  }

  // On click function of cancel sub task
  cancelSubNoteOnClick() {
    this.editSubNoteId = 0;
  }

  // On click function on sub task submit
  submitSubTaskOnClick(subTaskId: number) {
    // Getting the index
    let indexObj = this.displayTaskDetails.SubTaskDetailsList.findIndex(obj => obj.Id == subTaskId);
    // Calling the model to update the values
    this.adminModel.SetSubTaskDetails(this.displayTaskDetails.SubTaskDetailsList[indexObj], 1, "UPDATE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubTaskOnClick();
        this.showTaskDetails(this.currentTaskId);
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub task submit
  submitSubNoteOnClick(subNoteId: number) {
    // Getting the index
    let indexObj = this.displayTaskDetails.SubTaskNoteList.findIndex(obj => obj.Id == subNoteId);
    // Calling the model to update the values
    this.adminModel.SetNoteTaskDetails(this.displayTaskDetails.SubTaskNoteList[indexObj], "UPDATE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubNoteOnClick();
        this.showTaskDetails(this.currentTaskId);
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub task remove
  removeSubTaskOnClick(subTaskId: number) {
    // Getting the index
    let indexObj = this.displayTaskDetails.SubTaskDetailsList.findIndex(obj => obj.Id == subTaskId);
    // Calling the model to update the values
    this.adminModel.SetSubTaskDetails(this.displayTaskDetails.SubTaskDetailsList[indexObj], 1, "REMOVE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubTaskOnClick();
        this.showTaskDetails(this.currentTaskId);
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub note remove
  removeSubNoteOnClick(subNoted: number) {
    // Getting the index
    let indexObj = this.displayTaskDetails.SubTaskNoteList.findIndex(obj => obj.Id == subNoted);
    // Calling the model to update the values
    this.adminModel.SetNoteTaskDetails(this.displayTaskDetails.SubTaskNoteList[indexObj], "REMOVE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubNoteOnClick();
        this.showTaskDetails(this.currentTaskId);
      }
    );
    // End of Calling the model to update the values
  }

  // on click event of download attachment
  downloadAttachment(fileUrl: string) {
    // Open popup to select user roles
    let ref = this.dialogService.open(DownloadConfirmationComponent, {
      showHeader: false,
      width: '22%',
      data: {
      }
    });
    // Perform an action on close the popup
    ref.onClose.subscribe((data: any) => {
      if (data) {
        // Changing the live URL to local path
        // https://iitcimages.iitcglobal.net//ManagerImages//task_4//TaskAttachmentsFiles//Manager X review_22July2024_eauup.pptx
        // 
        let fileName = fileUrl.split("/")[fileUrl.split("//").length - 1];
        let localPath = fileUrl.replace("https://iitcimages.iitcglobal.net", "C://WebSites//IITCimages");
        localPath = localPath.replaceAll("//", "/");

        // Calling the object model to access the service
        this.adminModel.DownloadFile(localPath, fileName).then(
          (blob: any) => {
            // specify a default file name and extension
            //saveAs(blob, fileName);
          }
        );
        // End of Calling the object model to access the service
      }
    });
  }

}
