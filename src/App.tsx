import { useEffect, useMemo, useState } from 'react';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';
import HabitDetail from './components/HabitDetail';
import SettingsPanel from './components/SettingsPanel';
import LoginScreen from './components/LoginScreen';
import type { Habit, ThemePreset, User } from './types';

const themePresets: ThemePreset[] = [
  {
    id: 'nebula',
    label: 'Nebula Glow',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #0ea5e9 100%)'
  },
  {
    id: 'sunset',
    label: 'Sunset Vibes',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
  },
  {
    id: 'mint',
    label: 'Mint Dream',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)'
  }
];

const defaultTheme = themePresets[0].id;

function getSaved<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(() =>
    getSaved<User | null>('habit-tracker-react.user', null)
  );
  const [habits, setHabits] = useState<Habit[]>(() =>
    getSaved<Habit[]>('habit-tracker-react.habits', [])
  );
  const [themeId, setThemeId] = useState<string>(() =>
    getSaved('habit-tracker-react.themeId', defaultTheme)
  );
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(() =>
    getSaved<string | null>('habit-tracker-react.selectedHabitId', null)
  );
  const [settingsOpen, setSettingsOpen] = useState<boolean>(() =>
    getSaved('habit-tracker-react.settingsOpen', user === null)
  );
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    getSaved('habit-tracker-react.darkMode', true)
  );
  const [customPresets, setCustomPresets] = useState<ThemePreset[]>(() =>
    getSaved<ThemePreset[]>('habit-tracker-react.customPresets', [])
  );

  const allPresets = useMemo(() => [...themePresets, ...customPresets], [customPresets]);
  const theme = allPresets.find((item) => item.id === themeId) ?? allPresets[0];
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId) ?? null;
  const activeCount = useMemo(() => habits.filter((habit) => !habit.completed).length, [habits]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.themeId', JSON.stringify(themeId));
  }, [themeId]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.selectedHabitId', JSON.stringify(selectedHabitId));
  }, [selectedHabitId]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.settingsOpen', JSON.stringify(settingsOpen));
  }, [settingsOpen]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      setSettingsOpen(true);
    }
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem('habit-tracker-react.customPresets', JSON.stringify(customPresets));
  }, [customPresets]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setSettingsOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAddHabit = (emoji: string, title: string, color: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      emoji,
      title,
      color,
      completed: false,
      createdAt: Date.now(),
      history: {}
    };
    setHabits((current) => [newHabit, ...current]);
    setSelectedHabitId(newHabit.id);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
    setSelectedHabitId((current) => (current === id ? null : current));
  };

  const handleCompleteHabit = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: true,
              history: { ...habit.history, [today]: true }
            }
          : habit
      )
    );
  };

  const handleToggleHabitDay = (id: string, day: string) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;
        const toggled = !habit.history[day];
        return {
          ...habit,
          history: { ...habit.history, [day]: toggled },
          completed:
            day === new Date().toISOString().slice(0, 10) ? toggled : habit.completed
        };
      })
    );
  };

  const handleSelectHabit = (id: string) => setSelectedHabitId(id);

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const handleClearAssets = () => {
    setHabits([]);
    setSelectedHabitId(null);
    setSettingsOpen(true);
  };

  const handleSavePreset = (preset: ThemePreset) => {
    setCustomPresets((cur) => [preset, ...cur]);
  };

  return (
    <>
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <main className={`app-shell ${darkMode ? 'dark' : 'light'}`} style={{ background: theme.gradient, backgroundBlendMode: 'screen' }}>
          <div className="wallpaper-overlay" />

          <div className="app-container">
            <header className="mobile-nav">
              <button className="circle-button side-button" type="button" onClick={toggleDarkMode}>
                {darkMode ? '🌙' : '☀️'}
              </button>

              <div className="brand-summary">
                <p className="notice">{user ? `${user.name}` : ''}</p>
                <h1 className="brand-title">Habits</h1>
              </div>

              <div className="top-actions">
                <button className="circle-button" type="button" onClick={() => setShowHabitForm(true)}>
                  +
                </button>
                <button className="circle-button" type="button" onClick={() => setSettingsOpen(true)}>
                  ⚙️
                </button>
              </div>
            </header>

            {showHabitForm ? (
              <section className="modal-panel card">
                <div className="modal-header">
                  <h2 className="card-title">Add habit</h2>
                  <button className="button secondary-button" type="button" onClick={() => setShowHabitForm(false)}>
                    Close
                  </button>
                </div>
                <HabitForm
                  onAdd={(emoji, title, color) => {
                    handleAddHabit(emoji, title, color);
                    setShowHabitForm(false);
                  }}
                />
              </section>
            ) : null}

            <section className="card habits-section">
              <h2 className="card-title">Your habits</h2>
              <div className="habit-list">
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      selected={habit.id === selectedHabitId}
                      onDelete={handleDeleteHabit}
                      onComplete={handleCompleteHabit}
                      onSelect={handleSelectHabit}
                    />
                  ))
                ) : (
                  <p className="notice">No habits yet. Use the plus button to add one.</p>
                )}
              </div>
              <div className="footer-bar">
                <button className="button secondary-button" type="button" onClick={handleClearAssets}>
                  Reset habits & open settings
                </button>
                <span className="notice">Tap settings to manage account, profile, and privacy.</span>
              </div>
            </section>

            <div className="detail-section">
              <HabitDetail habit={selectedHabit} onToggleDay={handleToggleHabitDay} onComplete={handleCompleteHabit} />
            </div>
          </div>

          {settingsOpen ? (
            <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
              <div className="settings-modal" onClick={(event) => event.stopPropagation()}>
                <SettingsPanel
                  user={user}
                  presets={allPresets}
                  activeThemeId={theme.id}
                  onClose={() => setSettingsOpen(false)}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onUpdateProfile={handleUpdateProfile}
                  onSelectTheme={setThemeId}
                  onSavePreset={handleSavePreset}
                />
              </div>
            </div>
          ) : null}
        </main>
      )}
    </>
  );
}
