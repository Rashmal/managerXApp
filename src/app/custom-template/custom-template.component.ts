import { Component } from '@angular/core';
import { AllPageTemplateStyles, ButtonCustomTemplateStyles, StatusTemplateStyles } from './core/customTemplate';
import { SelectItem } from 'primeng/api';
import { ConfigValues } from './core/configValues';
import { CustomTemplateService } from './service/custom-template.service';
import { CustomTemplateModel } from './model/customTemplateModel';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertBoxComponent } from '../main_containers/alert-box/alert-box.component';
import { ContractorModel } from '../contractor/models/contractorModel';
import { ContractorService } from '../contractor/services/contractor.service';
import { StatusDetails } from '../contractor/core/statusDetails';

@Component({
  selector: 'app-custom-template',
  templateUrl: './custom-template.component.html',
  styleUrl: './custom-template.component.scss',
  providers: [DialogService],
  standalone: false
})
export class CustomTemplateComponent {
  // Store the custom template object
  buttonCustomTemplateStyles!: ButtonCustomTemplateStyles;
  // Store the all page styles
  allPageTemplateStyles!: AllPageTemplateStyles;
  // Store the border styles
  borderStylesList: SelectItem[] = [
    {
      value: 'solid',
      label: 'Solid'
    },
    {
      value: 'dashed',
      label: 'Dashed'
    },
    {
      value: 'dotted',
      label: 'Dotted'
    }
  ];
  // Store the config values list
  loginButtonConfigValues: ConfigValues[] = [];
  statusConfigValues: ConfigValues[] = [];
  allPageConfigValues: ConfigValues[] = [];
  // Store the model
  customTemplateModel: CustomTemplateModel;
  // Store the display status list
  displayStatusDetailsList: SelectItem[] = [];
  // Declare the contract model
  contractorModel: ContractorModel;
  // Store the status list
  statusDetailsList: StatusDetails[] = [];
  // Store the status list
  statusTemplateStyles!: StatusTemplateStyles;
  // Store the current expand state
  currentExpandState: string = "ALL";

  constructor(private customTemplateService: CustomTemplateService, public dialogService: DialogService,
    private contractorService: ContractorService
  ) {
    // Initialize the model
    this.contractorModel = new ContractorModel(this.contractorService);
    this.customTemplateModel = new CustomTemplateModel(this.customTemplateService);
  }

  ngOnInit() {
    // Getting the login button styles
    this.GetLoginButtonStyles();
    // Getting the all page styles
    this.GetAllPageStyles();
    // Getting the status list
    this.GetAllStatusList();
    // Getting the status styles
    this.GetStatusStyles();
  }

  // Getting the status styles
  GetStatusStyles() {
    // Calling the model
    this.customTemplateModel.GetConfigValues('STATUS_STYLE').then(
      (data) => {

        // Store the config codes
        this.statusConfigValues = <ConfigValues[]>data;
        // Setting the values
        this.statusTemplateStyles = {
          CompletedBackgroundColor: this.getConfigValue('SSTCPB', this.statusConfigValues),
          CompletedFontColor: this.getConfigValue('SSTCPFC', this.statusConfigValues),
          PendingBackgroundColor: this.getConfigValue('SSTPDB', this.statusConfigValues),
          PendingFontColor: this.getConfigValue('SSTPDFC', this.statusConfigValues),
          ProgressBackgroundColor: this.getConfigValue('SSTPGB', this.statusConfigValues),
          ProgressFontColor: this.getConfigValue('SSTPGFC', this.statusConfigValues)
        };

        document.documentElement.style.setProperty('--StatusCompletedBackgroundColor', this.statusTemplateStyles.CompletedBackgroundColor);
        document.documentElement.style.setProperty('--StatusCompletedFontColor', this.statusTemplateStyles.CompletedFontColor);
        document.documentElement.style.setProperty('--StatusPendingBackgroundColor', this.statusTemplateStyles.PendingBackgroundColor);
        document.documentElement.style.setProperty('--StatusPendingFontColor', this.statusTemplateStyles.PendingFontColor);
        document.documentElement.style.setProperty('--StatusProgressBackgroundColor', this.statusTemplateStyles.ProgressBackgroundColor);
        document.documentElement.style.setProperty('--StatusProgressFontColor', this.statusTemplateStyles.ProgressFontColor);
      }
    );
  }

