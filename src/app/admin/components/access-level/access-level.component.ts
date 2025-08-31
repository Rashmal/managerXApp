import { Component } from '@angular/core';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { RoleManagement } from '../../core/roleManagement';
import { UserBasicDetails } from '../../core/userBasicDetails';
import { SelectItem } from 'primeng/api';
import { Filter } from '../../../main_containers/core/filter';
import { UserTypeName } from '../../core/userTypeName';

@Component({
  selector: 'app-access-level',
  templateUrl: './access-level.component.html',
  styleUrl: './access-level.component.scss',
  standalone: false
})
export class AccessLevelComponent {
  // Declare the admin model
  adminModel: AdminModel;
  // Store the role details
  roleDetailsList: RoleManagement[] = [];
  // Store the role details
  tempRoleDetailsList: RoleManagement[] = [
    {
      Id: 0,
      CurrentName: '',
      LastModified: new Date(),
      NameCode: '',
      OriginalName: '',
      TotalRecords: 0
    }
  ];
  // Store the new role details
  newRoleDetailsList: RoleManagement = {
    Id: 0,
    CurrentName: '',
    LastModified: new Date(),
    NameCode: '',
    OriginalName: '',
    TotalRecords: 0
  };
  // Store all the project managers
  allProjectManagerList: UserBasicDetails[] = [];
  // Store all the project managers
  allDisplayProjectManagerList: SelectItem[] = [
    {
      value: 0,
      label: '-- Select --'
    }
  ];
  // Store all the project managers
  allDisplayContractorsList: SelectItem[] = [
    {
      value: 0,
      label: '-- Select --'
    }
  ];
  // Store the selected project manager
  selectedProjectManagerId: number = 0;
  // Store the selected project manager
  selectedProjectManagerIdContractor: number = 0;
  // Store the manageable project managers
  manageableProjectManagers: UserBasicDetails[] = [];
  allContractorsList: UserBasicDetails[] = [];
  // Store the project manager filter
  projectManagerFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the project manager filter
  contractorFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the user type name list
  userTypeNameList: UserTypeName[] = [];
  // Display user types
  displayUserTypeList: SelectItem[] = [];
  // Store the selected user type for role details
  selectedUserTypeForRoleDetails: number = 0;
  // Store the project manager filter
  roleNameFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the selected role id
  selectedEditRoleId: number = 0;
  // Store the add new role state
  addNewRoleState: boolean = false;

  constructor(private adminService: AdminService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
  }

  ngOnInit() {
    //this.allDisplayProjectManagerList = [];
    // Getting all the role list
    this.GetAllRoleList();
    // Getting all the project managers
    this.GetAllProjectManagers();
    // Getting all the project managers
    //this.GetAllContractors();
    // Getting all the user types
    this.GetAllUserTypes();
  }

