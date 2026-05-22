import { useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '../types';

type AuthPanelProps = {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
};

export default function AuthPanel({ user, onLogin, onLogout }: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    onLogin({ email: email.trim(), provider: 'local' });
    setEmail('');
    setPassword('');
  };

  return (
    <div className="card auth-card">
      <h2 className="card-title">Account & sync</h2>
      {user ? (
        <div className="auth-summary">
          <p className="notice">Signed in as</p>
          <div className="user-chip">{user.email}</div>
          <button className="button secondary-button" type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-row">
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            placeholder="Create a password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="button" type="submit">
            Save progress
          </button>

          <div className="social-login">
            <button
              className="button secondary-button"
              type="button"
              onClick={() => onLogin({ email: 'google-user@example.com', provider: 'google' })}
            >
              Continue with Google
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
