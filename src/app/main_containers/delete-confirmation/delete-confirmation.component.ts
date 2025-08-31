import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss',
  standalone: false
})
export class DeleteConfirmationComponent {

  // Constructor
  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
  }

  // On click on confirmation button
  confirmDeleteItem(status: boolean) {
    this.ref.close(status);
  }
}
