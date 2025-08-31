import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { ContractorModel } from '../../../contractor/models/contractorModel';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { AssignedTaskMoreDetails } from '../../../contractor/core/assignedTaskMoreDetails';
import { AdminService } from '../../../admin/services/admin.service';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { ProjectManagerService } from '../../services/project-manager.service';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { Filter } from '../../../main_containers/core/filter';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-project-manager-checklist',
  templateUrl: './project-manager-checklist.component.html',
  styleUrl: './project-manager-checklist.component.scss',
  providers: [DatePipe, DialogService],
  standalone: false
})
export class ProjectManagerChecklistComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the contract model
  contractorModel: ContractorModel;
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
  // Input params
  @Input() SelectedClientId: number = 0;
  // Store the tasks list
  assignedTasksList: AssignedTaskMoreDetails[] = [];
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
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
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store display side panel
  isAddNewTaskDetailsVisible: boolean = false;
  // Store the editing task id
  currentTask: number = 0;
  // Store view state
  viewTaskState: string = "EDIT";

  constructor(private adminService: AdminService, private contractorService: ContractorService,
    private projectManagerService: ProjectManagerService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();

    this.manageLoggedUserId();
  }
 //store logged user id
 loggedUserId: number =0;

 //handle logged user id
 manageLoggedUserId(){      
   if(this.overallCookieInterface.GetUserId() <0){
     this.loggedUserId = -1;
   }else{
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
        // Getting all the assigned tasks list 
        this.GetAllAssignedTasksDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the assigned tasks list 
  GetAllAssignedTasksDetails() {
    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllTasksBasedDate(this.currentFilter, this.projectDetails.Id, this.loggedUserId ).then(
      (data) => {
        // Getting the project details
        this.assignedTasksList = <AssignedTaskMoreDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
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
      this.contractorModel.UpdateTaskStatus(taskId, 3,this.loggedUserId ).then(
        (data) => {
          // Getting all the assigned tasks list 
          this.GetAllAssignedTasksDetails();
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, 1,this.loggedUserId ).then(
        (data) => {
          // Getting all the assigned tasks list 
          this.GetAllAssignedTasksDetails();
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the checkbox is checked
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the assigned tasks list 
    this.GetAllAssignedTasksDetails();
  }

  // On click function of new task
  addNewTaskOnClick() {
    this.viewTaskState = 'EDIT';
    this.currentTask = 0;
    this.isAddNewTaskDetailsVisible = false;
    setTimeout(() => {
      // Setting the side panel visible
      this.isAddNewTaskDetailsVisible = true;
    }, 1)
  }

  // Closing the slide in popup
  closeSlideInPopup(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewTaskDetailsVisible = false;
    // Check the event
    if (event) {
      // Refresh the list
      // Getting all the assigned tasks list 
      this.GetAllAssignedTasksDetails();
    }
    // End of Check the event
  }

  // On click function of task edit
  editTaskOnCLick(taskId: number, creatorId: number) {
    this.viewTaskState = 'EDIT';
    // Check if the logged user is the creator
    if (this.overallCookieInterface.GetUserId() == creatorId || this.overallCookieInterface.GetUserId() < 0) {
      // Setting the editing task id
      this.currentTask = taskId;
      this.isAddNewTaskDetailsVisible = false;
      setTimeout(() => {
        // Setting the side panel visible
        this.isAddNewTaskDetailsVisible = true;
      }, 1)
    }
    // End of Check if the logged user is the creator
  }

  // Setting the view type
  setViewType(viewType: string, taskId: number, creatorId: number) {
    this.viewTaskState = viewType;
    // Setting the editing task id
    this.currentTask = taskId;
    this.isAddNewTaskDetailsVisible = false;
    setTimeout(() => {
      // Setting the side panel visible
      this.isAddNewTaskDetailsVisible = true;
    }, 1)
  }

  // Refresh the list
  refreshList(event: any) {
    // Getting all the assigned tasks list 
    this.GetAllAssignedTasksDetails();
  }
}
