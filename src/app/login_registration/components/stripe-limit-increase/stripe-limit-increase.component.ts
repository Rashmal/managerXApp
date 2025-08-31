import { Component, AfterViewInit, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement, StripeCardElementOptions, StripeError } from '@stripe/stripe-js';

import { HttpClient } from '@angular/common/http';
import { StripeService } from '../../services/stripe.service';
import { StripeModel } from '../../models/stripe.model';
import { SubscriptionRequest } from '../../core/stripe/SubscriptionRequest';
import { StripeUserDataService } from '../../services/stripe.userData.service';
import { UserDetails } from '../../core/userDetails';
import { Router } from '@angular/router';
import { AuthenticationModel } from '../../models/authenticationModel';
import { AuthenticationService } from '../../services/authentication.service';
import { IErrorMessage } from '../../core/iErrorMessage';
import { StripePaymentOverdue } from '../../core/stripe/StripePaymentOverdue';
import { StripeSubscriptionPlans } from '../../core/stripe/StripeSubscriptionPlans';
@Component({
  selector: 'app-stripe-limit-increase',
  templateUrl: './stripe-limit-increase.component.html',
  styleUrl: './stripe-limit-increase.component.scss',
  standalone: false
})
export class StripeLimitIncreaseComponent  {
 
}
