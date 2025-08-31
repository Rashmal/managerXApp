import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatModel } from '../../models/chatModel';
import { ChatService } from '../../services/chat.service';
import { TempPerson } from '../../core/tempPerson';

@Component({
  selector: 'app-reject-person',
  templateUrl: './reject-person.component.html',
  styleUrl: './reject-person.component.scss',
  standalone: false
})
export class RejectPersonComponent {
  // Store the invite id
  inviteId: number | null = null;
  // Store the model
  chatModel!: ChatModel;
  // Store the temp person details
  tempPersonDetails!: TempPerson;

  // Constructor
  constructor(private route: ActivatedRoute, private chatService: ChatService,
    private router: Router
  ) {
    // Initialize the model
    this.chatModel = new ChatModel(this.chatService);
  }

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParamMap.subscribe(params => {
      this.inviteId = +params.get('inviteId')!;
      if (this.inviteId) {
        console.log('Invite ID:', this.inviteId);
        // Use inviteId to call APIs or perform other actions
        // Getting the temp person details
        this.GetTempPersonDetails(this.inviteId);
      } else {
        console.error('No invite ID provided in query parameters');
      }
    });
  }

  // Getting the temp person details
  GetTempPersonDetails(tempPersonId: number) {
    // Calling the model
    this.chatModel.GetTempPersonById(tempPersonId).then(
      (data) => {
        // Setting the temp person details
        this.tempPersonDetails = <TempPerson>data;

        // Calling the model to reject the invitation
        this.chatModel.SetAllTempPerson(this.tempPersonDetails, "UPDRJECT").then(
          (data) => {

          }
        );
        // End of Calling the model to reject the invitation
      }
    );
    // End of Calling the model
  }



}
