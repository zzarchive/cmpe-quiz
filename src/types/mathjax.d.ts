interface MathJaxObject {
  typesetPromise?: (elements?: (HTMLElement | null)[]) => Promise<void>;
  typesetClear?: (elements?: (HTMLElement | null)[]) => void;
  startup?: {
    defaultReady?: () => void;
    document?: {
      clear: () => void;
      updateDocument: () => void;
    };
  };
}

interface Window {
  MathJax?: MathJaxObject;
  mathJaxReady?: boolean;
}
