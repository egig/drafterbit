import React from 'react'
import Html from 'slate-html-serializer'

const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
  }
  
  // Add a dictionary of mark tags.
  const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
  }

  const INLINE_TAGS = {
    a: 'link'
  }
  
  const rules = [
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()]
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
        if (obj.object == 'block') {
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
        if (obj.object == 'mark') {
          switch (obj.type) {
            case 'bold':
              return <strong>{children}</strong>
            case 'italic':
              return <em>{children}</em>
            case 'underline':
              return <u>{children}</u>
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