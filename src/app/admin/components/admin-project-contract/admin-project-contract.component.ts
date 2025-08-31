import { Component, Input } from '@angular/core';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { ContractStage } from '../../core/contractStage';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { ProjectDetails } from '../../core/projectDetails';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';
import { Filter } from '../../../main_containers/core/filter';
import { AttachmentDetails } from '../../core/attachmentDetails';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';
import { ContractorModel } from '../../../contractor/models/contractorModel';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-project-contract',
  templateUrl: './admin-project-contract.component.html',
  styleUrl: './admin-project-contract.component.scss',
  providers: [DialogService],
  standalone: false
})
export class AdminProjectContractComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
  @Input() DisplayTopBar: boolean = true;
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the contract stages
  contractStages: ContractStage[] = [];
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
  // Store the search query
  searchQuery: string = "";

  // Store the current stage filter object
  currentAttachmentFilterList: Filter[] = [];
  // {
  //   CurrentPage: 1,
  //   RecordsPerPage: 10,
  //   SearchQuery: ''
  // };

  constructor(private adminService: AdminService, public dialogService: DialogService,
    private contractorService: ContractorService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
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

        // Getting the basic project details
        this.GetAllContractStages();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the contract stages
  GetAllContractStages() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllContractStages(this.projectDetails.Id, this.searchQuery).then(
      (data) => {
        // Getting the project details
        this.contractStages = <ContractStage[]>data;
        // Loop through the contract stages
        for (let i = 0; i < this.contractStages.length; i++) {
          // Setting the filter
          let currentFilter: Filter = {
            CurrentPage: 1,
            RecordsPerPage: 10,
            SearchQuery: this.searchQuery,
            SortAsc: true,
            SortCol: ""
          };
          // Adding to the list
          this.currentAttachmentFilterList.push(currentFilter);
        }
        // End of Loop through the contract stages
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of upload files
  uploadFilesOnClick(stageId: number) {
    // Open popup to select user roles
    let ref = this.dialogService.open(UploadFilesComponent, {
      showHeader: false,
      width: '22%',
      data: {
        stageId: stageId,
        projectId: this.projectDetails.Id
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

        // Getting all the contract stages
        this.GetAllContractStages();
      }
      // End of Check if the return value is true
    });
  }

  // On click event of stage filter
  stageFilterOnPageChange(event: any, stageIndex: number) {
    this.currentAttachmentFilterList[stageIndex].CurrentPage = event.page + 1;
    this.currentAttachmentFilterList[stageIndex].SearchQuery = this.searchQuery;
    // Getting the current stage details
    this.adminModel.GetAllContractStageAttachments(this.currentAttachmentFilterList[stageIndex], this.contractStages[stageIndex].Id, this.projectDetails.Id).then(
      (data) => {
        // Setting the new list
        this.contractStages[stageIndex].AttachmentList = <AttachmentDetails[]>data;
      }
    );
    // End of Getting the current stage details
  }

  // On click event of delete file attachment
  deleteAttachmentOnClick(fileId: number) {
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
        // Calling the model to update the data
        this.adminModel.RemoveStageAttachments(fileId).then(
          (data) => {
            // Getting all the contract stages
            this.GetAllContractStages();
          }
        );
        // End of Calling the model to update the data
      }
    });
  }

  // On click event of downloading the attachment file
  downloadAttachment(LocalPath: string, fileName: string) {
    // Calling the object model to access the service
    this.adminModel.DownloadFile(LocalPath, fileName).then(
      (blob: any) => {
        // specify a default file name and extension
        saveAs(blob, fileName);
      }
    );
    // End of Calling the object model to access the service
  }
}
