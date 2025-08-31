import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrl: './alert-box.component.scss',
  standalone: false
})
export class AlertBoxComponent {

  // Constructor
  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
  }

  // On click on ok button
  okClickEvent(status: boolean) {
    this.ref.close(status);
  }
}
