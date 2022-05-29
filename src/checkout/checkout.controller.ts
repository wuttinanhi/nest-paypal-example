import { Controller, Get, Query } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('create')
  async create() {
    const response = await this.checkoutService.createOrder();
    return response;
  }

  @Get('success')
  async success(@Query('token') token: string) {
    const response = await this.checkoutService.captureOrder(token);
    return response;
  }

  @Get('refund')
  async refund(@Query('capture') captureId: string) {
    const response = await this.checkoutService.refundOrder(captureId);
    return response;
  }

  @Get('cancel')
  async cancel() {
    return 'cancel';
  }
}
