import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  onSelect: (letter: string) => void;
  showResult: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showResult,
}: QuestionCardProps) {
  const tierLabel = question.tier?.replace(/^Tier \d+ — /, '') || '';

  return (
    <div className="question-card">
      <div className="q-meta">
        <span className="q-number">Q{question.num}</span>
        {tierLabel && <span className="q-tier">{tierLabel}</span>}
      </div>
      <p className="q-text">{question.question}</p>
      <div className="q-options">
        {LETTERS.map((letter) => {
          const isSelected = selectedAnswer === letter;
          const isCorrect = correctAnswer === letter;
          const isWrong = isSelected && !isCorrect;
          let cls = 'q-option';
          if (showResult) {
            if (isCorrect) cls += ' correct';
            if (isWrong) cls += ' wrong';
            if (isSelected && isCorrect) cls += ' selected-correct';
          }
          return (
            <button
              key={letter}
              className={cls}
              onClick={() => !showResult && onSelect(letter)}
              disabled={showResult}
            >
              <span className="option-letter">{letter}</span>
              <div className="option-content">
                <span className="option-text">{question.options[letter]}</span>
                {showResult && question.optionContext?.[letter] && (
                  <div className={`option-context ${isCorrect ? 'context-correct' : 'context-distractor'}`}>
                    <span className="context-badge">{isCorrect ? '✓ Why this is correct' : '✗ Why this is incorrect'}</span>
                    <span className="context-desc">{question.optionContext[letter]}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
