import { Directive, Pipe } from '@angular/core';
import { UserTypeName } from '../admin/core/userTypeName';

@Pipe({
  name: 'appUpdateUserType',
  standalone: false
})
export class UpdateUserTypeDirective {

  constructor() { }

  transform(value: string) {
    // Current Value Code
    let userTypeCode: string = value;
    // Return value
    let returnValue: string = "NA";

    // Check if the local storage exists
    if (localStorage.getItem('UTN_DATA')) {
      // Getting the user type name list
      let userTypeNameList: UserTypeName[] = <UserTypeName[]>JSON.parse(atob(localStorage.getItem('UTN_DATA')!));
      // Getting the index of the code
      let indexObj = userTypeNameList.findIndex(obj => obj.NameCode == userTypeCode);
      // Check if the index is no -1
      if (indexObj != -1) {
        returnValue = userTypeNameList[indexObj].CurrentName;
      } else {
        returnValue = "NA";
      }
      // End of Check if the index is no -1
    } else {
      returnValue = "NA";
    }
    // End of Check if the local storage exists

    // Return the value
    return returnValue;
  }
}
