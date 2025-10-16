import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.OAUTH_REDIRECT_URL!, // ví dụ /v1/auth/google/callback
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    // Trả về payload để guard lưu vào req.user
    // Google đảm bảo profile.id (sub), emails[0].value, displayName, photos…
    return {
      provider: 'GOOGLE',
      providerId: profile.id,
      email: profile.emails?.[0]?.value?.toLowerCase() ?? null,
      name: profile.displayName ?? '',
      avatar: profile.photos?.[0]?.value ?? null,
    };
  }
}
