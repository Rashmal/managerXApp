import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ScrollerModule } from 'primeng/scroller';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LandingPageComponent } from './login_registration/components/landing-page/landing-page.component';
import { LoginComponent } from './login_registration/components/login/login.component';
import { UpdateUserTypeDirective } from './directives/update-user-type.directive';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AdyentestComponent } from './login_registration/components/adyentest/adyentest.component';
import { StripePlansComponent } from './login_registration/components/stripe-plans/stripe-plans.component';
import { ErrorMessageComponent } from './login_registration/components/error-message/error-message.component';
import { CreateAccountComponent } from './login_registration/components/create-account/create-account.component';
import { CreateAccountFormComponent } from './login_registration/components/create-account-form/create-account-form.component';
import { AcceptPersonComponent } from './chat/components/accept-person/accept-person.component';
import { RejectPersonComponent } from './chat/components/reject-person/reject-person.component';
import { AdyenpaymentComponent } from './login_registration/components/adyenpayment/adyenpayment.component';
import { AdyenplansComponent } from './login_registration/components/adyenplans/adyenplans.component';
import { SuperAdminMainComponent } from './super-admin/super-admin-main/super-admin-main.component';

import { InputrestrictionDirective } from './login_registration/directives/inputrestriction.directive';
import { MasterPageComponent } from './main_containers/master-page/master-page.component';
import { AdminOverviewComponent } from './admin/components/admin-overview/admin-overview.component';
import { AdminChecklistComponent } from './admin/components/admin-checklist/admin-checklist.component';
import { AdminProjectContractComponent } from './admin/components/admin-project-contract/admin-project-contract.component';
import { UploadFilesComponent } from './admin/components/upload-files/upload-files.component';
import { AlertBoxComponent } from './main_containers/alert-box/alert-box.component';
import { DeleteConfirmationComponent } from './main_containers/delete-confirmation/delete-confirmation.component';
import { AdminContactsComponent } from './admin/components/admin-contacts/admin-contacts.component';
import { AdminSettingsComponent } from './admin/components/admin-settings/admin-settings.component';
import { AdminCalendarComponent } from './admin/components/admin-calendar/admin-calendar.component';
import { AdminNotificationsComponent } from './admin/components/admin-notifications/admin-notifications.component';
import { ContractorCalendarComponent } from './contractor/components/contractor-calendar/contractor-calendar.component';
import { ContractorNotificationsComponent } from './contractor/components/contractor-notifications/contractor-notifications.component';
import { ContractorContactsComponent } from './contractor/components/contractor-contacts/contractor-contacts.component';
import { ContractorSettingsComponent } from './contractor/components/contractor-settings/contractor-settings.component';
import { ProjectManagerSettingsComponent } from './project_manager/components/project-manager-settings/project-manager-settings.component';
import { ProjectManagerContactsComponent } from './project_manager/components/project-manager-contacts/project-manager-contacts.component';
import { ProjectManagerCalendarComponent } from './project_manager/components/project-manager-calendar/project-manager-calendar.component';
import { ProjectManagerChecklistComponent } from './project_manager/components/project-manager-checklist/project-manager-checklist.component';
import { ProjectManagerNotificationsComponent } from './project_manager/components/project-manager-notifications/project-manager-notifications.component';
import { ProjectManagerProjectsComponent } from './project_manager/components/project-manager-projects/project-manager-projects.component';
import { AccessLevelComponent } from './admin/components/access-level/access-level.component';
import { NewClientComponent } from './project_manager/components/new-client/new-client.component';
import { NewContactComponent } from './project_manager/components/new-contact/new-contact.component';
import { NewTaskComponent } from './project_manager/components/new-task/new-task.component';
import { StageLevelComponent } from './project_manager/components/stage-level/stage-level.component';
import { AdminProjectsComponent } from './admin/components/admin-projects/admin-projects.component';
import { AdminTasksComponent } from './admin/components/admin-tasks/admin-tasks.component';
import { ContractorTasksComponent } from './contractor/components/contractor-tasks/contractor-tasks.component';
import { DownloadConfirmationComponent } from './main_containers/download-confirmation/download-confirmation.component';
import { CustomTemplateComponent } from './custom-template/custom-template.component';
import { UpdatePasswordComponent } from './main_containers/update-password/update-password.component';
import { PasswordStrengthComponent } from './main_containers/update-password/password-strength/password-strength.component';
import { ChatMasterComponent } from './chat/components/chat-master/chat-master.component';
import { CreateChatRoomComponent } from './chat/components/create-chat-room/create-chat-room.component';
import { MessageListComponent } from './chat/components/message-list/message-list.component';
import { HelpSupportComponent } from './main_containers/help-support/help-support.component';
import { StripePaymentComponent } from './login_registration/components/stripe-payment/stripe-payment.component';
import { StripePaymentLogComponent } from './super-admin/stripe-payment-log/stripe-payment-log.component';
import { StripeSubscriptionLogComponent } from './super-admin/stripe-subscription-log/stripe-subscription-log.component';
import { OnlyNumbersDirective } from './login_registration/directives/OnlyNumbersDirective';
import { StripeLimitIncreaseComponent } from './login_registration/components/stripe-limit-increase/stripe-limit-increase.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivityLogComponent } from './super-admin/activity-log/activity-log.component';
import { GoogleAnalyticsComponent } from './super-admin/google-analytics/google-analytics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputrestrictionDirective,
    ErrorMessageComponent,
    CreateAccountComponent,
    CreateAccountFormComponent,
    MasterPageComponent,
    AdminOverviewComponent,
    AdminChecklistComponent,
    AdminProjectContractComponent,
    UploadFilesComponent,
    AlertBoxComponent,
    DeleteConfirmationComponent,
    AdminContactsComponent,
    AdminSettingsComponent,
    AdminCalendarComponent,
    AdminNotificationsComponent,
    ContractorTasksComponent,
    ContractorCalendarComponent,
    ContractorNotificationsComponent,
    ContractorContactsComponent,
    ContractorSettingsComponent,
    ProjectManagerSettingsComponent,
    ProjectManagerContactsComponent,
    ProjectManagerCalendarComponent,
    ProjectManagerChecklistComponent,
    ProjectManagerNotificationsComponent,
    ProjectManagerProjectsComponent,
    AccessLevelComponent,
    NewClientComponent,
    NewContactComponent,
    NewTaskComponent,
    StageLevelComponent,
    AdminProjectsComponent,
    AdminTasksComponent,
    UpdateUserTypeDirective,
    DownloadConfirmationComponent,
    LandingPageComponent,
    CustomTemplateComponent,
    UpdatePasswordComponent,
    PasswordStrengthComponent,
    ChatMasterComponent,
    CreateChatRoomComponent,
    MessageListComponent,
    AcceptPersonComponent,
    RejectPersonComponent,
    HelpSupportComponent,
    StripePlansComponent,
    StripePaymentComponent,
    StripePaymentLogComponent,
    SuperAdminMainComponent,
    StripeSubscriptionLogComponent,
    OnlyNumbersDirective,
    StripeLimitIncreaseComponent,
    AdyenpaymentComponent,
    AdyenplansComponent,
    AdyentestComponent,
    ActivityLogComponent,
    GoogleAnalyticsComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    ScrollingModule,
    AppRoutingModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    BrowserAnimationsModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    CheckboxModule,
    ToastModule,
    MessagesModule,
    AccordionModule,
    DialogModule,
    SidebarModule,
    PaginatorModule,
    CalendarModule,
    RadioButtonModule,
    MultiSelectModule,
    InputSwitchModule,
    ScrollerModule,
    OverlayPanelModule,
    TooltipModule,
    SelectButtonModule,
    ColorPickerModule,
    OverlayPanelModule,
    SimpleNotificationsModule.forRoot(),
    DialogModule,
    PickerComponent,
    PdfViewerModule,
    ConfirmDialogModule,
    HttpClientModule, // 👈 Add this line
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(), ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule { }
