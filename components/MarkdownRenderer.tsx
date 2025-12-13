import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GroundingChunk } from '../types';
import { ExternalLink, MapPin } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  groundingChunks?: GroundingChunk[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, groundingChunks }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none break-words">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer" />
          ),
          p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-2" />,
          ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-2" />,
          code: ({ className, children, ...props }) => {
             // Cast props to any because react-markdown types can be tricky with the inline property
             const isInline = (props as any).inline;
             return isInline ? (
              <code className="bg-surfaceLight px-1 py-0.5 rounded text-primary-200 text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-surfaceLight p-3 rounded-lg overflow-x-auto my-2 border border-slate-700">
                <code className="text-sm font-mono text-slate-200 block" {...props}>
                  {children}
                </code>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {groundingChunks && groundingChunks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {groundingChunks.map((chunk, idx) => {
            if (chunk.web) {
              return (
                <a
                  key={idx}
                  href={chunk.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surfaceLight hover:bg-slate-700 rounded-full text-xs text-slate-300 border border-slate-700 transition-colors"
                >
                  <ExternalLink size={12} />
                  <span className="truncate max-w-[150px]">{chunk.web.title}</span>
                </a>
              );
            }
            if (chunk.maps) {
              return (
                <a
                  key={idx}
                  href={chunk.maps.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surfaceLight hover:bg-slate-700 rounded-full text-xs text-slate-300 border border-slate-700 transition-colors"
                >
                  <MapPin size={12} className="text-red-400" />
                  <span className="truncate max-w-[150px]">{chunk.maps.title}</span>
                </a>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;