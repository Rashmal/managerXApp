import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { ChatModel } from '../../models/chatModel';
import { ChatService } from '../../services/chat.service';
import { ChatRoom } from '../../core/chatRoom';
import { Filter } from '../../../main_containers/core/filter';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';

@Component({
  selector: 'app-chat-master',
  templateUrl: './chat-master.component.html',
  styleUrl: './chat-master.component.scss',
  standalone: false
})
export class ChatMasterComponent {
  @Input() selectedClientId: number = 0;
  // Store the current selected tab
  currentSelectedChatTab: string = "ALL";
  // Store the current width state
  isFullScreen: boolean = false;
  // Store the current chat state
  currentChatState: string = "OVERALL";
  // Store the admin model
  adminModel!: AdminModel;
  // Store the model
  chatModel!: ChatModel;
  // Store the ChatRoom list for My
  myChatRoomList: ChatRoom[] = [];
  // Store the ChatRoom list for Group
  groupChatRoomList: ChatRoom[] = [];
  // Store the ChatRoom list for All
  allChatRoomList: ChatRoom[] = [];
  // Store the current  filter object
  myChatRoomFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: false,
    SortCol: "IND"
  };
  groupChatRoomFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: false,
    SortCol: "GRP"
  };
  allChatRoomFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: false,
    SortCol: "ALL"
  };
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Store the selected room id
  selectedRoomId: number = 0;
  selectedRoom!: ChatRoom | null;
  // Store the chatRoomFilter
  chatRoomFilter: string = "";
  selectedType: string = "";
  // store view all archive list
  viewAllArchiveList: boolean = false;
  // Store chat full screen
  chatFullScreen: boolean = false;

  constructor(private adminService: AdminService, private chatService: ChatService) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.chatModel = new ChatModel(this.chatService);
    this.overallCookieInterface = new OverallCookieModel();
  }
  //store logged user id
  loggedUserId: number = 0;

  ngOnInit() {
    // Getting all the list
    this.GetChatRoomList('IND');
    this.GetChatRoomList('GRP');

    // Retrieve the user ID from the cookie interface
    const userId = this.overallCookieInterface.GetUserId();

    // Check if the retrieved user ID is a negative value
    if (userId < 0) {
      // If user ID is negative, treat it as a ghost user and assign -1
      // Ghost users are internally represented with ID -1
      this.loggedUserId = -1;
    } else {
      // If user ID is valid (0 or positive), assign it directly
      this.loggedUserId = userId;
    }

    // Join the chat page using the processed user ID (either actual or ghost)
    this.chatService.joinChatPageComponent(this.loggedUserId);


    //this.chatService.startConnection();

    this.chatService.onRefreshChatRoomsReceived(() => {
      // Getting all the list
      this.GetChatRoomList(this.currentSelectedChatTab);
    });

  }




  ngOnDestroy() {
    this.chatService.leaveChatPageComponent(this.loggedUserId);
  }

  // Toggle full screen
  toggleFullScreen() {
    this.chatFullScreen = !this.chatFullScreen;
  }

  // Getting all the list
  GetChatRoomList(roomType: string) {
    let filter: Filter;
    switch (roomType) {
      case 'ALL':
        filter = this.allChatRoomFilter;
        break;
      case 'IND':
        filter = this.myChatRoomFilter;
        break;
      case 'GRP':
        filter = this.groupChatRoomFilter;
        break;
      default:
        filter = this.allChatRoomFilter;
    }

    if (roomType == 'ALL') {
      this.myChatRoomFilter.SortAsc = this.viewAllArchiveList;
      // Calling the model
      this.chatModel.GetChatRoomList(this.myChatRoomFilter, this.loggedUserId).then(
        (data) => {
          this.myChatRoomList = <ChatRoom[]>data;
        }
      );
      // End of Calling the model
      // Calling the model
      this.groupChatRoomFilter.SortAsc = this.viewAllArchiveList;
      this.chatModel.GetChatRoomList(this.groupChatRoomFilter, this.loggedUserId).then(
        (data) => {
          this.groupChatRoomList = <ChatRoom[]>data;
        }
      );
      // End of Calling the model
    } else {
      filter.SortAsc = this.viewAllArchiveList;
      // Calling the model
      this.chatModel.GetChatRoomList(filter, this.loggedUserId).then(
        (data) => {
          switch (roomType) {
            case 'ALL':
              this.allChatRoomList = <ChatRoom[]>data;
              break;
            case 'IND':
              this.myChatRoomList = <ChatRoom[]>data;
              break;
            case 'GRP':
              this.groupChatRoomList = <ChatRoom[]>data;
              break;
            default:
              this.allChatRoomList = <ChatRoom[]>data;
          }
        }
      );
      // End of Calling the model
    }
  }

  // On change event of the paginator
  onChangePaginator(event: any, displayType: string) {
    switch (displayType) {
      case 'ALL':
        this.allChatRoomFilter.CurrentPage = event.page + 1;
        this.allChatRoomFilter.SearchQuery = this.chatRoomFilter;
        this.myChatRoomFilter.CurrentPage = event.page + 1;
        this.myChatRoomFilter.SearchQuery = this.chatRoomFilter;
        this.groupChatRoomFilter.CurrentPage = event.page + 1;
        this.groupChatRoomFilter.SearchQuery = this.chatRoomFilter;
        // Getting all the list
        this.GetChatRoomList("ALL");
        break;
      case 'IND':
        this.myChatRoomFilter.CurrentPage = event.page + 1;
        this.myChatRoomFilter.SearchQuery = this.chatRoomFilter;
        // Getting all the list
        this.GetChatRoomList("IND");
        break;
      case 'GRP':
        this.groupChatRoomFilter.CurrentPage = event.page + 1;
        this.groupChatRoomFilter.SearchQuery = this.chatRoomFilter;
        // Getting all the list
        this.GetChatRoomList("GRP");
        break;
      default:
        this.allChatRoomFilter.CurrentPage = event.page + 1;
        this.allChatRoomFilter.SearchQuery = this.chatRoomFilter;
        // Getting all the list
        this.GetChatRoomList("ALL");
    }
  }

  // On click event of the chat tab
  onClickChatTab(selection: string) {
    this.chatRoomFilter = "";
    this.currentSelectedChatTab = selection;
    this.allChatRoomFilter.CurrentPage = 1;
    // Getting all the list
    this.GetChatRoomList(this.currentSelectedChatTab);
  }

  // On toggle the archive
  toggleArchive() {
    this.viewAllArchiveList = !this.viewAllArchiveList;
    // Getting all the list
    this.GetChatRoomList(this.currentSelectedChatTab);
  }

  // On click event of toggle menu
  toggleSideMenu() {
    this.isFullScreen = !this.isFullScreen;
  }

  // On click event of create new chat room
  createNewChatRoom() {
    this.selectedRoomId = 0;
    this.selectedRoom = null;
    this.selectedType = 'CREATE_INFO';
    this.currentChatState = 'CREATE$ROOM';
  }

  // On emit function of close component
  CloseComponent(event: any) {
    this.currentChatState = 'OVERALL';
    if (event) {
      // Getting all the list
      this.GetChatRoomList('IND');
      this.GetChatRoomList('GRP');
    }
  }

  // Getting the logo letter for chat rooms
  GetChatRoomLogoLetters(roomName: string) {
    // Declare the variable
    let lettersVar = "";
    // Split by the name
    let splittedList = roomName.split(" ");

    // Check if the length is greater than 2
    if (splittedList.length >= 2) {
      lettersVar = splittedList[0][0] + "" + splittedList[1][0];
    } else {
      lettersVar = splittedList[0][0] + "" + splittedList[0][0];
    }
    // End of Check if the length is greater than 2

    return lettersVar;
  }

  // On click event of select chat room
  selectChatRoomOnClick(chatRoom: ChatRoom) {
    this.currentChatState = 'OVERALL';
    this.selectedRoomId = 0;
    setTimeout(() => {
      // Setting the side panel visible
      this.selectedRoomId = chatRoom.Id;
      this.selectedRoom = chatRoom;
      this.chatService.RefreshChatRoomsAsync(this.selectedRoom?.ChatRoomMembersList!);
    }, 1)
  }

  // On emit function of edit chat room
  editChatRoom(event: any) {
    this.currentChatState = 'OVERALL';
    this.selectedRoomId = 0;
    setTimeout(() => {
      // Check the type of click
      switch (event.Param1) {
        case 'VIEW_INFO':
          this.selectedType = event.Param1;
          this.selectedRoom = event.Param2;
          // End of Check the type of click
          this.currentChatState = 'CREATE$ROOM';
          break;
        case 'EDIT_ROOM':
          this.selectedType = event.Param1;
          this.selectedRoom = event.Param2;
          // End of Check the type of click
          this.currentChatState = 'CREATE$ROOM';
          break;
        case "CLOSE":
          this.currentChatState = 'OVERALL';
          this.chatRoomFilter = "";
          this.allChatRoomFilter.CurrentPage = 1;
          // Getting all the list
          this.GetChatRoomList(this.currentSelectedChatTab);
          break;
      }

    }, 1)
  }

  // Making a deep copy
  deep<T extends object>(source: T): T {
    if (source) {
      return JSON.parse(JSON.stringify(source))
    }
    return source;
  }
}
