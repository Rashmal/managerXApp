import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login_registration/components/login/login.component';
import { SuperAdminMainComponent } from './super-admin/super-admin-main/super-admin-main.component';
import { AdyenplansComponent } from './login_registration/components/adyenplans/adyenplans.component';
import { AdyenpaymentComponent } from './login_registration/components/adyenpayment/adyenpayment.component';
import { AdyentestComponent } from './login_registration/components/adyentest/adyentest.component';
import { AcceptPersonComponent } from './chat/components/accept-person/accept-person.component';
import { RejectPersonComponent } from './chat/components/reject-person/reject-person.component';
import { StripePlansComponent } from './login_registration/components/stripe-plans/stripe-plans.component';
import { ErrorMessageComponent } from './login_registration/components/error-message/error-message.component';
import { CreateAccountComponent } from './login_registration/components/create-account/create-account.component';
import { CreateAccountFormComponent } from './login_registration/components/create-account-form/create-account-form.component';
import { MasterPageComponent } from './main_containers/master-page/master-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'stripePayment', component: AdyentestComponent },
  { path: 'stripePlan', component: StripePlansComponent },
  { path: 'errorMessage', component: ErrorMessageComponent },
  { path: 'createAccount', component: CreateAccountComponent },
  { path: 'createAccountForm', component: CreateAccountFormComponent },
  { path: 'accept', component: AcceptPersonComponent },
  { path: 'reject', component: RejectPersonComponent },
  { path: 'stripeAdmins', component: SuperAdminMainComponent },
  { path: 'adyenPlan', component: AdyenplansComponent },
  { path: 'adyenPayment', component: AdyenpaymentComponent },
  { path: 'adyenTest', component: AdyentestComponent },
  { path: 'main', component: MasterPageComponent },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  }
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
