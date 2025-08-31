import { Component, ElementRef, ViewChild } from '@angular/core';
import { LOGIN$USER_EMAIL$LIMIT, LOGIN$USER_PASSWORD$LIMIT } from '../../core/apiConfigurations';
import { AuthenticationModel } from '../../models/authenticationModel';
import { AuthenticationService } from '../../services/authentication.service';
import { IErrorMessage } from '../../core/iErrorMessage';
import { OverallCookieInterface } from '../../core/overallCookieInterface';
import { OverallCookieModel } from '../../core/overallCookieModel';
import { Router } from '@angular/router';
import { AdminModel } from '../../../admin/models/adminModel';
import { RoleManagement } from '../../../admin/core/roleManagement';
import { AdminService } from '../../../admin/services/admin.service';
import { UserTypeName } from '../../../admin/core/userTypeName';
import { CustomTemplateModel } from '../../../custom-template/model/customTemplateModel';
import { CustomTemplateService } from '../../../custom-template/service/custom-template.service';
import { ConfigValues } from '../../../custom-template/core/configValues';
import { ButtonCustomTemplateStyles } from '../../../custom-template/core/customTemplate';
import { StripeModel } from '../../models/stripe.model';
import { StripeService } from '../../services/stripe.service';
import { StripePaymentOverdue } from '../../core/stripe/StripePaymentOverdue';
import jwt_decode from "jwt-decode"; // Make sure to install this package if not done
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent {

  // Store the variable to store user email
  user_email: string = "";
  // Store the variable to store user password
  user_password: string = "";
  // Store password display type
  passwordFieldType: string = 'password';
  // Store the error messages
  errorMessagesList: IErrorMessage[] = [];
  // Store the email list
  emailLimit: number = LOGIN$USER_EMAIL$LIMIT;
  // Store the password list
  passwordLimit: number = LOGIN$USER_PASSWORD$LIMIT;
  // Store the loading
  showLoading: boolean = false;
  // Store the model
  authenticationModel: AuthenticationModel;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Declare the admin model
  adminModel: AdminModel;
  // Store the role details
  roleDetailsList: RoleManagement[] = [];
  // Store all the user types
  allUserTypesAll: UserTypeName[] = [];
  currentState: string = "LANDING";
  // Store the model
  customTemplateModel: CustomTemplateModel;
  // Store the model
  stripeModel!: StripeModel;
  // Store Stripe Payment Overdue data
  StripePaymentOverdue!: StripePaymentOverdue;
  //Store subscription validation
  IsSubscriptionDisable: boolean = true;
  //Store  userType
  userType: string = '';
  //Store isModalOpen
  isModalOpen = false;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  ngOnInit() {
    // Optionally clear ghostEmail or any other localStorage items
    localStorage.removeItem('ghostEmail');
    // Clear cookies and session data via interface method
    this.overallCookieInterface.ClearCookies();
  }
  ngAfterViewInit() {
    // Safely access the video element
    if (this.videoElement) {
      const video = this.videoElement.nativeElement;
      video.muted = true;
      video.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    }
  }

  constructor(private authenticationService: AuthenticationService, private router: Router,
    private adminService: AdminService, private customTemplateService: CustomTemplateService,
    private stripeService: StripeService, private navCtrl: NavController
  ) {
    // Initialize the model
    this.authenticationModel = new AuthenticationModel(this.authenticationService);
    this.customTemplateModel = new CustomTemplateModel(this.customTemplateService);
    this.overallCookieInterface = new OverallCookieModel();
    // Initialize the model
    this.adminModel = new AdminModel(this.adminService);
    // Getting all the role list
    this.GetAllRoleList();
    // Getting all the user types
    this.GetAllUserTypes();
    // Getting the login button styles
    this.GetLoginButtonStyles();
    this.stripeModel = new StripeModel(this.stripeService);
  }



  // Getting the login button styles
  GetLoginButtonStyles() {
    // Calling the model
    this.customTemplateModel.GetConfigValues('LOGIN_PAGE_BTN').then(
      (data) => {
        // Store the config codes
        let loginButtonConfigValues = <ConfigValues[]>data;
        // Setting the values
        let buttonCustomTemplateStyles: ButtonCustomTemplateStyles = {
          LoginButtonBackgroundColor: this.getConfigValue('LBBC', loginButtonConfigValues),
          LoginButtonFontColor: this.getConfigValue('LBFC', loginButtonConfigValues),
          LoginButtonBorderColor: this.getConfigValue('LBBRC', loginButtonConfigValues),
          LoginButtonBorderStyle: this.getConfigValue('LBBS', loginButtonConfigValues),
          LoginButtonBorderWidth: +this.getConfigValue('LBBW', loginButtonConfigValues),
          LoginButtonFontSize: +this.getConfigValue('LBFS', loginButtonConfigValues),
          LoginButtonPaddingLeft: +this.getConfigValue('LBPL', loginButtonConfigValues),
          LoginButtonPaddingBottom: +this.getConfigValue('LBPB', loginButtonConfigValues),
          LoginButtonPaddingRight: +this.getConfigValue('LBPR', loginButtonConfigValues),
          LoginButtonPaddingTop: +this.getConfigValue('LBPT', loginButtonConfigValues),
          LoginButtonHoverColor: this.getConfigValue('LBHC', loginButtonConfigValues),
          LoginButtonHoverFontColor: this.getConfigValue('LBHFC', loginButtonConfigValues)
        };

        document.documentElement.style.setProperty('--LoginButtonBackgroundColor', buttonCustomTemplateStyles.LoginButtonBackgroundColor);
        document.documentElement.style.setProperty('--LoginButtonFontColor', buttonCustomTemplateStyles.LoginButtonFontColor);
        document.documentElement.style.setProperty('--LoginButtonBorderColor', buttonCustomTemplateStyles.LoginButtonBorderColor);
        document.documentElement.style.setProperty('--LoginButtonBorderStyle', buttonCustomTemplateStyles.LoginButtonBorderStyle);
        document.documentElement.style.setProperty('--LoginButtonBorderWidth', buttonCustomTemplateStyles.LoginButtonBorderWidth + 'px');
        document.documentElement.style.setProperty('--LoginButtonFontSize', buttonCustomTemplateStyles.LoginButtonFontSize + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingTop', buttonCustomTemplateStyles.LoginButtonPaddingTop + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingBottom', buttonCustomTemplateStyles.LoginButtonPaddingBottom + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingLeft', buttonCustomTemplateStyles.LoginButtonPaddingLeft + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingRight', buttonCustomTemplateStyles.LoginButtonPaddingRight + 'px');
        document.documentElement.style.setProperty('--LoginButtonBackgroundHoverColor', buttonCustomTemplateStyles.LoginButtonHoverColor);
        document.documentElement.style.setProperty('--LoginButtonHoverFontColor', buttonCustomTemplateStyles.LoginButtonHoverFontColor);
      }
    );
  }

  // Getting the config value
  getConfigValue(configCode: string, configValues: ConfigValues[]) {
    // Getting the code index
    let codeIndex = configValues.findIndex(obj => obj.ConfigCode == configCode);
    // Return the value
    return (codeIndex != -1) ? configValues[codeIndex].ConfigValue : '';
  }



  redirectToLogin() {
    this.currentState = "LOGIN";
  }

  // Getting all the user types
  GetAllUserTypes() {
    // Calling the model to retrieve the data for all client address list
    this.adminModel.GetAllUserTypes().then(
      (data) => {
        // Getting all the client address list
        let allUserTypes: UserTypeName[] = <UserTypeName[]>data;

        // Setting in the local storage
        localStorage.setItem("UTN_DATA", btoa(JSON.stringify(allUserTypes)));

        this.allUserTypesAll = allUserTypes;
      }
    );
    // End of Calling the model to retrieve the data for all client address list
  }

  // Getting the role name
  getRoleName(roleCode: string) {
    // Getting the index
    let roleIndex = this.roleDetailsList.findIndex(obj => obj.NameCode == roleCode);
    // Return the list
    return this.roleDetailsList[roleIndex].CurrentName.toLowerCase();
  }

  // Getting all the role list
  GetAllRoleList() {
    // Calling the model to retrieve the data
    this.adminModel.GetAllRoleManagement().then(
      (data) => {
        // Getting the project details
        this.roleDetailsList = <RoleManagement[]>data;
      }
    );
    // End of Calling the model to retrieve the data
  }

  // On click event of the eye toggle icon
  togglePasswordVisibility() {
    // Toggle the password display type
    this.passwordFieldType = (this.passwordFieldType == 'password') ? 'text' : 'password';
  }

  // On change event of the email input
  onPasteEmailFunction(event: any) {
    // Getting the current text
    let currentText = event.target.value;
    // Removing the special characters
    currentText = currentText.replace(/[^a-zA-Z0-9@_.]/g, "")
    // Cutting the extra characters from the word
    this.user_email = currentText.substr(0, this.emailLimit);

    // this.checkStripeValidation(this.user_email,this.userType);
  }

  // On change event of the password input
  onPastePasswordFunction(event: any) {
    // Getting the current text
    let currentText = event.target.value;
    // Cutting the extra characters from the word
    this.user_password = currentText.substr(0, this.passwordLimit);
  }





  // On click event of the login button
  loginOnClick(loginType: string) {
    //remove super admin section saved details
    localStorage.removeItem('supAdminActivatedComp');

    //clear local storage
    localStorage.removeItem('StripeDetails');
    //set local storage
    localStorage.setItem('StripeDetails', JSON.stringify(this.StripePaymentOverdue));


    // Start the loading
    this.showLoading = true;

    // Validate the fields in the login page
    this.validateFields();
    // End of Validate the fields in the login page

    // Check if the error messages length
    if (this.errorMessagesList.length > 0) {
      // Stop the loading
      this.showLoading = false;
      return;
    }
    // End of Check if the error messages length

    // Declare the user type
    let userType: string = "";
    // Check the login type
    switch (loginType) {
      case 'AD':
        userType = 'AD';
        break;
      case 'PM':
        userType = 'PM';
        break;
      case 'SP':
        userType = 'SP';
        break;
    }
    // End of Check the login type

    // Calling the model to check if the email already exists
    this.authenticationModel.CheckEmailExistsWithUserType(this.user_email, userType).then(
      (data) => {
        // Getting the email validation
        let emailExists: boolean = <boolean>data;

        // Check if the email exists
        if (emailExists) {
          // Validate the login details
          this.authenticationModel.LoginAuthentication(this.user_email, this.user_password, userType).then(
            (data) => {
              // Getting the login validation
              let loginToken: string = <string>data;

              // Check if the token is valid
              if (loginToken.includes("ERROR")) {
                // Stop the loading
                this.showLoading = false;
                // Pushing the error message
                this.errorMessagesList.push(
                  {
                    ErrorCode: 'INVALID$LOGIN',
                    ErrorMessage: 'Invalid password'
                  }
                );
              } else {
                // Check if the user is blocked
                this.authenticationModel.CheckIfEmailIsDisabled(this.user_email, userType).then(
                  (data) => {
                    // Check if the user is blocked
                    if (data) {
                      // Pushing the error message
                      this.errorMessagesList.push(
                        {
                          ErrorCode: 'BLK$LOGIN',
                          ErrorMessage: 'Please reach out to the Admin for assistance'
                        }
                      );
                    } else {
                      // Stop the loading
                      this.showLoading = false;
                      // Setting the user token
                      this.overallCookieInterface.SetUserToken(loginToken);
                      // Navigate to the main
                      this.router.navigate(['/main']);
                    }
                    // End of Check if the user is blocked
                  }
                );
                // End of Check if the user is blocked
              }
            }
          );
          // End of Validate the login details
        } else {
          // Stop the loading
          this.showLoading = false;
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'NOT$EXISTS$USER$EMAIL',
              ErrorMessage: 'User email does not exists'
            }
          );
        }
        // End of Check if the email exists
      }
    );
    // End of Calling the model to check if the email already exists
  }

  // Validate the login fields
  validateFields() {
    // Clear the error message list
    this.errorMessagesList = [];

    // Check if the user email exists
    if (!(this.user_email && this.user_email != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$USER$EMAIL',
          ErrorMessage: 'User email is mandatory'
        }
      );
    } else {
      // Check if the email is proper format
      let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,300})+$/);
      if (!regex.test(this.user_email)) {
        // Pushing the error message
        this.errorMessagesList.push(
          {
            ErrorCode: 'EMAIL$FORMAT',
            ErrorMessage: 'Email is not valid !!'
          }
        );
      }
      // End of Check if the email is proper format
    }
    // End of Check if the user email exists

    // Check if the user password exists
    if (!(this.user_password && this.user_password != '')) {
      // Pushing the error message
      this.errorMessagesList.push(
        {
          ErrorCode: 'EMPTY$USER$PASSWORD',
          ErrorMessage: 'User password is mandatory'
        }
      );
    } else {
      // Check if the stakeholder name length
      if (!(this.user_password && this.user_password.length > 2)) {
        // Pushing the error message
        this.errorMessagesList.push(
          {
            ErrorCode: 'LENGTH$USER$PASSWORD',
            ErrorMessage: 'User password is must be more than 2 characters'
          }
        );
      }
      // End of Check if the stakeholder name length
    }
    // End of Check if the user password exists

    // Check if error message is empty
    if (this.errorMessagesList.length > 0) {
      return;
    }
    // End of Check if error message is empty
  }

  // Check if the error exists
  CheckErrorCode(errorCode: string) {
    // Find for the code
    let indexObject = this.errorMessagesList.findIndex(obj => obj.ErrorCode == errorCode);
    // Return the error object
    if (indexObject < 0) {
      return null;
    } else {
      return this.errorMessagesList[indexObject];
    }
  }

  // On click event of create account
  createAccountOnClick() {
    // Redirect to create account
    //this.router.navigate(['/createAccount']);
    // this.navCtrl.navigateForward('/createAccount');

    this.router.navigate(['/createAccount']);
  }


  checkGhostSuperAdminLogin(userType: string) {
    //reset error messages
    this.errorMessagesList = [];
    //set user type
    this.userType = userType;
    //super admin check
    //if (this.user_email == 'superAdmin@gmail.com' && this.user_password == '123' && this.userType == 'AD') {
    //  this.superAdminFunction(this.user_email, this.user_password);
    //  return;
    // }
    // Validate the login details
    this.authenticationModel.LoginAuthentication(this.user_email, this.user_password, userType).then(
      (data) => {
        // Getting the login validation
        let loginToken: string = <string>data;
        // Check if the token is valid
        if (loginToken.includes("ERROR")) {
          if (userType == 'PM') {
            //call again for supplier is there
            this.checkGhostSuperAdminLogin('SP');
          } else {
            // Stop the loading
            this.showLoading = false;

            // Pushing the error message
            this.errorMessagesList.push(
              {
                ErrorCode: 'INVALID$LOGIN',
                ErrorMessage: 'Invalid password'
              }
            );
          }

        } else {
          // Decode JWT token to extract payload
          const decodedToken: any = jwt_decode(loginToken);
          const nameId = decodedToken?.nameid;
          // Stop loading
          this.showLoading = false;
          //check is this valid ghost login (ex: nameId = -2,-3,-4,-5)
          if (nameId < 0) {
            // Remove a single entry by key
            localStorage.removeItem('ghostEmail');

            // Store the email
            localStorage.setItem('ghostEmail', this.user_email);

            // Valid token and nameid is -1, proceed to main
            this.overallCookieInterface.SetUserToken(loginToken);
            this.router.navigate(['/main']);
            return;
          }
          else if (nameId == 0) {

            // Valid token and nameid is -1, proceed to main
            this.overallCookieInterface.SetUserToken(loginToken);
            this.router.navigate(['/stripeAdmins']);
            return;
          }

          else {
            //continue normal login function
            this.checkStripeValidation(userType);
          }

        }

      });
  }




  //check Stripe Validation
  checkStripeValidation(userType: string) {

    this.stripeModel.CheckStripePaymentOverdueServiceCall(this.user_email, userType).then(() => {

      // Fetching the product list from the model.
      let Details = this.stripeModel.GetStripePaymentOverdue();
      this.StripePaymentOverdue = Details;

      if (!Details || (Array.isArray(Details) && Details.length === 0)) {

        this.IsSubscriptionDisable = true;
        // Pushing the error message  
        this.errorMessagesList.push({
          ErrorCode: 'NO$SUBSCRIPTION',
          ErrorMessage: 'You need to activate a subscription plan for access the system'
        });

        return;
      } else {

        //Set stat as Subscription is disable
        this.IsSubscriptionDisable = false;

      }

      // Get today's date
      const today = new Date();

      if (this.StripePaymentOverdue.SubscriptionExpiredOn < today) {
        this.IsSubscriptionDisable = true;
        // Pushing the error message for expired subscription
        this.errorMessagesList.push({
          ErrorCode: 'SUBSCRIPTION$EXP',
          ErrorMessage: 'Your subscription has expired'
        });
      } else {
        this.IsSubscriptionDisable = false;
      }
      /* 
      if (this.StripePaymentOverdue.TrialExpiredOn < today) {
        // Pushing the error message for expired trial
        this.errorMessagesList.push({
          ErrorCode: 'TRIAL$EXP',
          ErrorMessage: 'Your trial period has expired'
        });
      } */

      if (this.StripePaymentOverdue.SubscriptionStatusName != 'Active' || this.StripePaymentOverdue.PaymentStatusName != 'Active') {
        this.IsSubscriptionDisable = true;
        this.errorMessagesList.push({
          ErrorCode: 'TRIAL$EXP',
          ErrorMessage: 'Subscription has been expired'
        });
      } else {
        this.IsSubscriptionDisable = false;
      }

      // Check Stripe subscription status
      if (!this.IsSubscriptionDisable) {
        this.loginOnClick(userType);
        return;
      }


    });
  }

  //subscription Plan click event
  subscriptionPlanOnClick() {
    // Redirect to create account
    this.router.navigate(['/stripePlan']);
  }

  //superAdmin Function
  superAdminFunction(email: string, password: string) {
    this.authenticationModel.LoginAuthentication(email, password, 'SAD').then(
      (data) => {
        // Getting the login validation
        let loginToken: string = <string>data;

        // Check if the token is valid
        if (loginToken.includes("ERROR")) {
          // Stop the loading
          this.showLoading = false;
          // Pushing the error message
          this.errorMessagesList.push(
            {
              ErrorCode: 'INVALID$LOGIN',
              ErrorMessage: 'Invalid password'
            }
          );
        } else {
          // Stop the loading
          this.showLoading = false;
          // Setting the user token
          this.overallCookieInterface.SetUserToken(loginToken);
          // Navigate to the main
          this.router.navigate(['/stripeAdmins']);
        }
      }
    );
  }



  //function for open video modal
  openModal() {
    this.isModalOpen = true;
  }
  //function for close video modal
  closeModal() {
    this.isModalOpen = false;
  }
}
