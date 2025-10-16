import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly cfg: ConfigService,
  ) {}
  async sendVerifyEmail(to: string, link: string) {
    const logo = this.cfg.get<string>('BRAND_LOGO_URL');
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <img src="${logo}" alt="Stayra" height="40"/>
        <h2>Verify your email</h2>
        <p>Thanks for signing up. Click the button below to verify your email:</p>
        <p><a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;background:#111;color:#fff">Verify Email</a></p>
        <p>This link expires in 30 minutes.</p>
        <hr/><small>If you did not sign up, please ignore this.</small>
      </div>`;
    await this.mailer.sendMail({
      to,
      subject: 'Verify your email – Stayra',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    console.log('Working ...');
    const brand = process.env.BRAND_NAME ?? 'Stayra';
    const from = process.env.MAIL_FROM ?? 'no-reply@stayra.com';
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
        <h2>${brand} password reset</h2>
        <p>We received a request to reset your password.</p>
        <p>This link will expire in 30 minutes.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;text-decoration:none;border:1px solid #333">
          Reset your password
        </a></p>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>
    `;
    await this.mailer.sendMail({
      to,
      from,
      subject: `${brand} - Reset your password`,
      html,
    });
  }
}
