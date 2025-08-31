import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StageDetails } from '../../../admin/core/stageDetails';
import { ProjectManagerModel } from '../../models/projectManagerModel';
import { ProjectManagerService } from '../../services/project-manager.service';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { SubStageDetails } from '../../../admin/core/subStageDetails';
import { SubStageCategoryDetails } from '../../../admin/core/subStageCategoryDetails';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-stage-level',
  templateUrl: './stage-level.component.html',
  styleUrl: './stage-level.component.scss',
  providers: [DialogService],
  standalone: false
})
export class StageLevelComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
  @Output() closeSlideInPopup = new EventEmitter<boolean>();
  // Stage list
  stageList: StageDetails[] = [];
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
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
  // Store the sub stages list
  subStageList: SubStageDetails[] = [];
  // Store the sub stages category list
  subStageCategoryList: SubStageCategoryDetails[] = [];
  // Store the selected stage
  selectedStageId: number = 0;
  // Store the selected sub stage
  selectedSubStageId: number = 0;
  // Store the add stage state
  addStageState: boolean = false;
  // Store the state
  stageAddSection: boolean = false;
  subStageAddSection: boolean = false;
  subStageCategoryAddSection: boolean = false;
  // Store the ng model for stages
  stageNewName: string = "";
  subStageNewName: string = "";
  subStageCategoryNewName: string = "";
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];

  constructor(private projectManagerService: ProjectManagerService, private adminService: AdminService,
    public dialogService: DialogService
  ) {
    // Initialize the model
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);
    this.adminModel = new AdminModel(this.adminService);
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
        // Getting all the stages list
        this.GetAllStageList();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of cancel
  cancelOnClickFunction() {
    // Closing the popup
    this.closeSlideInPopup.emit(false);
  }

  // Getting all the stages list
  GetAllStageList() {
    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllStageDetails(this.projectDetails.Id).then(
      (data) => {
        // Getting the project details
        this.stageList = <StageDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of stage
  stageOnClickFunction(stageId: number) {
    this.selectedSubStageId = 0;
    this.selectedStageId = stageId;
    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllSubStageDetails(this.selectedStageId).then(
      (data) => {
        // Getting the project details
        this.subStageList = <SubStageDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of sub stage
  subStageOnClickFunction(subStageId: number) {
    this.selectedSubStageId = subStageId;
    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllSubStageCategoryDetails(this.selectedSubStageId).then(
      (data) => {
        // Getting the project details
        this.subStageCategoryList = <SubStageCategoryDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of create
  createOnClick(stageType: string) {
    // Clear the errors
    this.errorMessagesList = [];
    // Checking the type
    switch (stageType) {
      case 'SD':
        // Check if the stage name is not empty
        if (this.stageNewName && this.stageNewName.trim() != '') {
          // Calling the model to retrieve the data
          this.projectManagerModel.SetAllStageDetails(this.projectDetails.Id, this.stageNewName, "S").then(
            () => {
              this.subStageList = [];
              this.subStageCategoryList = [];
              this.stageNewName = "";
              // Getting all the stages list
              this.GetAllStageList();
              this.cancelOnClick('SD');
            }
          );
          // End of Calling the model to retrieve the data
        } else {
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'EMPTY$STAGE_NAME',
              ErrorMessage: 'Stage name is mandatory'
            }
          );
        }
        break;
      case 'SSD':
        // Check if the stage name is not empty
        if (this.subStageNewName && this.subStageNewName.trim() != '') {
          // Calling the model to retrieve the data
          this.projectManagerModel.SetAllStageDetails(this.selectedStageId, this.subStageNewName, "SS").then(
            () => {
              this.subStageCategoryList = [];
              this.subStageNewName = "";
              // On click function of stage
              this.stageOnClickFunction(this.selectedStageId);
              this.cancelOnClick('SSD');
            }
          );
          // End of Calling the model to retrieve the data
        } else {
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'EMPTY$SUB_STAGE_NAME',
              ErrorMessage: 'Sub Stage name is mandatory'
            }
          );
        }
        break;
      case 'SSDC':
        // Check if the stage name is not empty
        if (this.subStageCategoryNewName && this.subStageCategoryNewName.trim() != '') {
          // Calling the model to retrieve the data
          this.projectManagerModel.SetAllStageDetails(this.selectedSubStageId, this.subStageCategoryNewName, "SSC").then(
            () => {
              this.subStageCategoryNewName = "";
              // On click function of sub stage
              this.subStageOnClickFunction(this.selectedSubStageId);
              this.cancelOnClick('SSDC');
            }
          );
          // End of Calling the model to retrieve the data
        } else {
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'EMPTY$SUB_STAGE_CAT_NAME',
              ErrorMessage: 'Sub Stage Category name is mandatory'
            }
          );
        }
        break;
    }
    // End of Checking the type
  }

  // On click event of add button
  addButtonOnClick(stageType: string) {
    // Clear the errors
    this.errorMessagesList = [];
    // Checking the type
    switch (stageType) {
      case 'SD':
        this.stageAddSection = true;
        break;
      case 'SSD':
        this.subStageAddSection = true;
        break;
      case 'SSDC':
        this.subStageCategoryAddSection = true;
        break;
    }
    // End of Checking the type
  }

  // On click event of cancel on click
  cancelOnClick(stageType: string) {
    // Clear the errors
    this.errorMessagesList = [];
    // Checking the type
    switch (stageType) {
      case 'SD':
        this.stageAddSection = false;
        break;
      case 'SSD':
        this.subStageAddSection = false;
        break;
      case 'SSDC':
        this.subStageCategoryAddSection = false;
        break;
    }
    // End of Checking the type
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

  // On click event of delete stage
  deleteStage(stageId: number, stageType: string) {
    // Clear the errors
    this.errorMessagesList = [];
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
        // Checking the type
        switch (stageType) {
          case 'SD':
            // Calling the model to retrieve the data
            this.projectManagerModel.RemoveStageDetails(stageId, "S").then(
              () => {
                // Getting all the stages list
                this.GetAllStageList();
              }
            );
            // End of Calling the model to retrieve the data
            break;
          case 'SSD':
            // Calling the model to retrieve the data
            this.projectManagerModel.RemoveStageDetails(stageId, "SS").then(
              () => {
                // Getting all the stages list
                this.stageOnClickFunction(this.selectedStageId);
              }
            );
            // End of Calling the model to retrieve the data
            break;
          case 'SSDC':
            // Calling the model to retrieve the data
            this.projectManagerModel.RemoveStageDetails(stageId, "SSC").then(
              () => {
                // Getting all the stages list
                this.subStageOnClickFunction(this.selectedSubStageId);
              }
            );
            // End of Calling the model to retrieve the data
            break;
        }
        // End of Checking the type
      }
    });

  }


}
