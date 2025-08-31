import { Component, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminModel } from '../../models/adminModel';
import { AdminService } from '../../services/admin.service';
import { CalendarOptions } from '@fullcalendar/core'; // Import FullCalendar core options
import dayGridPlugin from '@fullcalendar/daygrid'; // Import FullCalendar day grid plugin
import interactionPlugin from '@fullcalendar/interaction'; // Import FullCalendar interaction plugin
import { CalendarTaskDetails } from '../../core/calendarTaskDetails';
import { ProjectDetails } from '../../core/projectDetails';
import { DatePipe } from '@angular/common';
import { TaskDetails } from '../../core/taskDetails';
import { Filter } from '../../../main_containers/core/filter';
import { SubTaskDetails } from '../../core/subTaskDetails';
import { SubTaskNote } from '../../core/subTaskNote';
import { SelectItem } from 'primeng/api';
import { MultipleCalendarsList } from '../../core/multipleCalendarsList';

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class AdminCalendarComponent {
  // Input params
  @Input() SelectedClientId: number = 0;
  // Declare the admin model
  adminModel: AdminModel;
  // Store the search query
  searchQuery: string = "";
  // Store the calendar task details list
  calendarTaskDetailsList: CalendarTaskDetails[] = [];
  // Store the display task details
  displayTaskDetails!: TaskDetails;
  // Store display side panel
  isTaskDetailsVisible: boolean = false;
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
  // Store the display task sub tasks
  displaySubTasksFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the display task notes
  displayTaskNotesFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Store the display task attachments
  displayTaskAttachmentsFilter: Filter = {
    CurrentPage: 1,
    RecordsPerPage: 10,
    SearchQuery: '',
    SortAsc: true,
    SortCol: ""
  };
  // Calendar options for FullCalendar
  calendarOptions: CalendarOptions = {
    locale: {
      code: 'en',
      buttonText: {
        today: 'Go to Today', // Change "Today" to "Current Day"
        month: 'Month',
        week: 'Week',
        day: 'Day',
        list: 'List'
      }
    },
    initialView: 'dayGridMonth', // Set initial view to month grid
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    plugins: [dayGridPlugin, interactionPlugin], // Include necessary plugins
    dateClick: (arg) => this.handleDateClick(arg), // Handle date click events
    events: [], // Initialize with no events
    eventContent: (arg) => {
      const { event } = arg;
      const { subStageCategoryDetailsName, stageName, address, taskcheck, statusCode } = event.extendedProps;
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
      const iconClass = taskcheck ? 'fa-check-circle' : 'fa-check-circle-o';
      const iconColor = taskcheck ? '#A2D480' : '#a3a3a3';

      // Set the inner HTML for the event content
      eventContentContainer.innerHTML = `
        <div  class="event-stage" style="font-size: 7pt; ">${subStageCategoryDetailsName} | ${stageName}</div>
        <div style="margin-right: 10pt;" class="${statusCode}">
          <i class="fa ${iconClass} ${statusCode}" style="color: ${iconColor};font-size:12pt;padding-right:5px"></i>
          ${event.title}
        </div>
      `;

      return { domNodes: [eventContentContainer] };
    },
    eventClick: this.handleEventClick.bind(this), // Bind 'this' context to handle event click
    eventBorderColor: 'transparent', // Set event border to transparent
  };

  // Store display months per view
  displayMonthsPerView: SelectItem[] = [
    {
      value: 1,
      label: '1'
    },
    {
      value: 2,
      label: '2'
    },
    {
      value: 3,
      label: '3'
    },
    {
      value: 6,
      label: '6'
    },
    {
      value: 9,
      label: '9'
    },
    {
      value: 12,
      label: '12'
    },
    {
      value: 24,
      label: '24'
    }
  ];
  // Store display months
  displayMonths: number = 1;
  // Store the list of calendars
  multipleCalendarsList: MultipleCalendarsList[] = [];

  constructor(private adminService: AdminService, private datePipe: DatePipe) {
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
  }

  ngOnInit() {
    // Getting the basic project details
    this.GetBasicProjectDetails();
  }

  // On change event of months per view
  onChangeMonthsPerView(monthsList: number) {
    this.multipleCalendarsList = [];
    const today = new Date(); // Get today's date

    for (let i = 1; i <= monthsList; i++) {
      // Calculate the first day of each month dynamically
      const startDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const formattedDate = startDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

      this.multipleCalendarsList.push({
        CalendarOptions: {
          contentHeight: 850, // scrollable height area
          

          locale: {
            code: 'en',
            buttonText: {
              today: 'Go to Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              list: 'List'
            }
          },
          initialView: 'dayGridMonth', // Month grid view
          initialDate: formattedDate, // Set each calendar to start from a different month
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          },
          plugins: [dayGridPlugin, interactionPlugin], // Include necessary plugins
          dateClick: (arg) => this.handleDateClick(arg),
          events: [],
          eventContent: (arg) => {
            const { event } = arg;
            const { subStageCategoryDetailsName, stageName, taskcheck, statusCode } = event.extendedProps;
            const eventContentContainer = document.createElement('div');
            eventContentContainer.classList.add('event-content');

            // Determine the background color based on taskcheck and current date
            const isToday = new Date().toISOString().split('T')[0] === event.startStr;
            let backgroundColor = taskcheck ? '#f5fffb' : '#F0F3F8';
            let color = taskcheck ? '#959696' : '#070807';

            if (isToday) {
              backgroundColor = '#0c66c5'; // Blue for today
              color = '#ffffff';
            } else {
              backgroundColor = '#cfded8';
            }

            // Apply styles
            eventContentContainer.style.backgroundColor = backgroundColor;
            eventContentContainer.style.color = color;
            eventContentContainer.style.marginBottom = '4px';

            // Set event icon
            const iconClass = taskcheck ? 'fa-check-circle' : 'fa-check-circle-o';
            const iconColor = taskcheck ? '#A2D480' : '#a3a3a3';

            eventContentContainer.innerHTML = `
              <div class="event-stage" style="font-size: 7pt;">${subStageCategoryDetailsName} | ${stageName}</div>
              <div style="margin-right: 10pt;" class="${statusCode}">
                <i class="fa ${iconClass} ${statusCode}" style="color: ${iconColor};font-size:12pt;padding-right:5px"></i>
                ${event.title}
              </div>
            `;

            return { domNodes: [eventContentContainer] };
          },
          eventClick: this.handleEventClick.bind(this),
          eventBorderColor: 'transparent',
        },
        CalendarTaskDetailsList: []
      });

      //------------------- Getting the task details ---------------------
      const hostname = window.location.hostname;
      let currentDate = this.datePipe.transform(new Date(today.getFullYear(), today.getMonth() + i, 1), 'MM-dd-yyyy');

      if (hostname === 'localhost') {
        currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      } else {
        currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      }
      // Calling the model to retrieve the data
      this.adminModel.GetAllTasksBasedDate(currentDate!, this.projectDetails.Id, this.searchQuery).then(
        (data) => {
          // Getting the project details
          this.calendarTaskDetailsList = <CalendarTaskDetails[]>data;
          // Transform tasks into FullCalendar events with date ranges and additional properties
          let calendarEvents = this.calendarTaskDetailsList.map(task => {

            // Parse the task's due date and add one day to make it inclusive
            const dueDate = new Date(task.EndDate);
            dueDate.setDate(dueDate.getDate() + 1); // Increment the due date by one day

            return {
              title: task.TaskName,
              start: new Date(task.StartDate).toISOString(), // Convert to ISO string
              end: new Date(dueDate).toISOString(), // Use the incremented due date and convert to ISO string
              extendedProps: {
                taskId: task.Id, // Include task ID here
                subStageCategoryDetailsName: task.SubStageCategory,
                stageName: task.SubStage,
                address: "",
                taskcheck: (task.StatusCode == "COM"),
                statusCode: task.StatusCode
              }
            };
          });
          // Update calendarOptions with the new events
          this.multipleCalendarsList[i-1].CalendarOptions = { ...this.multipleCalendarsList[i-1].CalendarOptions, events: calendarEvents };
        }
      );
      // End of Calling the model to retrieve the data
      //------------------- End of Getting the task details ---------------------
    }


  }


  // Getting the basic project details
  GetBasicProjectDetails() {
    // Calling the model to retrieve the data
    this.adminModel.GetBasicProjectDetails(this.SelectedClientId).then(
      (data) => {
        // Getting the project details
        this.projectDetails = <ProjectDetails>data;
        // Getting all the task details
        this.GetAllTaskList();
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting all the task details
  GetAllTaskList() {
    const hostname = window.location.hostname;
    let currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');

    if (hostname === 'localhost') {
      currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    } else {
      currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    }
    // Calling the model to retrieve the data
    this.adminModel.GetAllTasksBasedDate(currentDate!, this.projectDetails.Id, this.searchQuery).then(
      (data) => {
        // Getting the project details
        this.calendarTaskDetailsList = <CalendarTaskDetails[]>data;
        // Transform tasks into FullCalendar events with date ranges and additional properties
        let calendarEvents = this.calendarTaskDetailsList.map(task => {

          // Parse the task's due date and add one day to make it inclusive
          const dueDate = new Date(task.EndDate);
          dueDate.setDate(dueDate.getDate() + 1); // Increment the due date by one day

          return {
            title: task.TaskName,
            start: new Date(task.StartDate).toISOString(), // Convert to ISO string
            end: new Date(dueDate).toISOString(), // Use the incremented due date and convert to ISO string
            extendedProps: {
              taskId: task.Id, // Include task ID here
              subStageCategoryDetailsName: task.SubStageCategory,
              stageName: task.SubStage,
              address: "",
              taskcheck: (task.StatusCode == "COM"),
              statusCode: task.StatusCode
            }
          };
        });
        // Update calendarOptions with the new events
        this.calendarOptions = { ...this.calendarOptions, events: calendarEvents };

        // On change event of months per view
        this.onChangeMonthsPerView(1);
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
      this.showTaskDetails(taskId); // Show task details
    } else {
      const taskId = arg.event.extendedProps.taskId; // Get task ID from event
      this.showTaskDetails(taskId); // Show task details
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

  // Show task details for the selected task ID
  showTaskDetails(taskId: number) {
    this.isTaskDetailsVisible = true; // Set task details visibility to true
    // Calling the model to retrieve the data
    this.adminModel.GeTaskDetails(taskId).then(
      (data) => {
        // Getting the project details
        let taskList = <TaskDetails>data;
        // Setting the categories
        this.displayTaskDetails = taskList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Close task details
  closeTaskDetails() {
    this.isTaskDetailsVisible = false; // Set task details visibility to false
  }

  //on change event of display sub tasks
  onChangeDisplaySubTasksPaginator(event: any) {
    this.displaySubTasksFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskDetails(this.displayTaskDetails.Id, this.displaySubTasksFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskDetails[]>data;
        // Setting the categories
        this.displayTaskDetails.SubTaskDetailsList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
  }

  //on change event of display task note
  onChangeDisplayTaskNotesPaginator(event: any) {
    this.displayTaskNotesFilter.CurrentPage = event.page + 1;
    // Calling the model to retrieve the data
    this.adminModel.GetSubTaskNoteDetails(this.displayTaskDetails.Id, this.displayTaskNotesFilter).then(
      (data) => {
        // Getting the project details
        let dataList = <SubTaskNote[]>data;
        // Setting the categories
        this.displayTaskDetails.SubTaskNoteList = dataList;
      }
    );
    // End of Calling the model to retrieve the data
  }

}
