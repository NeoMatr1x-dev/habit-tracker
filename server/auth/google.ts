import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser(function (user, done) {
  done(null, user as any);
});

passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:4000/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
      // In a real app you would upsert the user in your DB here.
      const user = { id: profile.id, displayName: profile.displayName, emails: profile.emails };
      return cb(null, user);
    }
  )
);
