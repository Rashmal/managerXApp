import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ChatMessage } from '../../core/chatMessage';
import { ChatModel } from '../../models/chatModel';
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { ChatService } from '../../services/chat.service';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { ChatMessageFiles } from '../../core/chatMessageFiles';
import { ChatRoom } from '../../core/chatRoom';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertBoxComponent } from '../../../main_containers/alert-box/alert-box.component';
import { DeleteConfirmationComponent } from '../../../main_containers/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
  providers: [DialogService],
  standalone: false
})
export class MessageListComponent implements OnDestroy {
  @Input() CurrentRoomId: number = 0;
  @Input() selectedRoom!: ChatRoom | null;
  @Input() viewAllArchiveList: boolean = false;

  @Output() editChatRoom = new EventEmitter<any>();

  chatMessageList: ChatMessage[] = [];
  chatModel!: ChatModel;
  overallCookieInterface: OverallCookieInterface;
  newMessage: string = "";
  pageIndex: number = 0;
  pageSize: number = 20;
  isLoading: boolean = false;
  // Store the file
  fileList: File[] = [];
  // Store the message files
  messageFiles: ChatMessageFiles[] = [];
  selectedImageUrl: string | null = null;
  emojiPickerVisible: boolean = false;

  constructor(private chatService: ChatService, public dialogService: DialogService) {
    this.chatModel = new ChatModel(this.chatService);
    this.overallCookieInterface = new OverallCookieModel();
  }

