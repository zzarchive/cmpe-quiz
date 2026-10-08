import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, Answer } from '../types';
import { QuestionCard } from './QuestionCard';
import { formatTime } from '../utils/formatTime';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  answered: number;
  elapsed: number;
  courseTitle: string;
  onSelectAnswer: (selected: string, timeSpent: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

import { typesetMath } from '../utils/mathjax';

export function QuizScreen({
  questions,
  currentIndex,
  answers,
  score,
  answered,
  elapsed,
  onSelectAnswer,
  onNext,
  onPrev,
  onExit,
  courseTitle,
}: QuizScreenProps) {
  const total = questions.length;
  const q = questions[currentIndex];
  const prevAnswer = answers.find((a) => a.qIndex === currentIndex) ?? null;
  const progress = ((currentIndex + (prevAnswer ? 1 : 0)) / total) * 100;
  const [hasAnswered, setHasAnswered] = useState(!!prevAnswer);
  const prevIndexRef = useRef(currentIndex);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      setHasAnswered(false);
      questionStartRef.current = Date.now();
    }
  }, [currentIndex]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q) {
      const timer = setTimeout(() => {
        typesetMath(containerRef.current);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [q, currentIndex, prevAnswer, hasAnswered]);

  const handleSelect = useCallback((letter: string) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);
    onSelectAnswer(letter, timeSpent);
  }, [hasAnswered, onSelectAnswer]);

  if (!q) return null;

  return (
    <div className="screen-content" ref={containerRef}>
      <div className="quiz-top">
        <span className="quiz-course-label">{courseTitle}</span>
      </div>
      <div className="quiz-header">
        <div className="quiz-progress-text">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className="quiz-score">Score: {score}/{answered}</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>

      <QuestionCard
        question={q}
        index={currentIndex}
        total={total}
        selectedAnswer={prevAnswer?.selected ?? null}
        correctAnswer={prevAnswer?.correct ?? null}
        onSelect={handleSelect}
        showResult={hasAnswered}
      />

      {hasAnswered && prevAnswer && (
        <div className={`feedback ${prevAnswer.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">{prevAnswer.isCorrect ? '✅' : '❌'}</span>
            <span className={`feedback-title ${prevAnswer.isCorrect ? 'correct-title' : 'wrong-title'}`}>
              {prevAnswer.isCorrect ? 'Correct!' : `Wrong — Answer: ${prevAnswer.correct}`}
            </span>
            <span className="feedback-time">⏱ {formatTime(prevAnswer.timeSpent)}</span>
          </div>
          <p className="feedback-explanation">{q.explanation}</p>
        </div>
      )}

      <div className="quiz-nav">
        <button
          className="nav-btn prev-btn"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          ← Prev
        </button>
        {hasAnswered && (
          <button className="nav-btn next-btn" onClick={onNext}>
            {currentIndex < total - 1 ? 'Next →' : 'View Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
