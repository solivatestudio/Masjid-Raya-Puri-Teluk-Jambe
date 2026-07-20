import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

export const tiptapExtensions = (placeholder: string = 'Tulis artikel di sini...') => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: 'text-emerald-700 underline', rel: 'noopener noreferrer', target: '_blank' },
  }),
  Image.configure({
    HTMLAttributes: { class: 'rounded-xl my-4 max-w-full' },
  }),
  Placeholder.configure({ placeholder }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
];

export const SANITIZE_CONFIG = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'i', 'b',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'class'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName: string, attribs: any) => ({
      tagName,
      attribs: { ...attribs, rel: 'noopener noreferrer', target: '_blank' },
    }),
  },
};

