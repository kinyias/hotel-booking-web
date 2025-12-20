import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { ActionsModule } from './modules/actions/actions.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ImageService } from './modules/image/image.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HotelModule } from './modules/hotel/hotel.module';
import { RoomTypeModule } from './modules/room-type/room-type.module';
import { AmentityModule } from './modules/amentity/amenity.module';
import { RoomModule } from './modules/room/room.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CommissionPackageModule } from './modules/commission-package/commission-package.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ActionsModule,
    CloudinaryModule,
    HotelModule,
    RoomTypeModule,
    AmentityModule,
    RoomModule,
    InventoryModule,
    BookingModule,
    PaymentModule,
    CommissionPackageModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    ImageService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