  // Getting the status list
  GetAllStatusList() {
    this.displayStatusDetailsList = [];
    // Calling the model to retrieve the data
    this.contractorModel.GetStatusDetails().then(
      (data) => {
        // Getting the project details
        this.statusDetailsList = <StatusDetails[]>data;

        // Loop through the status list
        for (let i = 0; i < this.statusDetailsList.length; i++) {
          this.displayStatusDetailsList.push(
            {
              value: this.statusDetailsList[i].Id,
              label: this.statusDetailsList[i].Name
            }
          );
        }
      }
    );
    // End of Calling the model to retrieve the data
  }

  // Getting the all page styles
  GetAllPageStyles() {
    // Calling the model
    this.customTemplateModel.GetConfigValues('ALL_PAGE').then(
      (data) => {
        // Store the config codes
        this.allPageConfigValues = <ConfigValues[]>data;
        // Setting the values
        this.allPageTemplateStyles = {
          BackgroundColor: this.getConfigValue('APBG', this.allPageConfigValues),
          ContentBoxBackgroundColor: this.getConfigValue('APBGC', this.allPageConfigValues)
        };

        document.documentElement.style.setProperty('--AllPageBackgroundColor', this.allPageTemplateStyles.BackgroundColor);
        document.documentElement.style.setProperty('--AllPageContentBoxBackgroundColor', this.allPageTemplateStyles.ContentBoxBackgroundColor);
      }
    );
  }

