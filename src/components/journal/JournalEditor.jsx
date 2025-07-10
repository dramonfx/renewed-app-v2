// src/components/journal/JournalEditor.jsx
// Sacred Rich Text Editor - Tiptap-powered spiritual writing experience

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Heart,
  Leaf,
} from 'lucide-react';

export default function JournalEditor({
  content = '',
  onChange,
  placeholder = 'Begin your sacred reflection...',
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return (
      <div className="sacred-input flex min-h-[400px] items-center justify-center">
        <span className="text-sacred-blue-500">Preparing your sacred writing space...</span>
      </div>
    );
  }

  // Insert spiritual symbol at cursor
  const insertSpiritualSymbol = (symbol) => {
    editor.chain().focus().insertContent(symbol).run();
  };

  // Sacred toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      title: 'Bold',
    },
    {
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      title: 'Italic',
    },
    {
      type: 'separator',
    },
    {
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      title: 'Bullet List',
    },
    {
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      title: 'Numbered List',
    },
    {
      icon: Quote,
      isActive: () => editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      title: 'Quote',
    },
    {
      type: 'separator',
    },
    {
      icon: AlignLeft,
      isActive: () => editor.isActive({ textAlign: 'left' }),
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      title: 'Align Left',
    },
    {
      icon: AlignCenter,
      isActive: () => editor.isActive({ textAlign: 'center' }),
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      title: 'Align Center',
    },
    {
      icon: AlignRight,
      isActive: () => editor.isActive({ textAlign: 'right' }),
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      title: 'Align Right',
    },
    {
      type: 'separator',
    },
    {
      icon: Undo,
      isActive: () => false,
      onClick: () => editor.chain().focus().undo().run(),
      title: 'Undo',
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      isActive: () => false,
      onClick: () => editor.chain().focus().redo().run(),
      title: 'Redo',
      disabled: !editor.can().redo(),
    },
  ];

  // Sacred spiritual symbols for authentic expression
  const spiritualSymbols = [
    { symbol: '🌿', title: 'Sacred Nature', icon: Leaf },
    { symbol: '✨', title: 'Divine Sparkle', icon: Sparkles },
    { symbol: '🙏', title: 'Prayer/Gratitude', icon: Heart },
    { symbol: '🕊️', title: 'Peace/Spirit', icon: Heart },
    { symbol: '💙', title: 'Sacred Heart', icon: Heart },
    { symbol: '🌟', title: 'Divine Light', icon: Sparkles },
  ];

  return (
    <div className="sacred-glass overflow-hidden rounded-lg border border-sacred-blue-200">
      {/* Sacred Toolbar */}
      <div className="border-b border-sacred-blue-200 bg-sacred-blue-50 p-3">
        {/* Main Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'separator') {
              return <div key={index} className="mx-2 h-6 w-px bg-sacred-blue-300" />;
            }

            const Icon = button.icon;
            const isActive = button.isActive();
            const isDisabled = button.disabled;

            return (
              <button
                key={index}
                type="button"
                onClick={button.onClick}
                disabled={isDisabled}
                title={button.title}
                className={`
                  rounded-md p-2 transition-colors duration-200 hover:bg-sacred-blue-100
                  ${isActive ? 'bg-sacred-blue-200 text-sacred-blue-800' : 'text-sacred-blue-600'}
                  ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-sacred-blue-800'}
                `}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Sacred Spiritual Symbols */}
        <div className="border-t border-sacred-blue-200 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-sacred-blue-500" />
            <span className="text-xs font-medium text-sacred-blue-700">Sacred Symbols</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {spiritualSymbols.map((symbol, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertSpiritualSymbol(symbol.symbol)}
                title={symbol.title}
                className="rounded-md p-2 text-lg transition-all duration-200 hover:bg-sacred-blue-100 hover:scale-110 active:scale-95"
              >
                {symbol.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sacred Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} className="sacred-editor-content" />
      </div>

      {/* Sacred Writing Statistics */}
      <div className="border-t border-sacred-blue-200 bg-sacred-blue-50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-sacred-blue-500">
          <span>
            {editor.storage.characterCount?.characters() || 0} characters,{' '}
            {editor.storage.characterCount?.words() || 0} words
          </span>
          <span className="italic">Let your sacred thoughts flow freely...</span>
        </div>
      </div>
    </div>
  );
}
