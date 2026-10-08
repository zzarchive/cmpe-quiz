interface MathJaxObject {
  typesetPromise?: () => Promise<void>;
  startup?: {
    document?: {
      clear: () => void;
      updateDocument: () => void;
    };
  };
}

interface Window {
  MathJax?: MathJaxObject;
}
