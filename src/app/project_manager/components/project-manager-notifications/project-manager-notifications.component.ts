import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { Filter } from '../../../main_containers/core/filter';
import { NotificationDetails } from '../../../admin/core/notificationDetails';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { AdminService } from '../../../admin/services/admin.service';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';

@Component({
  selector: 'app-project-manager-notifications',
  templateUrl: './project-manager-notifications.component.html',
  styleUrl: './project-manager-notifications.component.scss',
  standalone: false
})
export class ProjectManagerNotificationsComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
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
  // Store the current  filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the notifications list
  notificationsList: NotificationDetails[] = [];
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;

  constructor(private adminService: AdminService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
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
        // Getting the notifications details
        this.GetAllNotificationDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the notifications details
  GetAllNotificationDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllNotifications(this.currentFilter, this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        this.notificationsList = <NotificationDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change event of task paginator
  onChangeTaskPaginator(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting the notifications details
    this.GetAllNotificationDetails();
  }

  // Check the assign task user name
  checkAssignTaskUsername(extraData: string) {
    // Split by ';'
    let splittedList: string[] = extraData.split(';');
    // Getting the current logged user id
    let currentLoggedUserId = this.overallCookieInterface.GetUserId();
    // Check if both are same
    if (currentLoggedUserId == +splittedList[0]) {
      return 'you';
    } else {
      return splittedList[1];
    }
    // End of Check if both are same
  }
}
