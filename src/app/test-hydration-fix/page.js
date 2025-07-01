
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load ReactMarkdown
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false
});

const remarkGfm = dynamic(() => import('remark-gfm'), { ssr: false });

// Test markdown content that would previously cause hydration errors
const testMarkdownContent = `
# Test Heading

This is a paragraph with normal text.

![TEST_IMAGE](test-image-placeholder)

This is another paragraph after an image.

> This is a blockquote that contains important information.

## Another Heading

- List item 1
- List item 2
- List item 3

![ANOTHER_IMAGE](another-test-image)

Final paragraph to test the structure.
`;

export default function TestHydrationFix() {
  // Mock visuals map for testing
  const visualsMap = {
    'TEST-IMAGE-PLACEHOLDER': {
      displayUrl: 'https://i.ytimg.com/vi/NVg0GfEtGQA/maxresdefault.jpg',
      caption: 'Test Image Caption'
    },
    'ANOTHER-TEST-IMAGE': {
      displayUrl: 'https://i.ytimg.com/vi/0te-17ybMgc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBYgcigRMA8=&rs=AOn4CLDO5V1py-QuOrwMII4omNISRoohmA',
      caption: 'Another Test Image'
    }
  };

  // Use the same markdown components from ImmersiveSectionPlayer with hydration fixes
  const markdownComponents = {
    // Fixed paragraph component
    p: ({ node, children }) => {
      const hasBlockElements = node?.children?.some(child => 
        child.tagName === 'img' || 
        child.tagName === 'div' || 
        child.tagName === 'blockquote' ||
        child.tagName === 'h1' || 
        child.tagName === 'h2' || 
        child.tagName === 'h3' ||
        child.tagName === 'ul' ||
        child.tagName === 'ol'
      );
      
      if (hasBlockElements) {
        return <div className="my-6">{children}</div>;
      }
      
      return (
        <p className="text-lg leading-relaxed text-gray-700 mb-6 font-light tracking-wide">
          {children}
        </p>
      );
    },
    
    // Fixed image component
    img: ({ node, ...props }) => {
      const imageIdentifier = props.src;
      const normalizedIdentifier = imageIdentifier?.toString().toUpperCase().trim() || '';
      
      const visual = visualsMap?.[normalizedIdentifier];

      if (visual && visual.displayUrl) {
        return (
          <div className="my-8">
            <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-4">
              <img
                src={visual.displayUrl}
                alt={props.alt || visual.caption}
                className="rounded-xl shadow-lg mx-auto max-w-full h-auto"
              />
              {visual.caption && (
                <div className="text-center mt-4 text-blue-600 italic">
                  {visual.caption}
                </div>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className="my-8">
          <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-6 text-center">
            <div className="text-amber-500 text-2xl mb-2">⚠️</div>
            <p className="text-blue-600">
              <em>Image: {props.alt || imageIdentifier} not found</em>
            </p>
          </div>
        </div>
      );
    },
    
    // Fixed blockquote component
    blockquote: ({ children }) => (
      <div className="my-8">
        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500">
          <div className="text-blue-800 italic text-lg font-light">
            {children}
          </div>
        </div>
      </div>
    ),
    
    h1: ({ children }) => (
      <h1 className="text-3xl font-serif text-blue-900 mb-8 mt-12">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-serif text-blue-900 mb-6 mt-10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-serif text-blue-900 mb-4 mt-8">
        {children}
      </h3>
    ),
    
    ul: ({ children }) => (
      <ul className="space-y-3 my-6 text-gray-700">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start space-x-3">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
        <span className="text-lg leading-relaxed">{children}</span>
      </li>
    ),
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-12 mb-8">
          <h1 className="text-4xl font-serif text-blue-900 mb-6 text-center">
            Hydration Fix Test Page
          </h1>
          <p className="text-blue-600 text-center mb-8">
            This page tests the markdown rendering with the hydration error fix applied.
            Check the browser console - there should be no hydration errors.
          </p>
        </div>
        
        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-serif text-blue-900 mb-6">
            Test Markdown Content
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              components={markdownComponents} 
              remarkPlugins={[remarkGfm]}
            >
              {testMarkdownContent}
            </ReactMarkdown>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Open browser console to check for hydration errors. 
            If the fix is successful, there should be no React hydration warnings.
          </p>
        </div>
      </div>
    </div>
  );
}
