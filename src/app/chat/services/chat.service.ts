import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../login_registration/core/apiConfigurations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatRoom } from '../core/chatRoom';
import { catchError, of } from 'rxjs';
import { ErrorMessage } from '../../login_registration/core/errorMessage';
import { Filter } from '../../main_containers/core/filter';
import * as signalR from '@microsoft/signalr';
import { ChatMessage } from '../core/chatMessage';
import { ChatMessageFiles } from '../core/chatMessageFiles';
import { ChatRoomMembers } from '../core/chatRoomMembers';
import { TempPerson } from '../core/tempPerson';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  // API Urls
  private SetChatRoomUrl = API$DOMAIN + 'api/Chat/SetChatRoom';
  private GetChatRoomListUrl = API$DOMAIN + 'api/Chat/GetChatRoomList';
  private GetAllChatListUrl = API$DOMAIN + 'api/Chat/GetAllChatList';
  private SetAllTempPersonUrl = API$DOMAIN + 'api/Chat/SetAllTempPerson';
  private GetAllTempPersonListUrl = API$DOMAIN + 'api/Chat/GetAllTempPersonList';
  private GetTempPersonByIdUrl = API$DOMAIN + 'api/Chat/GetTempPersonById';
  private GetUnreadCountUrl = API$DOMAIN + 'api/Chat/GetUnreadCount';

  // Constructor
  constructor(private http: HttpClient, private router: Router) {

  }



  // SignalR related methods
  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(API$DOMAIN + 'chatHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.error('Error while starting connection: ' + err));
  }

  joinRoom(roomId: number): void {
    this.hubConnection.invoke('JoinRoom', roomId).catch(err => console.error(err));
  }

  leaveRoom(roomId: number): void {
    this.hubConnection.invoke('LeaveRoom', roomId).catch(err => console.error(err));
  }

  joinChatPage(personId: number): void {
    this.hubConnection.invoke('JoinChatPage', personId).catch(err => console.error(err));
  }

  leaveChatPage(personId: number): void {
    this.hubConnection.invoke('LeaveChatPage', personId).catch(err => console.error(err));
  }

  joinChatPageComponent(personId: number): void {
    this.hubConnection.invoke('JoinChatPageComponent', personId).catch(err => console.error(err));
  }

  leaveChatPageComponent(personId: number): void {
    this.hubConnection.invoke('LeaveChatPageComponent', personId).catch(err => console.error(err));
  }

  JoinMasterPageComponent(personId: number): void {
    this.hubConnection.invoke('JoinMasterPageComponent', personId).catch(err => console.error(err));
  }

  LeaveMasterPageComponent(personId: number): void {
    this.hubConnection.invoke('LeaveMasterPageComponent', personId).catch(err => console.error(err));
  }

  RefreshChatRoomsAsync(personIdList: ChatRoomMembers[]): void {
    this.hubConnection.invoke('RefreshChatRoomsAsync', personIdList).catch(err => console.error(err));
  }

  onRefreshChatRoomsReceived(callback: () => void): void {
    this.hubConnection.on('UpdateChatRooms', callback);
  }

  onRefreshMasterRoomsReceived(callback: () => void): void {
    this.hubConnection.on('UpdateMasterRooms', callback);
  }


  onMessageChatPageReceived(callback: (notificationMessage: string) => void): void {
    this.hubConnection.on('ReceiveChatPageMessage', callback);
  }

  SetChatRoomNotificationAsync(userId: number, ownerId: number, roomName: string, roomType: number, chatMessage: string): void {
    this.hubConnection.invoke('SetChatRoomNotificationAsync', userId, ownerId, roomName, roomType, chatMessage).catch(err => console.error(err));
  }

  sendMessage(roomId: number, sender: number, message: string, messageFiles: ChatMessageFiles[]): void {
    const serializedFiles = messageFiles.map(file => ({
      Name: file.Name,
      FileType: file.FileType,
      LocalPath: file.LocalPath,
      Id: 0
    }));

    this.hubConnection.invoke('SendMessageToRoomAsync', roomId, sender, message, serializedFiles).catch(err => console.error(err));
  }

  onMessageReceived(callback: (roomId: number, sender: number, message: string, addedDate: Date, messageId: number, messageFiles: ChatMessageFiles[]) => void): void {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  onMasterMessageReceived(callback: () => void): void {
    this.hubConnection.on('MasterReceiveMessage', callback);
  }
  // End of SignalR related methods

  // Getting the all the chat list
  GetAllChatList(roomId: number, pageIndex: number, pageSize: number, userId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("roomId", roomId.toString())
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("userId", userId.toString());

    return this.http.get<ChatMessage[]>(this.GetAllChatListUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('Setting', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the chat rooms
  GetChatRoomList(filter: Filter, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("personId", personId.toString());

    return this.http.post<ChatRoom[]>(this.GetChatRoomListUrl, filter, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetChatRoomList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Setting the chat room
  SetChatRoom(chatRoom: ChatRoom, actionType: string, personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString())
      .set("personId", personId.toString());

    return this.http.post<number>(this.SetChatRoomUrl, chatRoom, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetChatRoom', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  //Setting the all the temp persons
  SetAllTempPerson(tempPerson: TempPerson, actionType: string) {
    // Setting the params
    let my_params = new HttpParams()
      .set("actionType", actionType.toString());

    return this.http.post<boolean>(this.SetAllTempPersonUrl, tempPerson, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('SetAllTempPerson', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the all the temp persons
  GetAllTempPersonList(roomId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("roomId", roomId.toString());

    return this.http.get<TempPerson[]>(this.GetAllTempPersonListUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetAllTempPersonList', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the temp person details based on Id
  GetTempPersonById(tempPersonId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("tempPersonId", tempPersonId.toString());

    return this.http.get<TempPerson>(this.GetTempPersonByIdUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetTempPersonById', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  // Getting the not read count
  GetUnreadCount(personId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set("personId", personId.toString());

    return this.http.get<number>(this.GetUnreadCountUrl, { params: my_params }).pipe(
      catchError((error) => {
        this.handleError('GetUnreadCount', error)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }

  //----------- Common methods------------------//
  //The function of handling the error
  private handleError(methodName: string, exception: any) {
    // Creating the error message object 
    let errorMessage: ErrorMessage = {
      Name: exception.name,
      Message: exception.message,
      StatusText: exception['statusText'],
      Url: exception['url'].toString()
    };
    // Redirect to the error message
    this.router.navigate(['errorMessage'], { state: { response: errorMessage } });
  }
}
