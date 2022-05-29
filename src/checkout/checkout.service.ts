import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class CheckoutService {
  private getClient(): paypal.core.PayPalHttpClient {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    const environment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret,
    );

    const client = new paypal.core.PayPalHttpClient(environment);

    return client;
  }

  public async createOrder(): Promise<any> {
    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
      intent: 'AUTHORIZE',
      application_context: {
        return_url: 'http://localhost:3000/checkout/success',
        cancel_url: 'http://localhost:3000/checkout/cancel',
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '10.00',
          },
        },
      ],
    });

    const response = await this.getClient().execute(request);

    return response;
  }

  public async captureOrder(token: string): Promise<any> {
    const orderAuthRequest = new paypal.orders.OrdersAuthorizeRequest(token);

    const orderAuthResponse = await this.getClient().execute(orderAuthRequest);

    const authorizationId =
      orderAuthResponse.result.purchase_units[0].payments.authorizations[0].id;

    const captureRequest = new paypal.payments.AuthorizationsCaptureRequest(
      authorizationId,
    );

    const response = await this.getClient().execute(captureRequest);

    return response;
  }

  public async refundOrder(captureId: string): Promise<any> {
    const Refundrequest = new paypal.payments.CapturesRefundRequest(captureId);

    Refundrequest.requestBody({
      amount: {
        currency_code: 'USD',
        value: '10.00',
      },
      note_to_payer: 'REFUND',
      invoice_id: captureId,
    });

    const refundResponse = await this.getClient().execute(Refundrequest);

    return refundResponse;
  }
}
