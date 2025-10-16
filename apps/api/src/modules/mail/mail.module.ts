import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.get('SMTP_HOST'),
          port: Number(cfg.get('SMTP_PORT')),
          secure:
            cfg.get('SMTP_SECURE') === true ||
            cfg.get('SMTP_SECURE') === 'true',
          auth: { user: cfg.get('SMTP_USER'), pass: cfg.get('SMTP_PASS') },
        },
        defaults: { from: cfg.get('MAIL_FROM') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
