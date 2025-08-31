import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { ChatRoom } from '../../core/chatRoom';
import { Filter } from '../../../main_containers/core/filter';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { UserDetails } from '../../../login_registration/core/userDetails';
import { ChatRoomMembers } from '../../core/chatRoomMembers';
import { ChatModel } from '../../models/chatModel';
import { ChatService } from '../../services/chat.service';
import { AuthenticationModel } from '../../../login_registration/models/authenticationModel';
import { AuthenticationService } from '../../../login_registration/services/authentication.service';
import { RoleDetails } from '../../../login_registration/core/roleDetails';
import { IErrorMessage } from '../../../login_registration/core/iErrorMessage';
import { TempPerson } from '../../core/tempPerson';

@Component({
  selector: 'app-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrl: './create-chat-room.component.scss',
  standalone: false
})
export class CreateChatRoomComponent {
  // Output events
  @Output() CloseComponent = new EventEmitter<boolean>();
  @Input() selectedRoom!: ChatRoom | null;
  @Input() selectedType: string = 'CREATE_INFO';
  @Input() selectedClientId: number = 0;
  // Store the state options
  stateOptions: SelectItem[] = [
    {
      value: 1,
      label: 'Individual'
    },
    {
      value: 2,
      label: 'Group'
    }
  ];
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the chat room details
  originalChatRoom!: ChatRoom;
  chatRoom: ChatRoom = {
    Id: 0,
    AddedDate: new Date(),
    ChatRoomTypeId: this.stateOptions[0].value,
    ChatRoomTypeCode: "IND",
    RoomName: '',
    RoomDescription: '',
    PersonOwnerEmail: '',
    PersonOwnerId: 0,
    PersonOwnerName: '',
    ChatRoomMembersList: [],
    TotalRecords: 0,
    UnreadCount: 0
  };
  // Store the current stage filter object
  currentFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the admin model
  adminModel!: AdminModel;
  // Store the user details object
  contactUserDetails: UserDetails[] = [];
  // Store display all members
  displayAllMembers: boolean = false;
  // Store the model
  chatModel!: ChatModel;
  // Store display invite external user
  inviteExternalUser: boolean = false;
  // Store the user roles details
  userRoleList: SelectItem[] = [];
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the user details object
  userDetails: UserDetails;
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the temp person list
  tempPersonList: TempPerson[] = [];
  originalTempPersonList: TempPerson[] = [];
  // Store invitee already exists
  inviteeAlreadyExists: boolean = false;

  constructor(private adminService: AdminService, private chatService: ChatService,
    private authenticationService: AuthenticationService
  ) {
    // Initialize the model
    this.overallCookieInterface = new OverallCookieModel();
    this.adminModel = new AdminModel(this.adminService);
    this.chatModel = new ChatModel(this.chatService);
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    // Initialize the user details object
    this.userDetails = {
      UserId: 0,
      FirstName: '',
      LastName: '',
      Email: "",
      Password: "1234",
      BuilderCompanyName: '',
      ContactNumber: '',
      UserType: "SP",
      RoleId: 0,
      AddressDetails: {
        Id: 0,
        AddressTypeId: 1,
        City: '',
        CountryId: 0,
        PostCode: '',
        State: '',
        StreetAddress: ''
      },
      Avatar: '',
      ProjectEndDate: new Date(),
      ProjectStartDate: new Date(),
      RoleCode: '',
      RoleName: '',
      TotalRecords: 0,
      CreatorId: 0,
      TempDisabled: false
    };
  }

  ngOnInit() {
    if (this.selectedRoom) {
      // Setting the default values
      this.chatRoom = this.selectedRoom;
      this.originalChatRoom = this.deep(this.chatRoom);
    } else {
      // Setting the default values
      this.chatRoom.PersonOwnerEmail = this.overallCookieInterface.GetUserEmail();
      this.chatRoom.PersonOwnerId = this.overallCookieInterface.GetUserId();
      this.chatRoom.PersonOwnerName = this.overallCookieInterface.GetUserFullName();
      this.chatRoom.ChatRoomMembersList.push(
        {
          IsAdmin: true,
          PersonEmail: this.overallCookieInterface.GetUserEmail(),
          PersonId: this.overallCookieInterface.GetUserId(),
          PersonName: this.overallCookieInterface.GetUserFullName()
        }
      );
    }

    // Getting all the user roles
    this.GetAllUserRoles();

    // Getting all the person list
    this.GetAllPersonList();
    // Getting the temp person list
    this.GetTempPersonList();
  }

  // Getting the temp person list
  GetTempPersonList() {
    // Calling the model
    this.chatModel.GetAllTempPersonList(this.selectedRoom?.Id!).then(
      (data) => {
        this.tempPersonList = <TempPerson[]>data;
        this.originalTempPersonList = this.deep(this.tempPersonList);
      }
    );
    // End of Calling the model
  }

