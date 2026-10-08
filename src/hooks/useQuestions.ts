import { useState, useEffect } from 'react';
import type { AppConfig, Question, FormulaSection } from '../types';

export function useQuestions(config: AppConfig | null) {
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [formulas, setFormulas] = useState<Record<string, FormulaSection[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;

    Promise.all([
      ...config.courses.map(async (c) => {
        const r = await fetch(c.questionFile, { cache: 'no-cache' });
        if (!r.ok) throw new Error(`Failed to load ${c.questionFile}`);
        return [c.id, await r.json()] as const;
      }),
      ...config.courses.filter((c) => c.formulaFile).map(async (c) => {
        const r = await fetch(c.formulaFile!, { cache: 'no-cache' });
        if (!r.ok) return null;
        return [c.id, await r.json()] as const;
      }),
    ])
      .then((results) => {
        if (cancelled) return;
        const qs: Record<string, Question[]> = {};
        const fs: Record<string, FormulaSection[]> = {};
        for (const r of results) {
          if (!r) continue;
          const [id, data] = r;
          if (Array.isArray(data) && data.length > 0 && 'num' in data[0]) {
            qs[id] = data;
          } else {
            fs[id] = data;
          }
        }
        setQuestions(qs);
        setFormulas(fs);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('Data load warning:', err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [config]);

  return { questions, formulas, loading };
}
