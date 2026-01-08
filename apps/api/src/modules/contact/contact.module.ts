import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailModule } from 'src/modules/mail/mail.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MailModule, NotificationModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
