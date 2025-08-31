import { Component, Input, ViewChild } from '@angular/core';
import { ProjectManagerService } from '../../services/project-manager.service';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { Filter } from '../../../main_containers/core/filter';
import { ClientDetails } from '../../core/clientDetails';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-project-manager-projects',
  templateUrl: './project-manager-projects.component.html',
  styleUrl: './project-manager-projects.component.scss',
  standalone: false
})
export class ProjectManagerProjectsComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
  // Input params
  @Input() SelectedClientId: number = 0;
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
  currentProjectDetails: ProjectDetails = {
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
  // Store all client list
  clientList: ClientDetails[] = [];
  // Store the current state
  currentState: string = "DISPLAY_TABLE";
  // Store the client name
  currentClientDetails!: ClientDetails;
  // Store the selected sub tab
  selectedSubTab: string = "PROJECT_INFORMATION";
  // Store display side panel
  isAddNewClientDetailsVisible: boolean = false;
  // Store the selected client Id
  SelectedPersonClientId: number = 0;
  // View child
  @ViewChild('modulePaginator') modulePaginatorComponent!: Paginator;

  constructor(private projectManagerService: ProjectManagerService, private contractorService: ContractorService,
    private adminService: AdminService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the client list
        this.GetAllClientListDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the client list
  GetAllClientListDetails() {
    if (this.overallCookieInterface.GetUserId() > 0) {
      // Calling the model to retrieve the data
      this.projectManagerModel.GetClientForPM(this.currentFilter, this.overallCookieInterface.GetUserId()).then(
        (data) => {
          // Getting the project details
          this.clientList = <ClientDetails[]>data;
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.adminModel.GetAllClients(this.currentFilter).then(
        (data) => {
          // Getting the project details
          this.clientList = <ClientDetails[]>data;
        }
      );
      // End of Calling the model to retrieve the data
    }

  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the client list
    this.GetAllClientListDetails();
  }

  // On click event of project row
  projectOnClick(projectId: number) {
    // Setting the individual projects display
    this.currentState = "PROJECT";

    // Getting the client index
    let clientIndex = this.clientList.findIndex(obj => obj.Id == projectId);

    // Setting the client name
    this.currentClientDetails = this.clientList[clientIndex];

    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.currentClientDetails.Id).then(
      (data) => {
        // Getting the project details
        this.currentProjectDetails = <ProjectDetails>data;
        // Getting the stage details
        //this.GetAllStageDetails();
        // Getting the current stage details
        //this.GetCurrentStageDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // on click function of go back
  goBackOnClick() {
    this.currentState = "DISPLAY_TABLE";
    this.selectedSubTab = "PROJECT_INFORMATION";
    setTimeout(() => {
      // Refresh the list
      if (this.modulePaginatorComponent) {
        this.modulePaginatorComponent.changePage(this.currentFilter.CurrentPage - 1);
      } else {
        // Getting all the client list
        this.GetAllClientListDetails();
      }
    }, 1)
  }

  // On click event of select the client id
  clientOnClick(clientId: number, ProjectCreatedById: number) {

    //checking the project is created by the logged in user
    if (ProjectCreatedById == this.overallCookieInterface.GetUserId() && this.overallCookieInterface.GetUserRole() == 'AD' || this.overallCookieInterface.GetUserId() < 0) {
      this.isAddNewClientDetailsVisible = false;
      this.SelectedPersonClientId = clientId;
      setTimeout(() => {
        // Setting the side panel visible
        this.isAddNewClientDetailsVisible = true;
      }, 1)
    }
  }

  // On click function of new client
  addNewClientOnClick() {
    this.isAddNewClientDetailsVisible = false;
    this.SelectedPersonClientId = 0;
    setTimeout(() => {
      // Setting the side panel visible
      this.isAddNewClientDetailsVisible = true;
    }, 1)
  }

  // Closing the slide in popup
  closeSlideInPopup(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewClientDetailsVisible = false;
    // Check the event
    if (event) {
      // Refresh the list
      if (this.modulePaginatorComponent) {
        this.modulePaginatorComponent.changePage(0);
      } else {
        // Getting all the client list
        this.GetAllClientListDetails();
      }

    }
    // End of Check the event
  }




}
