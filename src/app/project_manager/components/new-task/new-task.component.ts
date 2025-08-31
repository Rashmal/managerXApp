import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskDetails } from '../../../admin/core/taskDetails';
import { SelectItem } from 'primeng/api';
import { ContractorModel } from '../../../contractor/models/contractorModel';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { StatusDetails } from '../../../contractor/core/statusDetails';
import { UserDetails } from '../../../admin/core/userDetails';
import { Filter } from '../../../main_containers/core/filter';
import { AdminService } from '../../../admin/services/admin.service';
import { AdminModel } from '../../../admin/models/adminModel';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { ProjectManagerService } from '../../services/project-manager.service';
import { StageDetails } from '../../../admin/core/stageDetails';
import { SubStageDetails } from '../../../admin/core/subStageDetails';
import { SubStageCategoryDetails } from '../../../admin/core/subStageCategoryDetails';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { addDays } from '@fullcalendar/core/internal';
import { AssignedTaskMoreDetails } from '../../../contractor/core/assignedTaskMoreDetails';
import { SubTaskNote } from '../../../admin/core/subTaskNote';
import { SubTaskDetails } from '../../../admin/core/subTaskDetails';
import { DialogService } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { UploadFilesComponent } from '../../../admin/components/upload-files/upload-files.component';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';

import { DownloadConfirmationComponent } from '../../../main_containers/download-confirmation/download-confirmation.component';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
  providers: [DatePipe, DialogService],
  standalone: false
})
export class NewTaskComponent {
  @Output() closeSlideInPopup = new EventEmitter<boolean>();
  @Output() refreshList = new EventEmitter<boolean>();
  // Input params
  @Input() SelectedClientId: number = 0;
  @Input() TaskId: number = 0;
  @Input() viewTaskState: string = "EDIT";
  // Store the task details
  taskDetails: TaskDetails;
  // Store the display status list
  displayStatusDetailsList: SelectItem[] = [];
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the status list
  statusDetailsList: StatusDetails[] = [];
  // Store the user details object
  contactUserDetails: UserDetails[] = [];
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Declare the admin model
  adminModel: AdminModel;
  // Display the add person section
  displayAddPersons: boolean = false;
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the display list for the stage list
  displayStageList: SelectItem[] = [];
  // Store the display list for the sub stage list
  displaySubStageList: SelectItem[] = [];
  // Store the display list for the sub stage category list
  displaySubStageCategoryList: SelectItem[] = [];
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
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
  // Store the selected stage details
  selectedStageId: number = -1;
  selectedSubStageId: number = -1;
  selectedSubStageCategoryId: number = -1;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
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
  // Store the edit sub task
  editSubTaskId: number = 0;
  editSubNoteId: number = 0;
  // Store current task id
  currentTaskId: number = 0;
  // Display sub task error message
  displaySubTaskError: boolean = false;
  // Display note error message
  displayNoteError: boolean = false;
  // Store the date has changed
  startDateIsChanged: boolean = false;
  // Store the date has changed
  endDateIsChanged: boolean = false;

  constructor(private contractorService: ContractorService, private adminService: AdminService,
    private projectManagerService: ProjectManagerService, public dialogService: DialogService,
    private datePipe: DatePipe
  ) {
    // Initialize the model
    this.contractorModel = new ContractorModel(this.contractorService);
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    this.overallCookieInterface = new OverallCookieModel();

    // initialize the object
    this.taskDetails = {
      Id: 0,
      AddedDate: new Date(),
      AttachmentList: [],
      Category: '',
      Description: '',
      DueDate: new Date(),
      Name: '',
      NoOfFiles: 0,
      NoOfImages: 0,
      PersonList: [],
      StatusCode: '',
      StatusId: 1,
      StatusName: '',
      SubTaskDetailsList: [],
      SubTaskNoteList: [],
      TotalRecords: 0,
      CategoryId: 0,
      StageId: 0,
      SubStageId: 0,
      StageDetailsId: 0,
      SubStageDetailsId: 0
    }
  }

