import React, { useMemo } from 'react';
import { marked } from 'marked';
import { useHighlight } from '../../context/HighlightContext';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const { highlightEnabled } = useHighlight();

  const htmlContent = useMemo(() => {
    if (!content) return '';
    try {
      marked.setOptions({
        gfm: true,
        breaks: true,
      });

      // Pre-process ==highlight== syntax
      const processed = content.replace(/==([^=\n]+)==/g, (_match, p1) => {
        if (highlightEnabled) {
          return `<mark class="rj-highlight">${p1}</mark>`;
        }
        return p1;
      });

      return marked.parse(processed) as string;
    } catch (e) {
      console.error('Failed to parse markdown', e);
      return content;
    }
  }, [content, highlightEnabled]);

  return (
    <div
      className={`markdown-body font-hi leading-relaxed text-stone-800 dark:text-stone-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

