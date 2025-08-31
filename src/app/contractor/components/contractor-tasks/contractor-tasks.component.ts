import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { AssignTaskDetails } from '../../core/assignTaskDetails';
import { Filter } from '../../../main_containers/core/filter';
import { ContractorModel } from '../../models/contractorModel';
import { ContractorService } from '../../services/contractor.service';
import { AdminService } from '../../../admin/services/admin.service';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { StatusDetails } from '../../core/statusDetails';
import { SelectItem } from 'primeng/api';
import { TaskDetails } from '../../../admin/core/taskDetails';
import { AssignedTaskMoreDetails } from '../../core/assignedTaskMoreDetails';
import { SubTaskDetails } from '../../../admin/core/subTaskDetails';
import { AttachmentDetails } from '../../../admin/core/attachmentDetails';
import { SubTaskNote } from '../../../admin/core/subTaskNote';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { UploadFilesComponent } from '../../../admin/components/upload-files/upload-files.component';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';
import { DownloadConfirmationComponent } from '../../../main_containers/download-confirmation/download-confirmation.component';

@Component({
  selector: 'app-contractor-tasks',
  templateUrl: './contractor-tasks.component.html',
  styleUrl: './contractor-tasks.component.scss',
  providers: [DatePipe, DialogService],
  standalone: false
})
export class ContractorTasksComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the contract model
  contractorModel: ContractorModel;
  // Input params
  @Input() SelectedClientId: number = 0;
  // Store the tasks list
  assignedTasksList: AssignTaskDetails[] = [];
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
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
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the status list
  statusDetailsList: StatusDetails[] = [];
  // Store the display status list
  displayStatusDetailsList: SelectItem[] = [];
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

  constructor(private adminService: AdminService, private contractorService: ContractorService,
    private datePipe: DatePipe, public dialogService: DialogService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    if (this.SelectedClientId)
      // Getting the basic project details
      this.GetBasicProjectDetails();
    // Getting the status list
    this.GetAllStatusList();

    this.manageLoggedUserId();
  }
  //store logged user id
  loggedUserId: number = 0;

  //handle logged user id
  manageLoggedUserId() {
    if (this.overallCookieInterface.GetUserId() < 0) {
      this.loggedUserId = -1;
    } else {
      this.loggedUserId = this.overallCookieInterface.GetUserId();
    }
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

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the assigned tasks list 
        this.GetAllAssignedTasksDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the assigned tasks list 
  GetAllAssignedTasksDetails() {
    // Calling the model to retrieve the data
    this.contractorModel.GetAllAssignedTasks(this.currentFilter, this.projectDetails.Id, this.loggedUserId).then(
      (data) => {
        // Getting the project details
        this.assignedTasksList = <AssignTaskDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data

  }


  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the assigned tasks list 
    this.GetAllAssignedTasksDetails();
  }

  // On change event of the task status
  taskStatusOnChange(taskId: number, statusId: number) {
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskStatus(taskId, statusId, this.loggedUserId).then(
      (data) => {
        // Getting all the assigned tasks list 
        this.GetAllAssignedTasksDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the task status value
  getStatusValue(taskId: number) {
    return { value: (taskId == 3) };
  }

  // Getting the task status value
  getStatusCodeValue(taskCode: string) {
    return { value: (taskCode == 'COM') };
  }

  // On change event of task status complete on change
  taskStatusCompleteOnChange(event: any, taskId: number) {
    // Check if the checkbox is checked
    if (event.currentTarget.checked) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, 3, this.loggedUserId).then(
        (data) => {
          // Getting all the assigned tasks list 
          this.GetAllAssignedTasksDetails();
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, 1, this.loggedUserId).then(
        (data) => {
          // Getting all the assigned tasks list 
          this.GetAllAssignedTasksDetails();
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the checkbox is checked
  }

  // On change event of task status complete on change
  subTaskStatusCodeCompleteOnChange(event: any, subTaskId: number) {
    // Check if the checkbox is checked
    if (event.currentTarget.checked) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 3, this.loggedUserId).then(
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
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 1, this.loggedUserId).then(
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

  // Show task details for the selected task ID
  showTaskDetails(taskId: number) {
    this.isTaskDetailsVisible = true; // Set task details visibility to true
    // Calling the model to retrieve the data
    this.contractorModel.GetAssignedTaskMoreDetails(taskId).then(
      (data) => {
        // Getting the project details
        let taskList = <AssignedTaskMoreDetails>data;
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

  // On select event of due date
  dueDateOnSelect() {
    let currentDate = this.datePipe.transform(this.displayTaskDetails.DueDate, 'MM-dd-yyyy');
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskDueDate(this.displayTaskDetails.Id, currentDate!, this.loggedUserId).then(
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

  // Input event of task description
  taskDescriptionInput() {
    // Calling the model to retrieve the data
    this.contractorModel.UpdateTaskDescription(this.displayTaskDetails.Id, this.displayTaskDetails.Description, this.loggedUserId).then(
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

  // On click event of new sub task
  createNewSubtask(taskId: number) {
    // Calling the model to retrieve the data
    this.contractorModel.InsertNewSubtask(this.newSubTask, taskId, this.loggedUserId).then(
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
    this.contractorModel.InsertNewNote(this.newSubTaskNote, taskId, this.loggedUserId).then(
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
        this.contractorModel.RemoveNote(notId, this.loggedUserId).then(
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
        projectId: this.loggedUserId,
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
        this.contractorModel.RemoveTaskAttachments(attachmentId, this.loggedUserId).then(
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