  // Getting all the user roles
  GetAllUserRoles() {
    // Calling the model to retrieve all the user roles
    this.authenticationModel.GetRoleDetails(4).then(
      (data) => {
        // Getting the user roles
        let userRoles: RoleDetails[] = <RoleDetails[]>data;
        // Clear the list
        this.userRoleList = [];
        // Loop through the user roles
        for (let i = 0; i < userRoles.length; i++) {
          // Adding each object
          this.userRoleList.push(
            {
              value: userRoles[i].Id,
              label: userRoles[i].Name
            }
          );
        }
        // End of Loop through the user roles

        this.userDetails.RoleId = this.userRoleList[0].value;
      }
    );
    // End of Calling the model to retrieve all the user roles
  }


  // Making a deep copy
  deep<T extends object>(source: T): T {
    if (source) {
      return JSON.parse(JSON.stringify(source))
    }
    return source;
  }

  // Getting all the person list
  GetAllPersonList() {
    // Calling the model to get the data
    this.adminModel.GetAllPersons(this.currentFilter).then(
      (data) => {
        // Getting the project details
        this.contactUserDetails = <UserDetails[]>data;
      }
    );
    // End of Calling the model to get the data
  }

  // Close on click function
  CloseOnClick() {
    this.CloseComponent.emit(false);
  }

  // On click select members
  selectMembers() {
    this.displayAllMembers = true;
  }

  //on change module list paginator
  onPageChange(event: any) {
    this.currentFilter.CurrentPage = event.page + 1;
    // Getting all the contact list
    this.GetAllPersonList();
  }

  // On click cancel select members
  cancelSelectMembers() {
    this.displayAllMembers = false;
  }

  // Check if the user is already added
  returnUserObject(userId: number): ChatRoomMembers {
    let indexObj = this.chatRoom.ChatRoomMembersList.findIndex(obj => obj.PersonId == userId);
    if (indexObj != -1) {
      return this.chatRoom.ChatRoomMembersList[indexObj];
    } else {
      return {
        IsAdmin: false,
        PersonEmail: '',
        PersonId: 0,
        PersonName: ''
      }
    }
  }

  // On click event of add user to the chat room
  addUserToChatRoom(personObj: UserDetails) {
    this.chatRoom.ChatRoomMembersList.push(
      {
        IsAdmin: false,
        PersonEmail: personObj.Email,
        PersonId: personObj.UserId,
        PersonName: personObj.FirstName + ' ' + personObj.LastName
      }
    );
  }

  // On click event of remove user to the chat room
  removeUserToChatRoom(personObj: UserDetails) {
    let indexObj = this.chatRoom.ChatRoomMembersList.findIndex(obj => obj.PersonId == personObj.UserId);
    this.chatRoom.ChatRoomMembersList.splice(indexObj, 1);
  }

  // On Click event of creating the chat room
  createChatRoomOnClick() {
    if (this.selectedType == 'CREATE_INFO') {
      for (let i = 0; i < this.chatRoom.ChatRoomMembersList.length; i++) {
        if (this.chatRoom.ChatRoomMembersList[i].PersonId != this.overallCookieInterface.GetUserId()) {
          if (this.chatRoom.ChatRoomTypeId == 1) {
            this.chatService.SetChatRoomNotificationAsync(this.chatRoom.ChatRoomMembersList[i].PersonId, this.overallCookieInterface.GetUserId(), this.chatRoom.RoomName, this.chatRoom.ChatRoomTypeId, "You are added to the " + this.chatRoom.RoomName + " individual chat by " + this.overallCookieInterface.GetUserFullName());
          } else {
            this.chatService.SetChatRoomNotificationAsync(this.chatRoom.ChatRoomMembersList[i].PersonId, this.overallCookieInterface.GetUserId(), this.chatRoom.RoomName, this.chatRoom.ChatRoomTypeId, "You are added to the " + this.chatRoom.RoomName + " chat group by " + this.overallCookieInterface.GetUserFullName());
          }
        }
      }
    } else {
      for (let i = 0; i < this.chatRoom.ChatRoomMembersList.length; i++) {
        if (this.chatRoom.ChatRoomMembersList[i].PersonId != this.overallCookieInterface.GetUserId()) {

          let indexObj = this.originalChatRoom.ChatRoomMembersList.findIndex(obj => obj.PersonId == this.chatRoom.ChatRoomMembersList[i].PersonId);

          if (indexObj == -1) {
            if (this.chatRoom.ChatRoomTypeId == 1) {
              this.chatService.SetChatRoomNotificationAsync(this.chatRoom.ChatRoomMembersList[i].PersonId, this.overallCookieInterface.GetUserId(), this.chatRoom.RoomName, this.chatRoom.ChatRoomTypeId, "You are added to the " + this.chatRoom.RoomName + " individual chat by " + this.overallCookieInterface.GetUserFullName());
            } else {
              this.chatService.SetChatRoomNotificationAsync(this.chatRoom.ChatRoomMembersList[i].PersonId, this.overallCookieInterface.GetUserId(), this.chatRoom.RoomName, this.chatRoom.ChatRoomTypeId, "You are added to the " + this.chatRoom.RoomName + " chat group by " + this.overallCookieInterface.GetUserFullName());
            }
          }
        }
      }
    }

    // Calling the model
    this.chatModel.SetChatRoom(this.chatRoom, (this.selectedType == 'CREATE_INFO') ? "NEW" : "UPDATE", this.overallCookieInterface.GetUserId()).then(
      (data) => {
        let newId = <number>data;

        if (this.tempPersonList.length == 0) {
          this.inviteExternalUser = false;
          this.selectedRoom = this.chatRoom;
          this.selectedRoom!.Id = newId;
          this.CloseComponent.emit(true);
        } else {
          for (let j = 0; j < this.tempPersonList.length; j++) {
            this.tempPersonList[j].RoomId = newId;
            // Calling the model
            this.chatModel.SetAllTempPerson(this.tempPersonList[j], "NEW").then(
              (data) => {
                this.inviteExternalUser = false;
              }
            );
          }
          this.selectedRoom = this.chatRoom;
          this.selectedRoom!.Id = newId;
          // Getting the temp person list
          this.GetTempPersonList();
          this.CloseComponent.emit(true);
          // End of Calling the model
        }

      }
    );
    // End of Calling the model
  }

