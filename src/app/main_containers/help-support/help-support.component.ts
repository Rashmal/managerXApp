import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrl: './help-support.component.scss',
  standalone: false
})
export class HelpSupportComponent {
  // Store the inputs
  @Input() userType: string = "";
  // Store the current expand state
  currentExpandState: string = "ALL";
  // Store the admin pdf file
  admin_pdfSrc = '../../assets/ad.pdf'; // Change to your PDF file path or a URL
  project_manager_pdfSrc = '../../assets/pm.pdf'; // Change to your PDF file path or a URL
  supplier_pdfSrc = '../../assets/sp.pdf'; // Change to your PDF file path or a URL

  constructor() {

  }

  ngOnInit() {
    this.currentExpandState = this.userType;
  }

  expandOnClick(selection: string) {
    this.currentExpandState = (this.currentExpandState == selection) ? '' : selection;
  }
}
