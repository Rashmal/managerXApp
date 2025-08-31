import { Component, Input } from '@angular/core';
import { AdminModel } from '../../../admin/models/adminModel';
import { AdminService } from '../../../admin/services/admin.service';
import { DatePipe } from '@angular/common';
import { ProjectDetails } from '../../../admin/core/projectDetails';
import { ContractorModel } from '../../models/contractorModel';
import { ContractorService } from '../../services/contractor.service';
import { AssignedTaskMoreDetails } from '../../core/assignedTaskMoreDetails';
import { CalendarOptions } from '@fullcalendar/core'; // Import FullCalendar core options
import dayGridPlugin from '@fullcalendar/daygrid'; // Import FullCalendar day grid plugin
import interactionPlugin from '@fullcalendar/interaction'; // Import FullCalendar interaction plugin
import { OverallCookieInterface } from '../../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../../login_registration/core/overallCookieModel';
import { ProjectManagerModel } from '../../../project_manager/models/projectManagerModel';
import { ProjectManagerService } from '../../../project_manager/services/project-manager.service';

@Component({
  selector: 'app-contractor-calendar',
  templateUrl: './contractor-calendar.component.html',
  styleUrl: './contractor-calendar.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class ContractorCalendarComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
  // Declare the admin model
  adminModel: AdminModel;
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the basic project details
  projectDetails: ProjectDetails = {
    Id: 0,
    Address: '',
    BuilderCompany: '',
    DeliveryDate: new Date(),
    Owner: '',
    ProjectDuration: '',
    StartDate: new Date(),
    CreatedId: 0
  };
  // Store the search query
  searchQuery: string = "";
  // Store the calendar task details list
  calendarTaskDetailsList: AssignedTaskMoreDetails[] = [];
  // Calendar options for FullCalendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek', // Set initial view to week grid
    headerToolbar: {
      start: 'title', // Title on the left
      center: '', // Center section empty
      end: 'prev today next', // Navigation buttons on the right
    },
    plugins: [dayGridPlugin, interactionPlugin], // Include necessary plugins
    dateClick: (arg) => this.handleDateClick(arg), // Handle date click events
    events: [], // Initialize with no events
    dayHeaderContent: (arg) => {
      // Create a container for the header
      const container = document.createElement('div');
      container.classList.add('custom-day-header');

      // Add day name
      const dayName = document.createElement('div');
      dayName.classList.add('day-name');
      dayName.textContent = arg.text.split(' ')[0]; // Extract day name only (e.g., "Sun")
      container.appendChild(dayName);


      // Add date number
      const dateNumber = document.createElement('div');
      dateNumber.classList.add('day-number');
      const date = new Date(arg.date);
      const dateStr = date.getDate().toString();
      dateNumber.textContent = dateStr;

      // Highlight today's date
      if (date.toDateString() === new Date().toDateString()) {
        dateNumber.classList.add('today');
      }

      container.appendChild(dateNumber);

      return { domNodes: [container] };
    },
    eventContent: (arg) => {
      const { event } = arg;
      const { subStageCategoryDetailsName, stageName, address, taskcheck, taskId, statusCode } = event.extendedProps;
      const eventContentContainer = document.createElement('div');
      eventContentContainer.classList.add('event-content'); // Add CSS class for styling

      // Determine the background color based on taskcheck and current date
      const isToday = new Date().toISOString().split('T')[0] === event.startStr;
      let backgroundColor = taskcheck ? '#f5fffb' : '#F0F3F8';
      let color = taskcheck ? '#959696' : '#070807';

      if (isToday) {
        backgroundColor = '#0c66c5'; // Blue color for current date
        color = '#ffffff'; // White text color for better contrast on blue background
      } else {
        backgroundColor = '#cfded8'; // Blue color for current date
      }

      // Apply background color
      eventContentContainer.style.backgroundColor = backgroundColor;
      eventContentContainer.style.color = color;
      eventContentContainer.style.marginBottom = '4px';

      // Set the inner HTML for the event content
      if (this.getCreatorId(taskId) == this.overallCookieInterface.GetUserId() || this.loggedUserId < 0) {
        eventContentContainer.innerHTML = `
        <div class="event-address">${address}</div>
        <div class="event-stage" style='font-size:7pt'>${subStageCategoryDetailsName} | ${stageName}</div>
        <div style='display:flex;align-items:center'>
          <input type="checkbox" id="checkbox-${taskId}" ${taskcheck ? 'checked' : ''}>
          <b style='padding-left:7px' class="${statusCode}">${event.title}</b>
        </div>
      `;
      } else {
        eventContentContainer.innerHTML = `
        <div class="event-address">${address}</div>
        <div class="event-stage" style='font-size:7pt'>${subStageCategoryDetailsName} | ${stageName}</div>
        <div style='display:flex;align-items:center'>
          <input type="checkbox" id="checkbox-${taskId}" ${taskcheck ? 'checked' : ''}>
          <b style='padding-left:7px' class="${statusCode}">${event.title}</b>
        </div>
      `;
      }

      // Add event listener to the checkbox
      const checkbox = eventContentContainer.querySelector(`#checkbox-${taskId}`) as HTMLInputElement;
      checkbox.addEventListener('change', (e) => {
        this.toggleTaskCheck(taskId, e); // Call the Angular method
      });

      // Enable text wrapping
      eventContentContainer.style.wordWrap = 'break-word';
      eventContentContainer.style.whiteSpace = 'normal'; // Ensure normal whitespace behavior

      // Adjust width and font size
      eventContentContainer.style.width = '100%'; // Adjust width as needed
      eventContentContainer.style.fontSize = '12px'; // Adjust font size as needed

      return { domNodes: [eventContentContainer] };
    }
    ,
    // eventClick: this.handleEventClick.bind(this), // Bind 'this' context to handle event click
    eventBorderColor: 'transparent', // Set event border to transparent
  };
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Declare the pm model
  projectManagerModel: ProjectManagerModel;
  constructor(private adminService: AdminService, private datePipe: DatePipe,
    private contractorService: ContractorService, private projectManagerService: ProjectManagerService
  ) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    this.contractorModel = new ContractorModel(this.contractorService);
    this.overallCookieInterface = new OverallCookieModel();
    this.projectManagerModel = new ProjectManagerModel(this.projectManagerService);

  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();
    this.manageLoggedUserId();
  }
  //store logged user id
  loggedUserId: number = 0;

  //handle logged user id
  manageLoggedUserId() {
    if (this.overallCookieInterface.GetUserId() < 0) {
      this.loggedUserId = -1;
    } else {
      this.loggedUserId = this.overallCookieInterface.GetUserId();
    }
  }

  // Getting the creator id
  getCreatorId(taskId: number) {
    // Getting the index
    let indexObj = this.calendarTaskDetailsList.findIndex(obj => obj.Id == taskId);
    // Return
    return this.calendarTaskDetailsList[indexObj].CreatorId;
  }

  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the task details
        if (this.loggedUserId == -1) {
          this.GetAllTaskListContractor();
        } else {
          this.GetAllTaskList();
        }

      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the task details
  GetAllTaskList() {
    const hostname = window.location.hostname;
    let currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');

    if (hostname === 'localhost') {
      currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    } else {
      currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    }
    // Calling the model to retrieve the data
    this.contractorModel.GetAllTasksBasedDate(currentDate!, this.projectDetails.Id, this.loggedUserId, this.searchQuery).then(
      (data) => {
        // Getting the project details
        this.calendarTaskDetailsList = <AssignedTaskMoreDetails[]>data;
        // Transform tasks into FullCalendar events with date ranges and additional properties
        let calendarEvents = this.calendarTaskDetailsList.map(task => {
          // Parse the task's due date and add one day to make it inclusive
          const dueDate = new Date(task.DueDate);
          dueDate.setDate(dueDate.getDate() + 1); // Increment the due date by one day

          return {
            title: task.Name,
            start: new Date(task.AddedDate).toISOString(), // Convert to ISO string
            end: new Date(dueDate).toISOString(), // Use the incremented due date and convert to ISO string
            extendedProps: {
              taskId: task.Id, // Include task ID here
              subStageCategoryDetailsName: task.Category,
              stageName: task.SubStageName,
              address: task.FullAddress,
              taskcheck: (task.StatusCode == "COM"),
              statusCode: task.StatusCode
            }
          };
        });

        // Update calendarOptions with the new events
        this.calendarOptions = { ...this.calendarOptions, events: calendarEvents };
      }
    );
    // End of Calling the model to retrieve the data
  }



  // Getting all the task details
  GetAllTaskListContractor() {
    const hostname = window.location.hostname;
    let currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');

    if (hostname === 'localhost') {
      currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    } else {
      currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    }

    // Calling the model to retrieve the data
    this.projectManagerModel.GetAllTasksBasedDateForCalendar(currentDate!, this.projectDetails.Id, this.loggedUserId, this.searchQuery).then(
      (data) => {
        // Getting the project details
        this.calendarTaskDetailsList = <AssignedTaskMoreDetails[]>data;
        // Transform tasks into FullCalendar events with date ranges and additional properties
        let calendarEvents = this.calendarTaskDetailsList.map(task => {
          // Parse the task's due date and add one day to make it inclusive
          const dueDate = new Date(task.DueDate);
          dueDate.setDate(dueDate.getDate() + 1); // Increment the due date by one day

          return {
            title: task.Name,
            start: new Date(task.AddedDate).toISOString(), // Convert to ISO string
            end: new Date(dueDate).toISOString(), // Use the incremented due date and convert to ISO string
            extendedProps: {
              taskId: task.Id, // Include task ID here
              subStageCategoryDetailsName: task.Category,
              stageName: task.SubStageName,
              address: task.FullAddress,
              taskcheck: (task.StatusCode == "COM"),
              statusCode: task.StatusCode
            }
          };
        });

        // Update calendarOptions with the new events
        this.calendarOptions = { ...this.calendarOptions, events: calendarEvents };
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Handle event click in the calendar
  handleEventClick(arg: any) {
    const eventDate = new Date(arg.event.start); // Get the date of the clicked event
    const currentDate = new Date(); // Get the current date

    // Check if the event date matches the current date
    if (eventDate.toDateString() === currentDate.toDateString()) {
      const taskId = arg.event.extendedProps.taskId; // Get task ID from event
      //this.showTaskDetails(taskId); // Show task details
    } else {
      const taskId = arg.event.extendedProps.taskId; // Get task ID from event
      // this.showTaskDetails(taskId); // Show task details
      // Handle the case where the event does not belong to the current date
      // For example, you can display a message or perform a different action
      console.log('Event does not belong to the current date.');
    }
  }

  // Handle date click event in the calendar
  handleDateClick(arg: any) {
    const { event } = arg;
    const { subStageCategoryDetailsName, stageName, address } = event.extendedProps;
    // Handle the date click event logic here
  }

  toggleTaskCheck(taskId: any, event: any) {

    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    // Check if the checkbox is checked
    if (isChecked) {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, 3, this.loggedUserId).then(
        (data) => {
          // Getting all the task details
          if (this.loggedUserId == -1) {
            this.GetAllTaskListContractor();
          } else {
            this.GetAllTaskList();
          }
        }
      );
      // End of Calling the model to retrieve the data
    } else {
      // Calling the model to retrieve the data
      this.contractorModel.UpdateTaskStatus(taskId, 1, this.loggedUserId).then(
        (data) => {
          // Getting all the task details
          if (this.loggedUserId == -1) {
            this.GetAllTaskListContractor();
          } else {
            this.GetAllTaskList();
          }
        }
      );
      // End of Calling the model to retrieve the data
    }
    // End of Check if the checkbox is checked

    // this.taskDetails = {
    //   FK_SubStageCategoryDetailsId: 0,
    //   FK_StatusId: 0,
    //   TaskDetailsName: "",
    //   TaskDetailsDueDate: new Date(),
    //   TaskDetailStartedDate: new Date(),
    //   TaskDetailsDescription: "",
    //   IsDisable: false,
    //   TaskDetailsId: 0,
    //   TaskDetailsAddedDate: new Date(),
    //   TaskDetailsChecked: isChecked,
    //   ClientFirstName: "",
    //   ClientLastName: "",
    //   StatusDetailsName: "",
    //   StatusDetailsCode: "",
    //   ClientAvatar: '',
    //   TaskAttachmentDetailsCount: 0,
    //   SubStageCategoryDetailsName: '',
    //   StageName: '',
    //   StreetAddress: '',
    //   PostCode: '',
    //   City: '',
    //   State: '',
    //   PersonName: '',
    //   RoleName: ''
    // };

    // this.taskModel.ManageTaskDetailsServiceCall(this.taskDetails, taskId, '5').then(
    //   data => {
    //     let result = <string>data;
    //     if (result) {

    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated task status' });
    //     } else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update task status' });
    //     }
    //   });
  }
}
