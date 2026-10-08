let typesetChain: Promise<any> = Promise.resolve();

export function typesetMath(container?: HTMLElement | null) {
  const mj = window.MathJax;
  if (!mj?.typesetPromise) {
    const handler = () => {
      document.removeEventListener('mathjax-ready', handler);
      typesetMath(container);
    };
    document.addEventListener('mathjax-ready', handler);
    return;
  }

  const typesetPromise = mj.typesetPromise;
  const typesetClear = mj.typesetClear;
  typesetChain = typesetChain
    .then(async () => {
      try {
        if (container) {
          typesetClear?.([container]);
          await typesetPromise?.([container]);
        } else {
          typesetClear?.();
          await typesetPromise?.();
        }
      } catch (e) {
        console.warn('MathJax typesetting error:', e);
      }
    })
    .catch((e) => {
      console.warn('MathJax chain error:', e);
    });
}
