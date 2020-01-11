import React from 'react'
import Html from 'slate-html-serializer'

const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
    h1: 'heading-one',
    h2: 'heading-two',
    ol: 'numbered-list',
    ul: 'bulleted-list',
    li: 'list-item'
  };
  
  // Add a dictionary of mark tags.
  const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
    code: 'code'
  };

  const INLINE_TAGS = {
    a: 'link'
  };
  
  const rules = [
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()];
        if (type) {
          return {
            object: 'block',
            type: type,
            data: {
              className: el.getAttribute('class') || "",
            },
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object === 'block') {
          switch (obj.type) {
            case 'code':
              return (
                <pre>
                  <code>{children}</code>
                </pre>
              )
            case 'paragraph':
              return <p className={obj.data.className}>{children}</p>
            case 'quote':
              return <blockquote>{children}</blockquote>
            case 'heading-one':
              return <h1>{children}</h1>
            case 'heading-two':
              return <h2>{children}</h2>
            case 'bulleted-list':
              return <ul>{children}</ul>
            case 'numbered-list':
              return <ol>{children}</ol>
            case 'list-item':
              return <li>{children}</li>
          }
        }
      },
    },
    // Add a new rule that handles marks...
    {
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'mark',
            type: type,
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object === 'mark') {
          switch (obj.type) {
            case 'bold':
              return <strong>{children}</strong>;
            case 'italic':
              return <em>{children}</em>;
            case 'underline':
              return <u>{children}</u>;
            case 'code':
            return <code>{children}</code>;
          }
        }
      },
    },
    {
      deserialize(el, next) {
        const type = INLINE_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'inline',
            type: type,
            data: {
              href: el.getAttribute('href'),
            },
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        switch (obj.type) {
          case 'link':
            return <a href={obj.data.href}>{children}</a>
        }
      },
    },
  ]

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules })

export default html