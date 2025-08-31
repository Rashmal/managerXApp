import { Component, Input } from '@angular/core';
import { Filter } from '../../../main_containers/core/filter';
import { AdminModel } from '../../../admin/models/adminModel';
import { UserDetails } from '../../../admin/core/userDetails';
import { AdminService } from '../../../admin/services/admin.service';

@Component({
  selector: 'app-contractor-contacts',
  templateUrl: './contractor-contacts.component.html',
  styleUrl: './contractor-contacts.component.scss',
  standalone: false
})
export class ContractorContactsComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Input params
  @Input() SelectedClientId: number = 0;
  // Store the contacts
  contactList: UserDetails[] = [];
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };

  constructor(private adminService: AdminService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
  }

  ngOnInit() {
    // Getting all the contact list
    this.GetAllContactList();
  }

  // Getting all the contact list
  GetAllContactList() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllContacts(this.currentFilter, this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.contactList = <UserDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetAllContactList();
  }

  // On click event of sort name
  sortNameOnClick() {
    // Check the conditions
    if (this.currentFilter.SortCol == "") {
      // Setting the filter
      this.currentFilter.SortCol = "NAME";
      this.currentFilter.SortAsc = true;
    } else if (this.currentFilter.SortCol == "NAME" && this.currentFilter.SortAsc == true) {
      // Setting the filter
      this.currentFilter.SortCol = "NAME";
      this.currentFilter.SortAsc = false;
    } else if (this.currentFilter.SortCol == "NAME" && this.currentFilter.SortAsc == false) {
      // Setting the filter
      this.currentFilter.SortCol = "";
      this.currentFilter.SortAsc = true;
    }
    // End of Check the conditions

    // Getting all the contact list
    this.GetAllContactList();
  }
}