  // Getting the login button styles
  GetLoginButtonStyles() {
    // Calling the model
    this.customTemplateModel.GetConfigValues('LOGIN_PAGE_BTN').then(
      (data) => {
        // Store the config codes
        this.loginButtonConfigValues = <ConfigValues[]>data;
        // Setting the values
        this.buttonCustomTemplateStyles = {
          LoginButtonBackgroundColor: this.getConfigValue('LBBC', this.loginButtonConfigValues),
          LoginButtonFontColor: this.getConfigValue('LBFC', this.loginButtonConfigValues),
          LoginButtonBorderColor: this.getConfigValue('LBBRC', this.loginButtonConfigValues),
          LoginButtonBorderStyle: this.getConfigValue('LBBS', this.loginButtonConfigValues),
          LoginButtonBorderWidth: +this.getConfigValue('LBBW', this.loginButtonConfigValues),
          LoginButtonFontSize: +this.getConfigValue('LBFS', this.loginButtonConfigValues),
          LoginButtonPaddingLeft: +this.getConfigValue('LBPL', this.loginButtonConfigValues),
          LoginButtonPaddingBottom: +this.getConfigValue('LBPB', this.loginButtonConfigValues),
          LoginButtonPaddingRight: +this.getConfigValue('LBPR', this.loginButtonConfigValues),
          LoginButtonPaddingTop: +this.getConfigValue('LBPT', this.loginButtonConfigValues),
          LoginButtonHoverColor: this.getConfigValue('LBHC', this.loginButtonConfigValues),
          LoginButtonHoverFontColor: this.getConfigValue('LBHFC', this.loginButtonConfigValues)
        };

        document.documentElement.style.setProperty('--LoginButtonBackgroundColor', this.buttonCustomTemplateStyles.LoginButtonBackgroundColor);
        document.documentElement.style.setProperty('--LoginButtonFontColor', this.buttonCustomTemplateStyles.LoginButtonFontColor);
        document.documentElement.style.setProperty('--LoginButtonBorderColor', this.buttonCustomTemplateStyles.LoginButtonBorderColor);
        document.documentElement.style.setProperty('--LoginButtonBorderStyle', this.buttonCustomTemplateStyles.LoginButtonBorderStyle);
        document.documentElement.style.setProperty('--LoginButtonBorderWidth', this.buttonCustomTemplateStyles.LoginButtonBorderWidth + 'px');
        document.documentElement.style.setProperty('--LoginButtonFontSize', this.buttonCustomTemplateStyles.LoginButtonFontSize + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingTop', this.buttonCustomTemplateStyles.LoginButtonPaddingTop + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingBottom', this.buttonCustomTemplateStyles.LoginButtonPaddingBottom + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingLeft', this.buttonCustomTemplateStyles.LoginButtonPaddingLeft + 'px');
        document.documentElement.style.setProperty('--LoginButtonPaddingRight', this.buttonCustomTemplateStyles.LoginButtonPaddingRight + 'px');
        document.documentElement.style.setProperty('--LoginButtonBackgroundHoverColor', this.buttonCustomTemplateStyles.LoginButtonHoverColor);
        document.documentElement.style.setProperty('--LoginButtonHoverFontColor', this.buttonCustomTemplateStyles.LoginButtonHoverFontColor);
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

  // Update the config value
  setConfigValue(configCode: string, configValue: string, configValues: ConfigValues[]) {
    // Getting the code index
    let codeIndex = configValues.findIndex(obj => obj.ConfigCode == configCode);
    // Setting the value
    configValues[codeIndex].ConfigValue = configValue;
    // Return the list
    return configValues;
  }

  // On change event
  onChangeStyle(styleCode: string) {

    switch (styleCode) {
      case 'LBBC':
        document.documentElement.style.setProperty('--LoginButtonBackgroundColor', this.buttonCustomTemplateStyles.LoginButtonBackgroundColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonBackgroundColor, this.loginButtonConfigValues);
        break;
      case 'LBFC':
        document.documentElement.style.setProperty('--LoginButtonFontColor', this.buttonCustomTemplateStyles.LoginButtonFontColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonFontColor, this.loginButtonConfigValues);
        break;
      case 'LBBRC':
        document.documentElement.style.setProperty('--LoginButtonBorderColor', this.buttonCustomTemplateStyles.LoginButtonBorderColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonBorderColor, this.loginButtonConfigValues);
        break;
      case 'LBBS':
        document.documentElement.style.setProperty('--LoginButtonBorderStyle', this.buttonCustomTemplateStyles.LoginButtonBorderStyle);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonBorderStyle, this.loginButtonConfigValues);
        break;
      case 'LBBW':
        document.documentElement.style.setProperty('--LoginButtonBorderWidth', this.buttonCustomTemplateStyles.LoginButtonBorderWidth + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonBorderWidth.toString(), this.loginButtonConfigValues);
        break;
      case 'LBFS':
        document.documentElement.style.setProperty('--LoginButtonFontSize', this.buttonCustomTemplateStyles.LoginButtonFontSize + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonFontSize.toString(), this.loginButtonConfigValues);
        break;
      case 'LBPT':
        document.documentElement.style.setProperty('--LoginButtonPaddingTop', this.buttonCustomTemplateStyles.LoginButtonPaddingTop + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonPaddingTop.toString(), this.loginButtonConfigValues);
        break;
      case 'LBPB':
        document.documentElement.style.setProperty('--LoginButtonPaddingBottom', this.buttonCustomTemplateStyles.LoginButtonPaddingBottom + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonPaddingBottom.toString(), this.loginButtonConfigValues);
        break;
      case 'LBPL':
        document.documentElement.style.setProperty('--LoginButtonPaddingLeft', this.buttonCustomTemplateStyles.LoginButtonPaddingLeft + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonPaddingLeft.toString(), this.loginButtonConfigValues);
        break;
      case 'LBPR':
        document.documentElement.style.setProperty('--LoginButtonPaddingRight', this.buttonCustomTemplateStyles.LoginButtonPaddingRight + 'px');
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonPaddingRight.toString(), this.loginButtonConfigValues);
        break;
      case 'LBHC':
        document.documentElement.style.setProperty('--LoginButtonBackgroundHoverColor', this.buttonCustomTemplateStyles.LoginButtonHoverColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonHoverColor.toString(), this.loginButtonConfigValues);
        break;
      case 'LBHFC':
        document.documentElement.style.setProperty('--LoginButtonHoverFontColor', this.buttonCustomTemplateStyles.LoginButtonHoverFontColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.buttonCustomTemplateStyles.LoginButtonHoverFontColor.toString(), this.loginButtonConfigValues);
        break;
      case 'APBG':
        document.documentElement.style.setProperty('--AllPageBackgroundColor', this.allPageTemplateStyles.BackgroundColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.allPageTemplateStyles.BackgroundColor.toString(), this.allPageConfigValues);
        break;
      case 'APBGC':
        document.documentElement.style.setProperty('--AllPageContentBoxBackgroundColor', this.allPageTemplateStyles.ContentBoxBackgroundColor);
        this.loginButtonConfigValues = this.setConfigValue(styleCode, this.allPageTemplateStyles.ContentBoxBackgroundColor.toString(), this.allPageConfigValues);
        break;
      case 'SSTCPB':
        document.documentElement.style.setProperty('--StatusCompletedBackgroundColor', this.statusTemplateStyles.CompletedBackgroundColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.CompletedBackgroundColor.toString(), this.statusConfigValues);
        break;
      case 'SSTPDB':
        document.documentElement.style.setProperty('--StatusPendingBackgroundColor', this.statusTemplateStyles.PendingBackgroundColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.PendingBackgroundColor.toString(), this.statusConfigValues);
        break;
      case 'SSTPGB':
        document.documentElement.style.setProperty('--StatusProgressBackgroundColor', this.statusTemplateStyles.ProgressBackgroundColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.ProgressBackgroundColor.toString(), this.statusConfigValues);
        break;
      case 'SSTCPFC':
        document.documentElement.style.setProperty('--StatusCompletedFontColor', this.statusTemplateStyles.CompletedFontColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.CompletedFontColor.toString(), this.statusConfigValues);
        break;
      case 'SSTPDFC':
        document.documentElement.style.setProperty('--StatusPendingFontColor', this.statusTemplateStyles.PendingFontColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.PendingFontColor.toString(), this.statusConfigValues);
        break;
      case 'SSTPGFC':
        document.documentElement.style.setProperty('--StatusProgressFontColor', this.statusTemplateStyles.ProgressFontColor);
        this.statusConfigValues = this.setConfigValue(styleCode, this.statusTemplateStyles.ProgressFontColor.toString(), this.statusConfigValues);
        break;
    }
  }

  // Reset on click function
  resetOnClick(styleType: string) {
    switch (styleType) {
      case 'LOGIN_PAGE_BTN':
        // Getting the login button styles
        this.GetLoginButtonStyles();
        break;
      case 'ALL_PAGE_BTN':
        // Getting the all page styles
        this.GetAllPageStyles();
        break;
      case 'STATUS_STYLE':
        // Getting the all page styles
        this.GetStatusStyles();
        break;
    }
  }

  // Update on click funciton
  updateOnClick(styleType: string) {
    switch (styleType) {
      case 'LOGIN_PAGE_BTN':
        this.customTemplateModel.SetConfigValues(this.loginButtonConfigValues).then(
          () => {
            // Open the alert box
            let refAlert = this.dialogService.open(AlertBoxComponent, {
              showHeader: false,
              width: '22%'
            });
            // End of Open the alert box
          }
        );
        break;
      case 'ALL_PAGE_BTN':
        this.customTemplateModel.SetConfigValues(this.allPageConfigValues).then(
          () => {
            // Open the alert box
            let refAlert = this.dialogService.open(AlertBoxComponent, {
              showHeader: false,
              width: '22%'
            });
            // End of Open the alert box
          }
        );
        break;
      case 'STATUS_STYLE':
        this.customTemplateModel.SetConfigValues(this.statusConfigValues).then(
          () => {
            // Open the alert box
            let refAlert = this.dialogService.open(AlertBoxComponent, {
              showHeader: false,
              width: '22%'
            });
            // End of Open the alert box
          }
        );
        break;
    }
  }

  expandOnClick(selection: string) {
    this.currentExpandState = (this.currentExpandState == selection) ? '' : selection;
  }
}
