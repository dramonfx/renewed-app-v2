'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load ReactMarkdown
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
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
      caption: 'Test Image Caption',
    },
    'ANOTHER-TEST-IMAGE': {
      displayUrl:
        'https://i.ytimg.com/vi/0te-17ybMgc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBYgcigRMA8=&rs=AOn4CLDO5V1py-QuOrwMII4omNISRoohmA',
      caption: 'Another Test Image',
    },
  };

  // Use the same markdown components from ImmersiveSectionPlayer with hydration fixes
  const markdownComponents = {
    // Fixed paragraph component
    p: ({ node, children }) => {
      const hasBlockElements = node?.children?.some(
        (child) =>
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
        <p className="mb-6 text-lg font-light leading-relaxed tracking-wide text-gray-700">
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
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-xl">
              <img
                src={visual.displayUrl}
                alt={props.alt || visual.caption}
                className="mx-auto h-auto max-w-full rounded-xl shadow-lg"
              />
              {visual.caption && (
                <div className="mt-4 text-center italic text-blue-600">{visual.caption}</div>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className="my-8">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-xl">
            <div className="mb-2 text-2xl text-amber-500">⚠️</div>
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
        <div className="rounded-2xl border border-l-4 border-blue-100 border-yellow-500 bg-white p-6 shadow-xl">
          <div className="text-lg font-light italic text-blue-800">{children}</div>
        </div>
      </div>
    ),

    h1: ({ children }) => (
      <h1 className="mb-8 mt-12 font-serif text-3xl text-blue-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-6 mt-10 font-serif text-2xl text-blue-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 font-serif text-xl text-blue-900">{children}</h3>
    ),

    ul: ({ children }) => <ul className="my-6 space-y-3 text-gray-700">{children}</ul>,
    li: ({ children }) => (
      <li className="flex items-start space-x-3">
        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500"></span>
        <span className="text-lg leading-relaxed">{children}</span>
      </li>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-12 shadow-xl">
          <h1 className="mb-6 text-center font-serif text-4xl text-blue-900">
            Hydration Fix Test Page
          </h1>
          <p className="mb-8 text-center text-blue-600">
            This page tests the markdown rendering with the hydration error fix applied. Check the
            browser console - there should be no hydration errors.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
          <h2 className="mb-6 font-serif text-2xl text-blue-900">Test Markdown Content</h2>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {testMarkdownContent}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Open browser console to check for hydration errors. If the fix is successful, there
            should be no React hydration warnings.
          </p>
        </div>
      </div>
    </div>
  );
}
