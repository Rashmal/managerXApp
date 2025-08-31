import { Subscription } from "rxjs";
import { ChatService } from "../services/chat.service";
import { ChatRoom } from "../core/chatRoom";
import { Filter } from "../../main_containers/core/filter";
import { ChatMessage } from "../core/chatMessage";
import { TempPerson } from "../core/tempPerson";

export class ChatModel {
    //Store subscriptions
    allSubscriptions: Subscription[] = [];

    // Constructor
    constructor(private chatService: ChatService) {

    }

    // Unsubscribe all
    UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // Setting the chat room
    SetChatRoom(chatRoom: ChatRoom, actionType: string, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.SetChatRoom(chatRoom, actionType, personId).subscribe(
                data => {
                    let returnData = <number>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the chat rooms
    GetChatRoomList(filter: Filter, personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.GetChatRoomList(filter, personId).subscribe(
                data => {
                    let returnData = <ChatRoom[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the all the chat list
    GetAllChatList(roomId: number, pageIndex: number, pageSize: number, userId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.GetAllChatList(roomId, pageIndex, pageSize, userId).subscribe(
                data => {
                    let returnData = <ChatMessage[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    //Setting the all the temp persons
    SetAllTempPerson(tempPerson: TempPerson, actionType: string) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.SetAllTempPerson(tempPerson, actionType).subscribe(
                data => {
                    let returnData = <boolean>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the all the temp persons
    GetAllTempPersonList(roomId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.GetAllTempPersonList(roomId).subscribe(
                data => {
                    let returnData = <TempPerson[]>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the temp person details based on Id
    GetTempPersonById(tempPersonId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.GetTempPersonById(tempPersonId).subscribe(
                data => {
                    tempPersonId
                    let returnData = <TempPerson>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }

    // Getting the not read count
    GetUnreadCount(personId: number) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.chatService.GetUnreadCount(personId).subscribe(
                data => {
                    let returnData = <number>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }
}