  // Getting all the user types
  GetAllUserTypes() {
    this.displayUserTypeList = [];
    // Calling the model to retrieve the data
    this.adminModel.GetAllUserTypes().then(
      (data) => {
        // Getting the project details
        this.userTypeNameList = <UserTypeName[]>data;

        // Setting in the local storage
        localStorage.setItem("UTN_DATA", btoa(JSON.stringify(this.userTypeNameList)));

        // Loop through the user types
        for (let i = 0; i < this.userTypeNameList.length; i++) {
          this.displayUserTypeList.push(
            {
              value: this.userTypeNameList[i].Id,
              label: this.userTypeNameList[i].CurrentName + '(' + this.userTypeNameList[i].OriginalName + ')'
            }
          );
        }
        // End of Loop through the user types

        // Setting the default selection
        this.selectedUserTypeForRoleDetails = this.displayUserTypeList[0].value;

        this.userTypeRoleDetailsOnChange();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On change event of user type for user roles
  userTypeRoleDetailsOnChange() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllRoleManagementBasedUT(this.roleNameFilter, this.selectedUserTypeForRoleDetails).then(
      (data) => {
        // Getting the project details
        this.roleDetailsList = <RoleManagement[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the project managers
  GetAllContractors() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllContractors(this.contractorFilter, this.selectedProjectManagerIdContractor).then(
      (data) => {
        // Getting the project details
        this.allContractorsList = <UserBasicDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the project managers
  GetAllProjectManagers() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllProjectManagers(0).then(
      (data) => {
        // Getting the project details
        this.allProjectManagerList = <UserBasicDetails[]>data;

        // this.selectedProjectManagerId = this.allProjectManagerList[0].UserId;
        // this.selectedProjectManagerIdContractor = this.allProjectManagerList[0].UserId;

        // Loop through the project managers
        for (let i = 0; i < this.allProjectManagerList.length; i++) {
          this.allDisplayProjectManagerList.push({
            value: this.allProjectManagerList[i].UserId,
            label: this.allProjectManagerList[i].FirstName + " " + this.allProjectManagerList[i].LastName
          });
        }
        // End of Loop through the project managers


      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the role list
  GetAllRoleList() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllRoleManagement().then(
      (data) => {
        // Getting the project details
        this.roleDetailsList = <RoleManagement[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // update on click function
  updateOnClick(role: RoleManagement) {
    // Calling the model to retrieve the data
    this.adminModel.SetRoleManagement(role, "UPDATE").then(
      (data) => {
        // On change event of user type for user roles
        this.userTypeRoleDetailsOnChange();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // update on click function
  restoreOnClick(role: RoleManagement) {
    // Calling the model to retrieve the data
    this.adminModel.SetRoleManagement(role, "RESTORE").then(
      (data) => {
        // On change event of user type for user roles
        this.userTypeRoleDetailsOnChange();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // update on click function
  updateUserTypeOnClick(userTypeName: UserTypeName) {
    // Calling the model to retrieve the data
    this.adminModel.SetAdminUserType(userTypeName, "UPDATE").then(
      (data) => {
        // Getting all the role list
        this.GetAllUserTypes();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // update on click function
  restoreUserTypeOnClick(userTypeName: UserTypeName) {
    // Calling the model to retrieve the data
    this.adminModel.SetAdminUserType(userTypeName, "RESTORE").then(
      (data) => {
        // Getting all the role list
        this.GetAllUserTypes();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On select event of project manager
  projectManagerOnSelect() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllProjectManagersWithPagination(this.projectManagerFilter, this.selectedProjectManagerId).then(
      (data) => {
        // Setting the person details
        this.manageableProjectManagers = <UserBasicDetails[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.projectManagerFilter.CurrentPage = event.page + 1;
    // On select event of project manager
    this.projectManagerOnSelect();
  }

  //on change module list paginator
  onPageRoleNameManagementChange(event: any) {
    this.roleNameFilter.CurrentPage = event.page + 1;
    // On change event of user type for user roles
    this.userTypeRoleDetailsOnChange();
  }

  //on change module list paginator
  onPageContractorChange(event: any) {
    this.contractorFilter.CurrentPage = event.page + 1;
    // Getting all the project managers
    this.GetAllContractors();
  }


  // On change event of manage project manager on change
  manageProjectManagerOnChange(event: any, childId: number) {
    // Calling the model to retrieve the data
    this.adminModel.SetProjectManagerAccessLevel(this.selectedProjectManagerId, childId, event.currentTarget.checked).then(
      (data) => {
        // On select event of project manager
        this.projectManagerOnSelect();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On change event of manage project manager on change
  manageContractorOnChange(event: any, childId: number) {
    // Calling the model to retrieve the data
    this.adminModel.SetContractorAccessLevel(this.selectedProjectManagerIdContractor, childId, event.currentTarget.checked).then(
      (data) => {
        // Getting all the project managers
        this.GetAllContractors();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of role details
  editRoleDetails(roleId: number) {
    this.selectedEditRoleId = roleId;
  }

  // On click event of cancel
  cancelRoleEdit() {
    this.selectedEditRoleId = 0;
  }

  updateRoleEdit() {
     
    // Find the role being edited using selectedEditRoleId
    let indexObj = this.roleDetailsList.findIndex(obj => obj.Id == this.selectedEditRoleId);

    // If not found, exit early
    if (indexObj === -1) {
      console.warn('Role not found.');
      return;
    }

    const selectedRole = this.roleDetailsList[indexObj];

    // ✅ Check if OriginalName is empty (input field is bound to this)
    if (!selectedRole.OriginalName || selectedRole.OriginalName.trim() === '') {
      console.warn('Original Name is required.');
      // Or use a toast message, if you like
      return;
    }

    // Proceed with update if valid
    this.adminModel.SetRoleNameManagement(selectedRole, "UPDATE", this.selectedUserTypeForRoleDetails).then(
      (data) => {
        this.userTypeRoleDetailsOnChange();
        this.cancelRoleEdit();
      }
    );
  }


  // On click event of cancel new role
  cancelNewRoleDetails() {
    this.newRoleDetailsList = {
      Id: 0,
      CurrentName: '',
      LastModified: new Date(),
      NameCode: '',
      OriginalName: '',
      TotalRecords: 0
    };
    this.addNewRoleState = false;
  }

  // On click event of submit new role
  submitNewRoleDetails() {

    // Calling the model to retrieve the data
    this.adminModel.SetRoleNameManagement(this.newRoleDetailsList, "NEW", this.selectedUserTypeForRoleDetails).then(
      (data) => {
        // Getting all the project managers
        this.userTypeRoleDetailsOnChange();
        this.cancelNewRoleDetails();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click function of add new role
  addNewRoleOnClick() {
    this.addNewRoleState = true;
  }
}
