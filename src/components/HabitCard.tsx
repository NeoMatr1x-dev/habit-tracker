import { useEffect, useRef, useState } from 'react';
import type { Habit } from '../types';

type HabitCardProps = {
  habit: Habit;
  selected: boolean;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onSelect: (id: string) => void;
};

export default function HabitCard({ habit, selected, onDelete, onComplete, onSelect }: HabitCardProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) setTrackWidth(trackRef.current.clientWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const maxDistance = Math.max(0, trackWidth - 56);

  useEffect(() => {
    if (!isDragging) {
      setDragX(habit.completed ? maxDistance : 0);
    }
  }, [isDragging, habit.completed, maxDistance]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const nextX = event.clientX - rect.left - 28;
      setDragX(Math.min(Math.max(0, nextX), maxDistance));
    };

    const handleUp = () => {
      if (!isDragging) return;
      if (dragX >= maxDistance * 0.72 && !habit.completed) {
        onComplete(habit.id);
      }
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragX, isDragging, maxDistance, habit.completed, habit.id, onComplete]);

  return (
    <article
      className={`habit-card ${selected ? 'selected' : ''}`}
      style={{ borderColor: habit.color }}
      onClick={() => onSelect(habit.id)}
    >
      <div className="habit-title-wrap">
        <h3 className={habit.completed ? 'completed' : ''}>
          {habit.emoji} {habit.title}
        </h3>
        <p className="habit-meta">
          <span className="badge" style={{ backgroundColor: `${habit.color}20` }}>
            {habit.completed ? 'Completed' : 'Swipe to complete'}
          </span>
        </p>
      </div>

      <div ref={trackRef} className="swipe-track">
        <div className="swipe-track-inner" />
        <button
          className="swipe-knob"
          type="button"
          style={{ transform: `translateX(${dragX}px)`, backgroundColor: habit.color }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
          }}
        >
          {habit.completed ? '✓' : '➜'}
        </button>
        <span className="swipe-label">
          {habit.completed ? 'Done for today' : 'Slide to finish'}
        </span>
      </div>

      <div className="actions">
        <button
          className="button secondary-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(habit.id);
          }}
        >
          Delete
        </button>
        <button
          className="button secondary-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onComplete(habit.id);
          }}
        >
          Mark complete
        </button>
      </div>
    </article>
  );
}
