import type { Answer } from '../types';

interface ModuleBreakdownProps {
  answers: Answer[];
}

export function ModuleBreakdown({ answers }: ModuleBreakdownProps) {
  const byTier: Record<string, { correct: number; total: number }> = {};
  for (const a of answers) {
    const tier = a.question.tier?.replace(/^Tier \d+ — /, '') || 'General';
    if (!byTier[tier]) byTier[tier] = { correct: 0, total: 0 };
    byTier[tier].total++;
    if (a.isCorrect) byTier[tier].correct++;
  }

  const tiers = Object.entries(byTier).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="module-breakdown">
      <h3 className="breakdown-title">Performance by Topic</h3>
      <div className="breakdown-list">
        {tiers.map(([tier, data]) => {
          const pct = Math.round((data.correct / data.total) * 100);
          return (
            <div key={tier} className="breakdown-item">
              <div className="breakdown-row">
                <span className="breakdown-name">{tier}</span>
                <span className="breakdown-stat">{data.correct}/{data.total} ({pct}%)</span>
              </div>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 70 ? 'var(--color-success)' : pct >= 50 ? '#f59e0b' : 'var(--color-error)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