  // On click event of invite external user
  inviteExternalUserOnClick() {
    // Initialize the user details object
    this.userDetails = {
      UserId: 0,
      FirstName: '',
      LastName: '',
      Email: "",
      Password: "1234",
      BuilderCompanyName: '',
      ContactNumber: '',
      UserType: "SP",
      RoleId: this.userRoleList[0].value,
      AddressDetails: {
        Id: 0,
        AddressTypeId: 1,
        City: '',
        CountryId: 0,
        PostCode: '',
        State: '',
        StreetAddress: ''
      },
      Avatar: '',
      ProjectEndDate: new Date(),
      ProjectStartDate: new Date(),
      RoleCode: '',
      RoleName: '',
      TotalRecords: 0,
      CreatorId: 0,
      TempDisabled: false
    };
    this.inviteExternalUser = true;
  }

  // On click function cancel invitee
  cancelInvitee() {
    this.inviteExternalUser = false;
  }

  // On click function save invitee
  saveInvitee() {
    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if the error messages length

    // Calling the model to check if the email already exists
    this.authenticationModel.CheckEmailExistsWithUserType(this.userDetails.Email, "SP").then(
      (data) => {
        // Getting the email validation
        let emailExists: boolean = <boolean>data;

        if (emailExists) {
          this.inviteeAlreadyExists = true;
        } else {
          this.inviteeAlreadyExists = false;
          let tempPerson: TempPerson = {
            Id: 0,
            Email: this.userDetails.Email,
            FullName: this.userDetails.FirstName + ' ' + this.userDetails.LastName,
            OwnerId: this.overallCookieInterface.GetUserId(),
            RoleId: this.userDetails.RoleId,
            RoomId: this.chatRoom?.Id!,
            RoomName: this.chatRoom.RoomName,
            RoomNType: (this.chatRoom.ChatRoomTypeId == 1) ? "Individual" : "Group",
            ClientId: this.selectedClientId
          };

          this.tempPersonList.push(tempPerson);
          this.inviteExternalUser = false;
        }
      });


    // Calling the model
    // this.chatModel.SetAllTempPerson(tempPerson, "NEW").then(
    //   (data) => {
    //     this.inviteExternalUser = false;
    //     // Getting the temp person list
    //     this.GetTempPersonList();
    //   }
    // );
    // End of Calling the model

  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the first name exists
    if (!(this.userDetails.FirstName && this.userDetails.FirstName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$FIRST$NAME',
          ErrorMessage: 'First name is mandatory'
        }
      );
    }
    // End of Check if the first name exists

    // Check if the last name exists
    if (!(this.userDetails.LastName && this.userDetails.LastName != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$LAST$NAME',
          ErrorMessage: 'Last name is mandatory'
        }
      );
    }
    // End of Check if the last name exists

    // Check if the last name exists
    if (!(this.userDetails.Email && this.userDetails.Email != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$EMAIL',
          ErrorMessage: 'Email is mandatory'
        }
      );
    }
    // End of Check if the last name exists

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
}
