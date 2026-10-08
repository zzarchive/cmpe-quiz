export function typesetMath(container?: HTMLElement | null) {
  const mj = window.MathJax;
  if (!mj?.typesetPromise) return;

  try {
    if (container) {
      mj.typesetClear?.([container]);
      mj.typesetPromise([container]).catch(() => {});
    } else {
      mj.typesetClear?.();
      mj.typesetPromise().catch(() => {});
    }
  } catch (e) {
    console.warn('MathJax typesetting error:', e);
  }
}
