import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-download-confirmation',
  templateUrl: './download-confirmation.component.html',
  styleUrl: './download-confirmation.component.scss',
  standalone: false
})
export class DownloadConfirmationComponent {
  // Constructor
  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
  }

  // On click on confirmation button
  confirmDeleteItem(status: boolean) {
    this.ref.close(status);
  }
}