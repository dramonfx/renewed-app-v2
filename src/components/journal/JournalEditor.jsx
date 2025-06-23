
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
  AlignRight
} from 'lucide-react';

export default function JournalEditor({ 
  content = '', 
  onChange,
  placeholder = "Begin your sacred reflection..." 
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
      <div className="sacred-input min-h-[400px] flex items-center justify-center">
        <span className="text-sacred-blue-500">Preparing your sacred writing space...</span>
      </div>
    );
  }

  // Sacred toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      title: 'Bold'
    },
    {
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      title: 'Italic'
    },
    {
      type: 'separator'
    },
    {
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      title: 'Bullet List'
    },
    {
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      title: 'Numbered List'
    },
    {
      icon: Quote,
      isActive: () => editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      title: 'Quote'
    },
    {
      type: 'separator'
    },
    {
      icon: AlignLeft,
      isActive: () => editor.isActive({ textAlign: 'left' }),
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      title: 'Align Left'
    },
    {
      icon: AlignCenter,
      isActive: () => editor.isActive({ textAlign: 'center' }),
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      title: 'Align Center'
    },
    {
      icon: AlignRight,
      isActive: () => editor.isActive({ textAlign: 'right' }),
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      title: 'Align Right'
    },
    {
      type: 'separator'
    },
    {
      icon: Undo,
      isActive: () => false,
      onClick: () => editor.chain().focus().undo().run(),
      title: 'Undo',
      disabled: !editor.can().undo()
    },
    {
      icon: Redo,
      isActive: () => false,
      onClick: () => editor.chain().focus().redo().run(),
      title: 'Redo',
      disabled: !editor.can().redo()
    }
  ];

  return (
    <div className="sacred-glass border border-sacred-blue-200 rounded-lg overflow-hidden">
      {/* Sacred Toolbar */}
      <div className="bg-sacred-blue-50 border-b border-sacred-blue-200 p-3">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'separator') {
              return (
                <div 
                  key={index} 
                  className="w-px h-6 bg-sacred-blue-300 mx-2" 
                />
              );
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
                  p-2 rounded-md transition-colors duration-200 hover:bg-sacred-blue-100
                  ${isActive 
                    ? 'bg-sacred-blue-200 text-sacred-blue-800' 
                    : 'text-sacred-blue-600'
                  }
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:text-sacred-blue-800'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Sacred Editor Content */}
      <div className="bg-white">
        <EditorContent 
          editor={editor}
          className="sacred-editor-content"
        />
      </div>

      {/* Sacred Writing Statistics */}
      <div className="bg-sacred-blue-50 border-t border-sacred-blue-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-sacred-blue-500">
          <span>
            {editor.storage.characterCount?.characters() || 0} characters, {' '}
            {editor.storage.characterCount?.words() || 0} words
          </span>
          <span className="italic">
            Let your sacred thoughts flow freely...
          </span>
        </div>
      </div>
    </div>
  );
}
