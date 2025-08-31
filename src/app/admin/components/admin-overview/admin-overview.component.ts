import { Component, Input } from '@angular/core';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { ProjectDetails } from '../../core/projectDetails';
import { StageDetails } from '../../core/stageDetails';
import { SubStageCategoryDetails } from '../../core/subStageCategoryDetails';
import { Filter } from '../../../main_containers/core/filter';

interface LazyEvent {
  first: number;
  last: number;
}

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.scss',
  standalone: false
})
export class AdminOverviewComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Input params
  @Input() SelectedClientId: number = 0;
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
  // Store the stage list
  stageList: StageDetails[] = [];
  // Store the stage index
  stageFirstIndex: number = 0;
  stageLastIndex: number = 8;
  // Store the lazy loading config
  lazyLoading: boolean = false;
  // Lazy loading time out
  loadLazyTimeout: any;
  // Store the current stage details
  currentSubStageCategory!: SubStageCategoryDetails;
  // Store the current stage filter object
  currentStageFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  page = 1;
  size = 10; // Number of items per page
  loading = false;
  allLoaded = false;

  //store total task count
  TotTaskCount: number = 0;
  //store complted task count
  CompletedTaskCount: number = 0;
  constructor(private adminService: AdminService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);

  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();
  }

  // Getting the current stage details
  GetCurrentStageDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetCurrentStageDetails(this.currentStageFilter, this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        this.currentSubStageCategory = <SubStageCategoryDetails>data;

        // Count total tasks
        const totalTasks = this.currentSubStageCategory.TaskDetailsList.length;
        this.TotTaskCount = totalTasks;
        // Count tasks with StatusId = 3
        const completedTasks = this.currentSubStageCategory.TaskDetailsList.filter(task => task.StatusId === 3).length;
        this.CompletedTaskCount = completedTasks; 
         
        
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
        // Getting the stage details
        this.GetAllStageDetails();
        // Getting the current stage details
        this.GetCurrentStageDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the stage details
  GetAllStageDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetStageListBasedOnLazyLoading(this.stageFirstIndex, (this.stageLastIndex == 0) ? 8 : this.stageLastIndex, this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        this.stageList = <StageDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }
  // End of Getting the stage details

  // On lazy loading event
  onLazyLoad(event: LazyEvent) {
    // Enable lazy loading
    this.lazyLoading = true;
    // Check the lazy loading time out
    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }
    // End of Check the lazy loading time out

    // Calling the lazy loading time out
    this.loadLazyTimeout = setTimeout(() => {
      // Getting the index values
      const { first, last } = event;
      this.stageFirstIndex = 0;
      this.stageLastIndex = (last == 0) ? 8 : first + 7;
      // Setting the lazy loading values
      // Calling the model to retrieve the data
      this.adminModel.GetStageListBasedOnLazyLoading(this.stageFirstIndex, this.stageLastIndex, this.projectDetails.Id).then(
        (data) => {
          // Getting the project details
          this.stageList = <StageDetails[]>data;
          // Disabling the lazy loading
          this.lazyLoading = false;
        }
      );
      // End of Calling the model to retrieve the data
    }, 100);
    // End of Calling the lazy loading time out

  }

  loadMore(): void {
    if (this.loading || this.allLoaded) return;

    this.loading = true;

    // Calling the model to retrieve the data
    this.adminModel.GetStageListBasedOnLazyLoading(this.stageFirstIndex, this.stageLastIndex, this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        this.stageList = <StageDetails[]>data;

        if (this.stageList.length < this.size) {
          this.allLoaded = true; // No more items to load
        }
        this.stageList.push(...this.stageList);
        this.page++;
        this.loading = false;
      }
    );
    // End of Calling the model to retrieve the data
    // this.dataService.getItems(this.page, this.size).subscribe(data => {
    //   if (data.length < this.size) {
    //     this.allLoaded = true; // No more items to load
    //   }
    //   this.items.push(...data);
    //   this.page++;
    //   this.loading = false;
    // });
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentStageFilter.CurrentPage = event.page + 1;
    // Getting the current stage details
    this.GetCurrentStageDetails();
  }

}
