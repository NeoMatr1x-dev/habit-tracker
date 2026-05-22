export type Habit = {
  id: string;
  emoji: string;
  title: string;
  color: string;
  completed: boolean;
  createdAt: number;
  history: Record<string, boolean>;
};

export type WallpaperAsset = {
  url: string;
  type: 'image' | 'video';
  name: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  gradient: string;
};

export type User = {
  email: string;
  provider: 'google' | 'local';
  name: string;
  avatar?: string;
};
