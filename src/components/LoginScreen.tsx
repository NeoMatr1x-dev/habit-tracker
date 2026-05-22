import { useState } from 'react';
import type { User } from '../types';
import { IconGoogle } from './icons';

type LoginScreenProps = {
  onLogin: (user: User) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('Ready');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Authenticating...');

    setTimeout(() => {
      const user: User = {
        email,
        name: email.split('@')[0],
        provider: 'password',
        avatar: undefined
      };
      onLogin(user);
      setStatus('Ready');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setStatus('Connecting to Google...');
    setTimeout(() => {
      const user: User = {
        email: 'user@gmail.com',
        name: 'Guest User',
        provider: 'google',
        avatar: undefined
      };
      onLogin(user);
      setStatus('Ready');
    }, 1200);
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGrid} />
      
      <div style={styles.modal}>
        <div style={styles.cornerDeco} />
        <div style={{ ...styles.cornerDeco, top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' }} />
        <div style={{ ...styles.cornerDeco, bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' }} />
        <div style={{ ...styles.cornerDeco, bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }} />

        <div style={styles.header}>
          <h1 style={styles.title}>Access</h1>
          <p style={styles.status}>◀ {status}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>👤</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <div style={styles.socialGrid}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={styles.socialBtn}
            title="Sign in with Google"
          >
            <IconGoogle size={20} />
          </button>
          <button
            type="button"
            onClick={() => {
              const user: User = { email: 'demo@habit.app', name: 'Demo', provider: 'demo', avatar: undefined };
              onLogin(user);
            }}
            style={styles.socialBtn}
            title="Demo Login"
          >
            ✨
          </button>
        </div>

        <p style={styles.footer}>Habit Tracker • Sign in to continue</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #5b21b6 0%, #0ea5e9 100%)',
    zIndex: 100,
  },
  bgGrid: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
    opacity: 0.3,
  },
  modal: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: 420,
    padding: 40,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 32,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 120px rgba(0,0,0,0.35)',
  },
  cornerDeco: {
    position: 'absolute' as const,
    width: 20,
    height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    top: 0,
    left: 0,
    borderRight: 'none',
    borderBottom: 'none',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#eef2ff',
    margin: '0 0 8px 0',
    letterSpacing: 2,
  },
  status: {
    fontSize: 12,
    color: '#cbd5e1',
    margin: 0,
    letterSpacing: 1,
  },
  form: {
    display: 'grid' as const,
    gap: 20,
  },
  formGroup: {
    display: 'grid' as const,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#cbd5e1',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
  },
  icon: {
    position: 'absolute' as const,
    left: 14,
    fontSize: 16,
    pointerEvents: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#eef2ff',
    fontSize: 14,
    outline: 'none' as const,
    transition: 'all 200ms ease',
  },
  toggleBtn: {
    position: 'absolute' as const,
    right: 12,
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    padding: 4,
    color: '#cbd5e1',
    transition: 'color 200ms ease',
  },
  submitBtn: {
    padding: 14,
    background: 'linear-gradient(90deg, rgba(123, 58, 237, 0.6), rgba(6, 182, 212, 0.6))',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    color: '#eef2ff',
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  divider: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 12,
    margin: '24px 0',
  },
  dividerText: {
    flex: 1,
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    display: 'block',
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center' as const,
    padding: '0 12px',
  },
  socialGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#eef2ff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    transition: 'all 200ms ease',
  },
  footer: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: '#94a3b8',
    margin: 0,
    letterSpacing: 0.5,
  },
};
