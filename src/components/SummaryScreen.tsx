import { useEffect, useRef, useState } from 'react';
import type { Answer, QuizMode } from '../types';
import { formatTime } from '../utils/formatTime';
import { ModuleBreakdown } from './ModuleBreakdown';
import { ReviewList } from './ReviewList';

interface SummaryScreenProps {
  mode: QuizMode;
  moduleFilter: string | null;
  total: number;
  score: number;
  elapsed: number;
  answers: Answer[];
  onRestart: () => void;
  onBackToCourses: () => void;
  courseTitle: string;
}

export function SummaryScreen({
  total,
  score,
  elapsed,
  answers,
  onRestart,
  onBackToCourses,
  courseTitle,
}: SummaryScreenProps) {
  const pct = Math.round((score / total) * 100);
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setBarWidth(pct), 100);
    return () => clearTimeout(id);
  }, [pct]);

  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const gradeColor = pct >= 70 ? 'var(--color-success)' : pct >= 50 ? '#f59e0b' : 'var(--color-error)';

  return (
    <div className="screen-content">
      <div className="card summary-card">
        <h2 className="summary-title">{courseTitle} · Results</h2>
        <div className="score-hero">
          <div className="score-big" style={{ color: gradeColor }}>{score}<span className="score-total">/{total}</span></div>
          <div className="score-pct">{pct}% correct</div>
          <div className="score-grade" style={{ background: gradeColor }}>{grade}</div>
          <div className="score-time">⏱ {formatTime(elapsed)} total</div>
        </div>
        <div className="score-bar-track">
          <div
            ref={barRef}
            className="score-bar-fill"
            style={{
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, var(--color-success), ${gradeColor})`,
            }}
          />
        </div>
      </div>

      <ModuleBreakdown answers={answers} />

      <ReviewList answers={answers} />

      <div className="summary-actions">
        <button className="action-btn action-restart" onClick={onRestart}>🔄 Restart Quiz</button>
        <button className="action-btn action-switch" onClick={onBackToCourses}>📚 Switch Course</button>
      </div>
    </div>
  );
}