  ngOnInit() {
    // Getting the status list
    this.GetAllStatusList();
    // Getting all the contact list
    this.GetAllContactList();
    // Getting the basic project details
    this.GetBasicProjectDetails();
    // Manage the  LoggedUser
    this.manageLoggedUserId();
  }

  //store logged user id
  loggedUserId: number = 0;

  //handle logged user id
  manageLoggedUserId() {
      //if GetUserId value check is it (-) value
    if (this.overallCookieInterface.GetUserId() < 0) {
      //All (-) value set as ghost 01
      this.loggedUserId = -1;
    } else {
      this.loggedUserId = this.overallCookieInterface.GetUserId();
    }
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the stages list
        this.GetAllStageList();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the stages list
  GetAllStageList() {
    this.displayStageList = [
      {
        value: -1,
        label: 'Select'
      }
    ];
    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllStageDetails(this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        let stageList = <StageDetails[]>data;
        // Loop through the stage list
        for (let i = 0; i < stageList.length; i++) {
          this.displayStageList.push(
            {
              value: stageList[i].Id,
              label: stageList[i].Name
            }
          );
        }
        // End of Loop through the stage list

        // Check if the task ID is not 0
        if (this.TaskId != 0) {
          // Getting the task details
          this.GetTaskDetails();
        }
        // End of Check if the task ID is not 0
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the task details
  GetTaskDetails() {
    // Calling the model to retrieve the data
    this.projectManagerModel.GetTaskDetailsBasedId(this.TaskId).then(
      (data) => {
        // Getting the project details
        this.taskDetails = <TaskDetails>data;
        this.selectedStageId = this.taskDetails.StageId;
        this.onChangeStageDetails('SD', true);
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of stage
  stageOnClickFunction(stageId: number) {
    this.displaySubStageList = [];
    setTimeout(() => {
      this.displaySubStageList = [
        {
          value: -1,
          label: 'Select'
        }
      ];

      // Calling the model to retrieve the data
      this.projectManagerModel.GetAllSubStageDetails(stageId).then(
        (data) => {
          // Getting the project details
          let subStageList = <SubStageDetails[]>data;
          // Loop through the stage list
          for (let i = 0; i < subStageList.length; i++) {
            this.displaySubStageList.push(
              {
                value: subStageList[i].Id,
                label: subStageList[i].Name
              }
            );
          }
          // End of Loop through the stage list
 
          if (this.selectedSubStageId == -1) {
            this.selectedSubStageId = this.taskDetails.SubStageId;
            this.onChangeStageDetails('SSD', true);
          }
        }
      );
      // End of Calling the model to retrieve the data
    }, 1)


 
  }

  // On click function of sub stage
  subStageOnClickFunction(subStageId: number) {
    this.displaySubStageCategoryList = [];
    setTimeout(() => {
      this.displaySubStageCategoryList = [
        {
          value: -1,
          label: 'Select'
        }
      ];
      // Calling the model to retrieve the data
      this.projectManagerModel.GetAllSubStageCategoryDetails(subStageId).then(
        (data) => {
          // Getting the project details
          let subStageCategoryList = <SubStageCategoryDetails[]>data;
          // Loop through the stage list
          for (let i = 0; i < subStageCategoryList.length; i++) {
            this.displaySubStageCategoryList.push(
              {
                value: subStageCategoryList[i].Id,
                label: subStageCategoryList[i].Name
              }
            );
          }
          // End of Loop through the stage list
          if (this.selectedSubStageCategoryId == -1)
            this.selectedSubStageCategoryId = this.taskDetails.CategoryId;
        }
      );
      // End of Calling the model to retrieve the data
    }, 1)
  }

  // On change event of stage details
  onChangeStageDetails(stageType: string, autoSelect: boolean = false) {
     
    // Check the stage type
    switch (stageType) {
      case "SD":
        this.selectedSubStageId = -1;
        this.selectedSubStageCategoryId = -1;
        if (autoSelect == false)
          this.taskDetails.CategoryId = -1;
        this.stageOnClickFunction(this.selectedStageId);
        break;
      case "SSD":
        this.selectedSubStageCategoryId = -1;
        if(this.selectedSubStageId==0){
  this.selectedSubStageId= -1;
        }
      
        if (autoSelect == false)
          this.taskDetails.CategoryId = -1;
        this.subStageOnClickFunction(this.selectedSubStageId);
        break;
      case "SSDC":
        // Setting the task details
        this.taskDetails.CategoryId = this.selectedSubStageCategoryId;
        if (this.TaskId != 0) {
          // Calling the model to retrieve the data
          this.projectManagerModel.SetTaskCategoryId(this.taskDetails.Id, this.taskDetails.CategoryId).then(
            (data) => {
              // Getting the task details
              this.GetTaskDetails();
            }
          );
          // End of Calling the model to retrieve the data
        }
        break;
    }
    // End of Check the stage type
  }

  // Getting all the contact list
  GetAllContactList() {

    // Calling the model to retrieve the data
    this.adminModel.GetAllSupplierContacts(this.currentFilter, this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.contactUserDetails = <UserDetails[]>data;
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


  // On click function of cancel
  cancelOnClickFunction() {
    // Closing the popup
    this.closeSlideInPopup.emit(false);
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetAllContactList();
  }

  // Check if the person id already added
  isAlreadyAdded(personId: number) {
    // Getting the index
    let indexObj = this.taskDetails.PersonList.findIndex(obj => obj.UserId == personId);
    // Return the value
    return (indexObj == -1) ? false : true;
  }

  // On click function of adding the person
  addPersonOnClick(personObject: UserDetails) {
    // Adding the  person details
    this.taskDetails.PersonList.push(
      {
        UserId: personObject.UserId,
        Avatar: personObject.Avatar,
        CompanyName: personObject.BuilderCompanyName,
        ContactNumber: personObject.ContactNumber,
        Email: personObject.Email,
        FirstName: personObject.FirstName,
        LastName: personObject.LastName,
        ManageNotificationViaEmail: true,
        ManageNotificationViaInApp: true,
        ManageNotificationViaSms: true,
        RoleCode: personObject.RoleCode,
        RoleName: personObject.RoleName,
        TotalRecords: 0,
        UserType: personObject.UserType
      }
    );

    if (this.TaskId != 0) {
      // Calling the model to retrieve the data
      this.projectManagerModel.SetContactToTaskDetails(this.taskDetails.Id, personObject.UserId, "ADD", this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
  }

  // On toggle function of add person
  onToggleDisplayPerson() {
    this.displayAddPersons = !this.displayAddPersons;
  }

  // On click on submit 
  onClickSubmit() {
    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if the error messages length

    // Adding one day for dates
    if (this.taskDetails.Id == 0) {
      if (this.endDateIsChanged)
        this.taskDetails.DueDate = addDays(this.taskDetails.DueDate, 1);
      if (this.startDateIsChanged)
        this.taskDetails.AddedDate = addDays(this.taskDetails.AddedDate, 1);
    }



    // Calling the model to retrieve the data
    this.projectManagerModel.SetTaskDetails(this.taskDetails, this.loggedUserId, "NEW").then(
      (data) => {
        // Closing the popup
        this.closeSlideInPopup.emit(true);
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of remove the task
  removeOnClickFunction() {
    // Calling the model to retrieve the data
    this.projectManagerModel.SetTaskDetails(this.taskDetails, this.loggedUserId, "REMOVE").then(
      (data) => {
        // Closing the popup
        this.closeSlideInPopup.emit(true);
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Check if the error exists
  CheckErrorCode(errorCode: string) {
    // Find for the code
    let indexObject = this.errorMessagesList.findIndex(obj => obj.ErrorCode == errorCode);
    // Return the error object
    if (indexObject < 0) {
      return null;
    } else {
      return this.errorMessagesList[indexObject];
    }
  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the first name exists
    if (!(this.taskDetails.Name && this.taskDetails.Name != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$TASK_NAME',
          ErrorMessage: 'Task name is mandatory'
        }
      );
    }
    // End of Check if the first name exists

    // Check if the last name exists
    if (!(this.taskDetails.Description && this.taskDetails.Description != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$TASK_DESCRIPTION',
          ErrorMessage: 'Task description is mandatory'
        }
      );
    }
    // End of Check if the last name exists

    // Check if the category is selected
    if (!(this.taskDetails.CategoryId && this.taskDetails.CategoryId != -1)) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$CATEGORY',
          ErrorMessage: 'Task sub stage category is mandatory'
        }
      );
    }

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  // on click function of remove person
  removePersonFromList(personId: number) {
    // Getting the index
    let indexObj = this.taskDetails.PersonList.findIndex(obj => obj.UserId == personId);
    // Remove from the list
    this.taskDetails.PersonList.splice(indexObj, 1);

    if (this.TaskId != 0) {
      // Calling the model to retrieve the data
      this.projectManagerModel.SetContactToTaskDetails(this.taskDetails.Id, personId, "REMOVE", this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
  }

  // Getting the task status value
  getStatusCodeValue(taskCode: string) {
    return { value: (taskCode == 'COM') };
  }

  // On change event of task status complete on change
  subTaskStatusCodeCompleteOnChange(event: any, subTaskId: number) {
    // Check if the checkbox is checked
    if (event.currentTarget.checked) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 3, this.loggedUserId).then(
        (data) => {
          // Calling the model to retrieve the data
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
          // End of Calling the model to retrieve the data
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateSubTaskStatus(subTaskId, 1, this.loggedUserId).then(
        (data) => {
          // Calling the model to retrieve the data
          // Getting the task details
          this.GetTaskDetails();
          // End of Calling the model to retrieve the data
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the checkbox is checked
  }

  // On click event of new sub task
  createNewSubtask(taskId: number) {
    // Check if the sub task has a value
    if (this.newSubTask.Name.trim() == '') {
      this.displaySubTaskError = true;
      return;
    }
    // End of Check if the sub task has a value

    // Calling the model to retrieve the data
    this.contractorModel.InsertNewSubtask(this.newSubTask, taskId, this.loggedUserId).then(
      (data) => {
        // On click event of cancel new note
        this.cancelNewSubtask();
        // Getting the task details
        this.GetTaskDetails();
        this.refreshList.emit(true);
        // End of Calling the model to retrieve the data
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of cancel new note
  cancelNewSubtask() {
    // Enable add note
    this.addSubtaskState = false;
    this.displaySubTaskError = false;
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

  //on change event of display sub tasks
  onChangeDisplaySubTasksPaginator(event: any) {
    this.displaySubTasksFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskDetails(this.taskDetails.Id, this.displaySubTasksFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskDetails[]>data;
        // Setting the categories
        this.taskDetails.SubTaskDetailsList = dataList;
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
            // Getting the task details
            this.GetTaskDetails();
            this.refreshList.emit(true);
            // End of Calling the model to retrieve the data
          }
        );
        // End of Calling the model to retrieve the data
      }
    });
  }

  // On click event of cancel new note
  cancelNewNote() {
    // Enable add note
    this.addNoteState = false;
    this.displayNoteError = false;
    // initialize the new note
    this.newSubTaskNote = {
      Id: 0,
      AddedDate: new Date(),
      Description: '',
      TotalRecords: 0
    };
  }

  // On click event of new note
  createNewNote(taskId: number) {
    // Check if the sub task has a value
    if (this.newSubTaskNote.Description.trim() == '') {
      this.displayNoteError = true;
      return;
    }
    // End of Check if the sub task has a value

    // Calling the model to retrieve the data
    this.contractorModel.InsertNewNote(this.newSubTaskNote, taskId, this.loggedUserId).then(
      (data) => {
        // On click event of cancel new note
        this.cancelNewNote();

        // Calling the model to retrieve the data
        // Getting the task details
        this.GetTaskDetails();
        this.refreshList.emit(true);
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

  //on change event of display task note
  onChangeDisplayTaskNotesPaginator(event: any) {
    this.displayTaskNotesFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskNoteDetails(this.taskDetails.Id, this.displayTaskNotesFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskNote[]>data;
        // Setting the categories
        this.taskDetails.SubTaskNoteList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
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
            // Getting the task details
            this.GetTaskDetails();
            this.refreshList.emit(true);
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
        // Getting the task details
        this.GetTaskDetails();
        this.refreshList.emit(true);
        // End of Calling the model to retrieve the data
      }
      // End of Check if the return value is true
    });
  }

  // input change event of task name
  taskNameInput() {
    // Check if the task ID is not 0
    if (this.TaskId != 0) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskName(this.taskDetails.Id, this.taskDetails.Name, this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the task ID is not 0
  }

  // input change event of task description
  taskDescriptionInput() {
    // Check if the task ID is not 0
    if (this.TaskId != 0) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskDescription(this.taskDetails.Id, this.taskDetails.Description, this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the task ID is not 0
  }

  // On change event of the task status
  taskStatusOnChange(taskId: number, statusId: number) {
    // Check if the task ID is not 0
    if (this.TaskId != 0) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, statusId, this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the task ID is not 0
  }

  // On select event of due date
  dueDateOnSelect() {
    this.endDateIsChanged = true;
    // Check if the task ID is not 0
    if (this.TaskId != 0) {
      let currentDate = this.datePipe.transform(this.taskDetails.DueDate, 'dd-MM-yyyy');
      const hostname = window.location.hostname;

      if (hostname === 'localhost') {
        currentDate = this.datePipe.transform(this.taskDetails.DueDate, 'MM-dd-yyyy');
      } else {
        currentDate = this.datePipe.transform(this.taskDetails.DueDate, 'MM-dd-yyyy');
      }

      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskDueDate(this.taskDetails.Id, currentDate!, this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the task ID is not 0
  }

  // On select event of due date
  startDateOnSelect() {
    this.startDateIsChanged = true;
    // Check if the task ID is not 0
    if (this.TaskId != 0) {
      let currentDate = this.datePipe.transform(this.taskDetails.AddedDate, 'dd-MM-yyyy');
      const hostname = window.location.hostname;

      if (hostname === 'localhost') {
        currentDate = this.datePipe.transform(this.taskDetails.AddedDate, 'MM-dd-yyyy');
      } else {
        currentDate = this.datePipe.transform(this.taskDetails.AddedDate, 'MM-dd-yyyy');
      }
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStartDate(this.taskDetails.Id, currentDate!, this.loggedUserId).then(
        (data) => {
          // Getting the task details
          this.GetTaskDetails();
          this.refreshList.emit(true);
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the task ID is not 0
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
    let indexObj = this.taskDetails.SubTaskDetailsList.findIndex(obj => obj.Id == subTaskId);
    // Calling the model to update the values
    this.adminModel.SetSubTaskDetails(this.taskDetails.SubTaskDetailsList[indexObj], 1, "UPDATE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubTaskOnClick();
        // Getting the task details
        this.GetTaskDetails();
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub task submit
  submitSubNoteOnClick(subNoteId: number) {
    // Getting the index
    let indexObj = this.taskDetails.SubTaskNoteList.findIndex(obj => obj.Id == subNoteId);
    // Calling the model to update the values
    this.adminModel.SetNoteTaskDetails(this.taskDetails.SubTaskNoteList[indexObj], "UPDATE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubNoteOnClick();
        // Getting the task details
        this.GetTaskDetails();
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub task remove
  removeSubTaskOnClick(subTaskId: number) {
    // Getting the index
    let indexObj = this.taskDetails.SubTaskDetailsList.findIndex(obj => obj.Id == subTaskId);
    // Calling the model to update the values
    this.adminModel.SetSubTaskDetails(this.taskDetails.SubTaskDetailsList[indexObj], 1, "REMOVE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubTaskOnClick();
        // Getting the task details
        this.GetTaskDetails();
      }
    );
    // End of Calling the model to update the values
  }

  // On click function on sub note remove
  removeSubNoteOnClick(subNoted: number) {
    // Getting the index
    let indexObj = this.taskDetails.SubTaskNoteList.findIndex(obj => obj.Id == subNoted);
    // Calling the model to update the values
    this.adminModel.SetNoteTaskDetails(this.taskDetails.SubTaskNoteList[indexObj], "REMOVE").then(
      () => {
        // On click function of cancel sub task
        this.cancelSubNoteOnClick();
        // Getting the task details
        this.GetTaskDetails();
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
           // saveAs(blob, fileName);
          }
        );
        // End of Calling the object model to access the service
      }
    });
  }

}
