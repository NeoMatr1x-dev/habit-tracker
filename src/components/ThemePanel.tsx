import type { ThemePreset } from '../types';

type ThemePanelProps = {
  presets: ThemePreset[];
  active: string;
  onSelect: (presetId: string) => void;
};

export default function ThemePanel({ presets, active, onSelect }: ThemePanelProps) {
  return (
    <div className="card">
      <h2 className="card-title">Choose your gradient theme</h2>
      <div className="theme-palette">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={preset.id === active ? 'swatch active' : 'swatch'}
            style={{ background: preset.gradient }}
            onClick={() => onSelect(preset.id)}
            aria-label={preset.label}
          />
        ))}
      </div>
    </div>
  );
}
