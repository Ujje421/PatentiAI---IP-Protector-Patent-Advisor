
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface DiagramViewProps {
  code: string;
}

const DiagramView: React.FC<DiagramViewProps> = ({ code }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.mermaid && mermaidRef.current) {
      window.mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      window.mermaid.contentLoaded();
    }
  }, [code]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 overflow-x-auto">
      <div className="mermaid" ref={mermaidRef}>
        {code}
      </div>
    </div>
  );
};

export default DiagramView;
