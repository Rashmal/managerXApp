import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { UserDetails } from '../../../admin/core/userDetails';
import { Filter } from '../../../main_containers/core/filter';
import { AdminService } from '../../../admin/services/admin.service';

@Component({
  selector: 'app-project-manager-contacts',
  templateUrl: './project-manager-contacts.component.html',
  styleUrl: './project-manager-contacts.component.scss',
  standalone: false
})
export class ProjectManagerContactsComponent {
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
  // Store display side panel
  isAddNewClientDetailsVisible: boolean = false;
  // Store the selected client Id
  SelectedPersonClientId: number = 0;

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


  // On click event of select the client id
  clientOnClick(clientId: number) {
 return;

    this.isAddNewClientDetailsVisible = false;
    this.SelectedPersonClientId = clientId;
    setTimeout(() => {
      // Setting the side panel visible
      this.isAddNewClientDetailsVisible = true;
    }, 1)
  }

  // On click function of new client
  addNewClientOnClick() {
    this.isAddNewClientDetailsVisible = false;
    this.SelectedPersonClientId = 0;
    setTimeout(() => {
      // Setting the side panel visible
      this.isAddNewClientDetailsVisible = true;
    }, 1)
  }

  // Closing the slide in popup
  closeSlideInPopup(event: boolean) {
    // Setting the side panel invisible
    this.isAddNewClientDetailsVisible = false;
    // Check the event
    if (event) {
      // Refresh the list
      // Getting all the client list
      this.GetAllContactList();
    }
    // End of Check the event
  }
}

