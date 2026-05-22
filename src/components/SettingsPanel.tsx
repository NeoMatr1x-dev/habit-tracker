import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { ThemePreset, User } from '../types';
import { IconAdd } from './icons';

type SettingsPanelProps = {
  user: User | null;
  presets: ThemePreset[];
  activeThemeId: string;
  onClose: () => void;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onUpdateProfile: (user: User) => void;
  onSelectTheme: (id: string) => void;
  onSavePreset?: (preset: ThemePreset) => void;
};

export default function SettingsPanel({
  user,
  presets,
  activeThemeId,
  onClose,
  onLogin,
  onLogout,
  onUpdateProfile,
  onSelectTheme,
  onSavePreset
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy'>(user ? 'profile' : 'account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [presetLabel, setPresetLabel] = useState('');
  const [colorA, setColorA] = useState('#7c3aed');
  const [colorB, setColorB] = useState('#06b6d4');

  useEffect(() => {
    setName(user?.name ?? '');
    setAvatar(user?.avatar ?? '');
    setActiveTab(user ? 'profile' : 'account');
  }, [user]);

  const defaultName = useMemo(() => {
    if (!email) return '';
    return email.split('@')[0];
  }, [email]);

  const handleProfileSave = () => {
    if (!user) return;
    onUpdateProfile({ ...user, name: name.trim() || defaultName || 'HabitHero', avatar });
  };

  const handleManualLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    onLogin({
      email: email.trim(),
      provider: 'local',
      name: name.trim() || defaultName || 'HabitHero',
      avatar
    });
    setEmail('');
    setPassword('');
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        if (user) {
          onUpdateProfile({ ...user, avatar: reader.result, name: name.trim() || user.name });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const gradientPreview = `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`;

  const handleSavePresetClick = () => {
    const id = crypto.randomUUID();
    const preset: ThemePreset = { id, label: presetLabel || 'Custom', gradient: gradientPreview };
    try {
      if (onSavePreset) onSavePreset(preset);
      // also select the new preset immediately
      onSelectTheme(preset.id);
      setPresetLabel('');
    } catch (e) {
      // noop
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div>
          <h2 className="card-title">Settings</h2>
          <p className="notice">Manage account, profile, privacy, and app appearance from one place.</p>
        </div>
        <button className="button secondary-button close-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="settings-tabs">
        <button type="button" className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Profile
        </button>
        <button type="button" className={`tab ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
          Account
        </button>
        <button type="button" className={`tab ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
          Privacy
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="settings-content">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" style={{ backgroundImage: avatar ? `url(${avatar})` : undefined }}>
              {!avatar && <span>Upload</span>}
            </div>
            <label className="button secondary-button upload-button">
              Choose photo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </label>
          </div>
          <div className="form-row">
            <label className="label" htmlFor="profile-name">
              Display name
            </label>
            <input
              id="profile-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>
          <button className="button" type="button" onClick={handleProfileSave}>
            Save profile
          </button>
        </div>
      ) : null}

      {activeTab === 'account' ? (
        <div className="settings-content">
          {user ? (
            <div className="account-summary">
              <p className="notice">Signed in as</p>
              <div className="user-chip">{user.email}</div>
              <button className="button secondary-button" type="button" onClick={onLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <form className="form-row" onSubmit={handleManualLogin}>
              <div>
                <label className="label" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                />
              </div>
              <button className="button" type="submit">
                Login or save account
              </button>
              <div className="social-login">
                <button
                  className="button secondary-button"
                  type="button"
                  onClick={() => onLogin({ email: 'google-user@example.com', provider: 'google', name: 'Google User', avatar: '' })}
                >
                  Continue with Google
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {activeTab === 'privacy' ? (
        <div className="settings-content privacy-content">
          <h3 className="card-title">Privacy policy</h3>
          <p className="notice">
            This app stores your habits and profile locally in the browser. Login is used to simulate saved progress and personalization.
          </p>
          <p>
            We do not collect any real data in this demo version. If you integrate real sync later, your email and profile information can be secured using OAuth or a backend service.
          </p>
          <p>
            Your habits remain private on your device unless you add a backend service for cloud sync.
          </p>
        </div>
      ) : null}

      <div className="theme-section">
        <h3 className="label">App theme</h3>
        <div className="theme-palette settings-palette">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={preset.id === activeThemeId ? 'swatch active' : 'swatch'}
              style={{ background: preset.gradient }}
              onClick={() => onSelectTheme(preset.id)}
              aria-label={preset.label}
            >
              <div style={{ padding: 12 }}>
                <div className="swatch-label">{preset.label}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="preset-creator">
          <h4 className="label">Create custom gradient</h4>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
            <input type="color" value={colorA} onChange={(e) => setColorA(e.target.value)} />
            <input type="color" value={colorB} onChange={(e) => setColorB(e.target.value)} />
            <input className="input" placeholder="Preset name" value={presetLabel} onChange={(e) => setPresetLabel(e.target.value)} />
            <button className="button" type="button" onClick={handleSavePresetClick} title="Save preset">
              <IconAdd />
            </button>
          </div>

          <div className="preset-preview" style={{ marginTop: 12 }}>
            <div style={{ height: 64, borderRadius: 12, background: gradientPreview, border: '1px solid rgba(255,255,255,0.06)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
