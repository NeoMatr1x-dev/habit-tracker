import { useState } from 'react';

type HabitFormProps = {
  onAdd: (emoji: string, title: string, color: string) => void;
};

const presetColors = ['#7c3aed', '#22d3ee', '#f97316', '#ec4899', '#14b8a6', '#fde68a'];

export default function HabitForm({ onAdd }: HabitFormProps) {
  const [emoji, setEmoji] = useState('✨');
  const [title, setTitle] = useState('New Habit');
  const [color, setColor] = useState(presetColors[0]);

  return (
    <form
      className="card"
      onSubmit={(event) => {
        event.preventDefault();
        onAdd(emoji.trim() || '✨', title.trim() || 'New Habit', color);
        setTitle('');
      }}
    >
      <h2 className="card-title">Add a habit with emoji</h2>
      <div className="form-row">
        <label className="label" htmlFor="emoji">Emoji</label>
        <input
          id="emoji"
          className="input"
          type="text"
          value={emoji}
          maxLength={4}
          onChange={(event) => setEmoji(event.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="title">Habit title</label>
        <input
          id="title"
          className="input"
          type="text"
          value={title}
          placeholder="e.g. Read, move, hydrate"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label">Accent color</label>
        <div className="tones">
          {presetColors.map((tone) => (
            <button
              key={tone}
              type="button"
              className={`color-dot ${tone === color ? 'active' : ''}`}
              style={{ backgroundColor: tone }}
              onClick={() => setColor(tone)}
              aria-label={`Select ${tone}`}
            />
          ))}
        </div>
      </div>

      <button className="button" type="submit">
        Add habit
      </button>
    </form>
  );
}
