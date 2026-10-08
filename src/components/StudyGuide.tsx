import { useState, useEffect, useCallback } from 'react';
import type { StudyGuide as StudyGuideType } from '../types';
import { renderMarkdown } from '../utils/markdown';

interface StudyGuideProps {
  guides: StudyGuideType[];
  onClose: () => void;
}

function typesetMath() {
  window.MathJax?.typesetPromise?.().catch(() => {});
}

export function StudyGuide({ guides, onClose }: StudyGuideProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModule = useCallback(async (file: string) => {
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const resp = await fetch(file);
      if (!resp.ok) throw new Error(`Failed to load guide`);
      const text = await resp.text();
      const html = file.endsWith('.md') ? renderMarkdown(text) : text;
      setContent(`<div class="sg-module-content">${html}</div>`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const showModules = useCallback(() => {
    setContent(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    typesetMath();
  }, [content]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-study-guide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📖 Study Guide</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!content && !loading && !error && (
          <div className="sg-module-list">
            <p className="modal-subtitle">Select a module to review:</p>
            {guides.map((g) => {
              const isAll = g.id === 'all';
              return (
                <button
                  key={g.id}
                  className={`sg-module-btn ${isAll ? 'sg-module-all' : ''}`}
                  onClick={() => loadModule(g.file)}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        )}

        {loading && <p className="sg-loading">Loading…</p>}
        {error && <p className="sg-error">⚠️ {error}</p>}

        {content && (
          <div className="sg-content">
            <button className="sg-back" onClick={showModules}>← Back to modules</button>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}

        <button className="modal-close-bottom" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