  ngOnInit() {
    this.chatService.joinRoom(this.CurrentRoomId);

    this.chatService.onMessageReceived((roomId, sender, message, addedDate, messageId, messageFiles) => {
      const serializedFiles = messageFiles.map((file: any) => ({
        Name: file['name'],
        FileType: file['fileType'],
        LocalPath: file['localPath'],
        Id: file['id']
      }));

      if (this.CurrentRoomId === roomId) {
        this.chatMessageList = [
          ...this.chatMessageList,
          {
            Id: messageId,
            AddedDate: addedDate,
            Message: message,
            ReadByIdList: '',
            RoomId: roomId,
            SenderId: sender,
            SenderAvatar: this.overallCookieInterface.GetUserAvatar(),
            SenderName: this.overallCookieInterface.GetUserFullName(),
            ChatFileList: serializedFiles
          },
        ];
      }
    });

    this.loadInitialMessages();
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.CurrentRoomId);
  }

  async loadInitialMessages() {
    this.chatMessageList = [];
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      this.pageIndex = 0;
      const messages: any = await this.chatModel.GetAllChatList(this.CurrentRoomId, this.pageIndex, this.pageSize, this.overallCookieInterface.GetUserId());
      this.chatMessageList = messages;
      //this.pageIndex++;
    } finally {
      this.isLoading = false;
    }
  }

  async loadNextMessages() {
    this.pageIndex++;
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const messages: any = await this.chatModel.GetAllChatList(this.CurrentRoomId, this.pageIndex, this.pageSize, this.overallCookieInterface.GetUserId());
      if (messages.length > 0) {
        this.chatMessageList = [...this.chatMessageList, ...messages];
        //this.chatMessageList.push(messages);
        this.chatService.RefreshChatRoomsAsync(this.selectedRoom?.ChatRoomMembersList!);
      }
    } finally {
      this.isLoading = false;
    }
  }

  sendMessageOnClick(event: any) {
    event.preventDefault(); // Prevents a new line from being added
    if (this.CurrentRoomId && (this.newMessage.trim() || this.messageFiles.length > 0)) {
      const encodedMessage = encodeURIComponent(this.newMessage); // URI encode the message
      const messageSize = new Blob([encodedMessage]).size; // Get message size in bytes

      let totalFileSize = 0;
      this.messageFiles.forEach(file => {
        const base64Length = file.LocalPath.length - file.LocalPath.indexOf(',') - 1; // Extract base64 data length
        const fileSizeInBytes = (base64Length * 3) / 4; // Convert base64 size to actual file size
        totalFileSize += fileSizeInBytes;
      });

      const maxMessageSize = 500000; // 32KB (default SignalR limit)

      if (messageSize + totalFileSize > maxMessageSize) {
        alert("Total message size (including attachments) exceeds the 32KB limit. Reduce message or file size.");
        return;
      }

      this.chatService.sendMessage(this.CurrentRoomId, this.overallCookieInterface.GetUserId(), encodedMessage, this.messageFiles);
      this.newMessage = '';
      this.messageFiles = [];

      this.chatService.RefreshChatRoomsAsync(this.selectedRoom?.ChatRoomMembersList!);
      this.emojiPickerVisible = false;
    }
  }

  GetChatRoomLogoLetters(roomName: string) {
    const splittedList = roomName.split(" ");
    return splittedList.length >= 2
      ? `${splittedList[0][0]}${splittedList[1][0]}`
      : `${splittedList[0][0]}${splittedList[0][0]}`;
  }

  onScroll(event: any): void {
    const target = event.target as HTMLElement;
    // console.log("target.scrollTop" + target.scrollTop);
    const isScrolledToTop = target.scrollTop === 0;
    if (isScrolledToTop) {
      this.loadInitialMessages();
    }

    const isScrolledToBottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    // console.log("isScrolledToBottom" + (target.scrollHeight - target.scrollTop));
    // console.log("target.clientHeight" + (target.clientHeight));

    if (isScrolledToBottom) {
      this.loadNextMessages();
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
    const fileInput = event.target as HTMLInputElement;
    const file = event.target.files[0];
    if (file) {
      let attachmentName = file.name;
      let attachmentType = (file.type.split('/')[1] || '');

      // Using FileReader to read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1]; // Extract base64 part of the data URL
        //console.log('Base64 Data:', base64Data);

        // Adding the file details
        this.messageFiles.push({
          Id: 0,
          FileType: attachmentType,
          LocalPath: 'data:image/' + attachmentType + ';base64, ' + base64Data,
          Name: attachmentName
        });

        // Reset file input to allow selecting the same file again
        fileInput.value = '';
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(file);
    }
  }

  // Remove image
  removeImageOnClick(index: number) {
    this.messageFiles.splice(index, 1);
  }

  // On click function of header options
  roomOptionsOnClick(type: string) {
    // Check the type of click
    switch (type) {
      case 'VIEW_INFO':
        this.editChatRoom.emit({
          Param1: type,
          Param2: this.selectedRoom
        });
        break;
      case 'EDIT_ROOM':
        this.editChatRoom.emit({
          Param1: type,
          Param2: this.selectedRoom
        });
        break;
      case 'DELETE_CHAT':
        // Open popup to select user roles
        let ref = this.dialogService.open(DeleteConfirmationComponent, {
          showHeader: false,
          width: '22%',
          data: {
          }
        });
        // Perform an action on close the popup
        ref.onClose.subscribe((data: any) => {
          if (data) {
            // Calling the model
            this.chatModel.SetChatRoom(this.selectedRoom!, "REMOVE", this.overallCookieInterface.GetUserId()).then(
              (data) => {
                this.editChatRoom.emit({
                  Param1: "CLOSE"
                });
              }
            );
            // End of Calling the model
          }
        });
        break;
      case 'ARCHIVE_CHAT':
        // Calling the model
        this.chatModel.SetChatRoom(this.selectedRoom!, "ARCHIVE_CHAT", this.overallCookieInterface.GetUserId()).then(
          (data) => {
            this.editChatRoom.emit({
              Param1: "CLOSE"
            });
          }
        );
        // End of Calling the model
        break;
      case 'UNARCHIVE_CHAT':
        // Calling the model
        this.chatModel.SetChatRoom(this.selectedRoom!, "UNARCHIVE_CHAT", this.overallCookieInterface.GetUserId()).then(
          (data) => {
            this.editChatRoom.emit({
              Param1: "CLOSE"
            });
          }
        );
        // End of Calling the model
        break;
      case 'LEAVE_CHAT':
        // Open popup to select user roles
        let refLeave = this.dialogService.open(DeleteConfirmationComponent, {
          showHeader: false,
          width: '22%',
          data: {
          }
        });
        // Perform an action on close the popup
        refLeave.onClose.subscribe((data: any) => {
          if (data) {
            // Calling the model
            this.chatModel.SetChatRoom(this.selectedRoom!, "LEAVE_CHAT", this.overallCookieInterface.GetUserId()).then(
              (data) => {
                this.editChatRoom.emit({
                  Param1: "CLOSE"
                });
              }
            );
            // End of Calling the model
          }
        });
        break;
    }
    // End of Check the type of click
  }

  previewImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  closePreview(): void {
    this.selectedImageUrl = null;
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(event: any) {
    this.newMessage += event.emoji.native;
    // this.emojiPickerVisible = false;
  }

  closeEmoji() {
    this.emojiPickerVisible = false;
  }

  decodeMessage(message: string) {
    const decodedMessage = decodeURIComponent(message);
    return decodedMessage;
  }
}
