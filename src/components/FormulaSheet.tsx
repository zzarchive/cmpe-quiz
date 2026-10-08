import { useEffect } from 'react';
import type { FormulaSection } from '../types';

interface FormulaSheetProps {
  formulas: FormulaSection[];
  onClose: () => void;
}

function typesetMath() {
  window.MathJax?.typesetPromise?.().catch(() => {});
}

export function FormulaSheet({ formulas, onClose }: FormulaSheetProps) {
  useEffect(() => {
    typesetMath();
  }, [formulas]);

  if (!formulas || formulas.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-formula" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📐 Formula Sheet</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">Reference formulas — just like on exam day</p>
        <div className="formula-content">
          {formulas.map((section) => (
            <div key={section.module} className="formula-section">
              <h3>{section.module}</h3>
              {section.formulas.map((f, i) => (
                <div key={i} className="formula-row">
                  <span className="formula-name">{f.name}</span>
                  <span className="formula-latex">{f.latex}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className="modal-close-bottom" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
