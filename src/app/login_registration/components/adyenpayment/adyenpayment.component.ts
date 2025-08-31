import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var AdyenCheckout: any;

@Component({
  selector: 'app-adyenpayment',
  templateUrl: './adyenpayment.component.html',
  styles: [`
    .container {
      max-width: 420px;
      margin: 40px auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      background: #fff;
    }
    h2 {
      text-align: center;
      color: #0052cc;
      margin-bottom: 20px;
    }
    form label {
      display: block;
      margin-top: 10px;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 8px;
      margin-top: 4px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    button {
      margin-top: 16px;
      width: 100%;
      padding: 10px;
      background-color: #0052cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .message {
      margin-top: 20px;
      padding: 12px;
      border-radius: 8px;
      background-color: #d4edda;
      color: #155724;
      font-weight: 600;
      text-align: center;
    }
  `],
  standalone: false
})
export class AdyenpaymentComponent implements OnInit {
  @ViewChild('dropinContainer', { static: true }) dropinContainer!: ElementRef;

  userEmail: string = '';
  selectedPlanId: string = '';
  message: string = '';
  checkout: any;
  dropin: any;

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  ngOnInit(): void {
    // Load Adyen JS script dynamically
    const script = this.renderer.createElement('script');
    script.src = 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.27.0/adyen.js';
    script.async = true;
    script.onload = () => this.loadStylesAndInit();
    this.renderer.appendChild(document.body, script);
  }

  loadStylesAndInit() {
    // Load Adyen CSS dynamically
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.27.0/adyen.css';
    this.renderer.appendChild(document.head, link);
  }

  startPayment() {
    this.message = '';
    // Clear old drop-in if any
    if (this.dropin) {
      this.dropin.unmount();
      this.dropin = null;
    }

    // Call backend API to get payment methods and client key
    this.http.post<any>('https://localhost:7121/api/adyen/initiate', {
      email: this.userEmail,
      planId: this.selectedPlanId
    }).subscribe({
      next: async (paymentData) => {
        if (typeof AdyenCheckout !== 'function') {
          this.message = 'AdyenCheckout SDK is not loaded.';
          return;
        }

        try {
          // Initialize AdyenCheckout instance
          this.checkout = await AdyenCheckout({
            environment: 'test',
            clientKey: paymentData.clientKey,
            paymentMethodsResponse: paymentData.paymentMethods,
            countryCode: paymentData.countryCode || 'AU',
            analytics: { enabled: false }, // disable analytics to avoid CORS
            onSubmit: (state: any, component: any) => {
              if (state.isValid) {
                const subscriptionPayload = {
                  paymentMethod: state.data.paymentMethod,
                  email: this.userEmail,
                  planId: this.selectedPlanId
                };

                this.http.post<any>('https://localhost:7121/api/adyen/confirmSubscription', subscriptionPayload).subscribe({
                  next: (response) => {
                    if (response.action) {
                      component.handleAction(response.action);
                    } else {
                      this.message = 'Subscription status: ' + response.resultCode;
                      if (response.resultCode === 'Authorised') {
                        // Optionally clear drop-in after success
                        component.unmount();
                      }
                    }
                  },
                  error: () => {
                    this.message = 'Subscription failed. Please try again.';
                  }
                });
              }
            },
            onAdditionalDetails: (state: any, component: any) => {
              this.http.post<any>('https://localhost:7121/api/adyen/submitAdditionalDetails', state.data).subscribe({
                next: (response) => {
                  if (response.action) {
                    component.handleAction(response.action);
                  } else {
                    this.message = 'Subscription status: ' + response.resultCode;
                    if (response.resultCode === 'Authorised') {
                      component.unmount();
                    }
                  }
                },
                error: () => {
                  this.message = 'Failed in additional details step.';
                }
              });
            },
            onError: (error: any) => {
              this.message = 'Error: ' + error.message;
            }
          });

          // Create and mount the drop-in component (includes payment fields + submit button)
          this.dropin = await this.checkout.create('dropin');
          this.dropin.mount(this.dropinContainer.nativeElement);
        } catch (err: any) {
          console.error('Error initializing Adyen Checkout:', err);
          this.message = 'Failed to load payment form.';
        }
      },
      error: () => {
        this.message = 'Failed to initialize payment.';
      }
    });
  }
}
