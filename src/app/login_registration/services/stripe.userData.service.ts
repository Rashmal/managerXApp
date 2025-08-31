import { Injectable } from '@angular/core';
import { UserDetails } from '../core/userDetails';

@Injectable({ providedIn: 'root' })
export class StripeUserDataService {
  private userDetails!: UserDetails;

  setUserDetails(user: UserDetails) {
    this.userDetails = user;
  }

  getUserDetails(): UserDetails {
    return this.userDetails;
  }
}
