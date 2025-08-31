import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { ContractorModel } from '../../../contractor/models/contractorModel';
import { ContractorService } from '../../../contractor/services/contractor.service';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss',
  standalone: false
})
export class UploadFilesComponent {
  // Store the file
  file: File | null = null;
  // Store the stage id details
  stageId: number = 0;
  // Declare the admin model
  adminModel: AdminModel;
  // Store the project id
  projectId: number = 0;
  // Store the upload type
  uploadType: string = "CONTRACT";
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  //store logged user id
  loggedUserId: number = 0;
  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig,
    private adminService: AdminService, private contractorService: ContractorService) {
    // Check if the passing value exists
    if (this.config.data.stageId) {
      this.stageId = this.config.data.stageId;
    }
    if (this.config.data.projectId) {
      this.projectId = this.config.data.projectId;
    }
    if (this.config.data.uploadType) {
      this.uploadType = this.config.data.uploadType;
    }
    // End of Check if the passing value exists

    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  // Methods to handle drag and drop functionality for file upload
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const uploadArea = event.currentTarget as HTMLElement;
    uploadArea.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    const uploadArea = event.currentTarget as HTMLElement;
    uploadArea.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const uploadArea = event.currentTarget as HTMLElement;
    uploadArea.classList.remove('dragover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.file = event.dataTransfer.files[0];
      let AttachmentName = this.file?.name;
      let AttachmentType = (this.file?.type.split('/')[1] || '');
      this.uploadImage();
    }
  }

  // Method to upload an image
  uploadImage(): void {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      // Check the upload type
      if (this.uploadType == "" || this.uploadType == "CONTRACT") {
        // Calling the admin model to upload the file attachments
        this.adminModel.UploadStageAttachments(formData, this.stageId, this.projectId).then(
          () => {
            // Closing the popup
            this.ref.close(true);
          }
        );
        // End of Calling the admin model to upload the file attachments
      } else if (this.uploadType == "TASK") {




        if (this.overallCookieInterface.GetUserId() < 0) {
          this.loggedUserId = -1;
        } else {
          this.loggedUserId = this.overallCookieInterface.GetUserId();
        }


        // Calling the admin model to upload the file attachments
        this.contractorModel.UploadStageAttachments(formData, this.stageId, this.loggedUserId).then(
          () => {
            // Closing the popup
            this.ref.close(true);
          }
        );
        // End of Calling the admin model to upload the file attachments
      }
    }
  }

  // Method to trigger file input click event
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      let AttachmentName = this.file?.name;
      let AttachmentType = (this.file?.type.split('/')[1] || '');
      this.uploadImage();
    }
  }

  // Closing the popup
  closeOnClick() {
    // Calling the emit function to close
    this.ref.close();
  }
}
