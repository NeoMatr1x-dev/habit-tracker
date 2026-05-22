import express from 'express';
import session from 'cookie-session';
import passport from 'passport';
import cors from 'cors';
import './auth/google';

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ name: 'session', keys: [process.env.SESSION_SECRET || 'dev-secret'], maxAge: 24 * 60 * 60 * 1000 }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/user', (req, res) => {
  // @ts-ignore
  res.json({ user: req.user || null });
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Auth server listening on ${port}`));
