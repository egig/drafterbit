import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBold,
    faCode,
    faHeading,
    faItalic,
    faListOl, faListUl,
    faQuoteRight,
    faUnderline
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components'

import { Button, Icon, Toolbar } from './RichTextComponents'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichTextContainer = styled.div`
    border: 1px solid #ced4da;
    margin: 0;
    display: block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: .25rem
`;

const RichText = (props) => {
    let value = props.value;
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <RichTextContainer>
        <Slate editor={editor} value={value} onChange={props.onChange}>
            <Toolbar>
                <MarkButton format="bold">
                    <FontAwesomeIcon icon={faBold}/>
                </MarkButton>
                <MarkButton format="italic" >
                    <FontAwesomeIcon icon={faItalic}/>
                </MarkButton>
                <MarkButton format="underline" icon="format_underlined" >
                    <FontAwesomeIcon icon={faUnderline}/>
                </MarkButton>
                <MarkButton format="code" icon="code" >
                    <FontAwesomeIcon icon={faCode}/>
                </MarkButton>
                <BlockButton format="heading-one" icon="looks_one" >
                    <span><FontAwesomeIcon icon={faHeading}/>1</span>
                </BlockButton>
                <BlockButton format="heading-two" icon="looks_two" >
                    <span><FontAwesomeIcon icon={faHeading}/>2</span>
                </BlockButton>
                <BlockButton format="block-quote" icon="format_quote" >
                    <FontAwesomeIcon icon={faQuoteRight}/>
                </BlockButton>
                <BlockButton format="numbered-list" icon="format_list_numbered" >
                    <FontAwesomeIcon icon={faListOl}/>
                </BlockButton>
                <BlockButton format="bulleted-list" icon="format_list_bulleted" >
                    <FontAwesomeIcon icon={faListUl}/>
                </BlockButton>
            </Toolbar>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck
                autoFocus
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />
        </Slate>
        </RichTextContainer>
    )
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type),
        split: true,
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    })

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === format,
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
    case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
    case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
    case 'list-item':
        return <li {...attributes}>{children}</li>
    case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
    default:
        return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, children }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {children}
        </Button>
    )
}

const MarkButton = ({ format, children }) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {children}
        </Button>
    )
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }],
    },
]

export default RichText