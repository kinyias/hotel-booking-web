import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => {
        const logger = new Logger('MailModule');

        const transport = {
          host: cfg.get('SMTP_HOST'),
          port: Number(cfg.get('SMTP_PORT')),
          secure:
            cfg.get('SMTP_SECURE') === true ||
            cfg.get('SMTP_SECURE') === 'true',
          auth: {
            user: cfg.get('SMTP_USER'),
            pass: cfg.get('SMTP_PASS'),
          },
          debug: true,
          logger: true,
        };

        logger.log(`Mailer transport initialized with: 
          host=${transport.host}, 
          port=${transport.port}, 
          secure=${transport.secure}, 
          user=${transport.auth.user}`);

        return {
          transport,
          defaults: { from: cfg.get('MAIL_FROM') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
