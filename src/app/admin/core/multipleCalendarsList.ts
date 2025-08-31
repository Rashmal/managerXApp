import { CalendarOptions } from "@fullcalendar/core";
import { CalendarTaskDetails } from "./calendarTaskDetails";

export interface MultipleCalendarsList {
    CalendarOptions: CalendarOptions;
    CalendarTaskDetailsList: CalendarTaskDetails[];
}