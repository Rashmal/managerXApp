interface AttachPaymentResponse {
    status: string;
    paymentIntentId?: string; // Optional in case it fails
  }
  