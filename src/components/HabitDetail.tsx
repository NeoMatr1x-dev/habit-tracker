import type { Habit } from '../types';

type HabitDetailProps = {
  habit: Habit | null;
  onToggleDay: (habitId: string, day: string) => void;
  onComplete: (habitId: string) => void;
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLastDays(count: number) {
  const days: string[] = [];
  const now = new Date();
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

export default function HabitDetail({ habit, onToggleDay, onComplete }: HabitDetailProps) {
  const lastDays = getLastDays(7);
  if (!habit) {
    return (
      <div className="card detail-card">
        <h2 className="card-title">Select a habit</h2>
        <p className="notice">Tap a habit to see its calendar and progress details.</p>
      </div>
    );
  }

  return (
    <div className="card detail-card" style={{ borderColor: habit.color }}>
      <div className="detail-header">
        <div>
          <p className="notice">Selected habit</p>
          <h2 className="card-title">{habit.emoji} {habit.title}</h2>
        </div>
        <span className="detail-chip" style={{ backgroundColor: habit.color }}>
          {habit.completed ? 'Tracked' : 'In progress'}
        </span>
      </div>

      <div className="detail-summary">
        <div className="round-square" style={{ borderColor: habit.color }}>
          <span>{Object.values(habit.history).filter(Boolean).length}</span>
          <p>Days done</p>
        </div>
        <div className="round-square" style={{ borderColor: habit.color }}>
          <span>{habit.completed ? '✓' : '•'}</span>
          <p>Today</p>
        </div>
      </div>

      <section className="calendar-grid">
        {lastDays.map((day) => {
          const date = new Date(day);
          const label = dayLabels[date.getDay()];
          const completed = Boolean(habit.history[day]);
          return (
            <button
              type="button"
              key={day}
              className={`calendar-day ${completed ? 'calendar-done' : ''}`}
              onClick={() => onToggleDay(habit.id, day)}
            >
              <span>{label}</span>
              <strong>{date.getDate()}</strong>
            </button>
          );
        })}
      </section>

      <button className="button" type="button" onClick={() => onComplete(habit.id)}>
        Mark today as done
      </button>
    </div>
  );
}
