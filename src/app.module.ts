import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    CheckoutModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
