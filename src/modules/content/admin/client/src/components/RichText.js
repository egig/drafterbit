import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Toolbar } from './RichTextComponents'
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

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

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

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichText extends React.Component {
    /**
     * Deserialize the initial editor value.
     *
     * @type {Object}
     */

    /**
     * @param type
     * @param value
     * @returns {*}
     */
    hasMark = (type, value) => {
        return value.activeMarks.some(mark => mark.type === type)
    }

    /**
     *
     * @param type
     * @param value
     * @returns {*}
     */
    hasBlock = (type, value) => {
        return value.blocks.some(node => node.type === type)
    }

    /**
     * Store a reference to the `editor`.
     *
     * @param {Editor} editor
     */

    ref = editor => {
        this.editor = editor
    }

    /**
     * Render.
     *
     * @return {Element}
     */

    render() {

        let value = this.props.value;

        return (
            <RichTextContainer>
                <Toolbar>
                    {this.renderMarkButton('bold', <FontAwesomeIcon icon={faBold}/>, value)}
                    {this.renderMarkButton('italic', <FontAwesomeIcon icon={faItalic}/>, value)}
                    {this.renderMarkButton('underlined', <FontAwesomeIcon icon={faUnderline}/>, value)}
                    {this.renderMarkButton('code', <FontAwesomeIcon icon={faCode}/>, value)}
                    {this.renderBlockButton('heading-one', <span><FontAwesomeIcon icon={faHeading}/>1</span>, value)}
                    {this.renderBlockButton('heading-two', <span><FontAwesomeIcon icon={faHeading}/>2</span>, value)}
                    {this.renderBlockButton('block-quote', <FontAwesomeIcon icon={faQuoteRight}/>, value)}
                    {this.renderBlockButton('numbered-list', <FontAwesomeIcon icon={faListOl}/>, value)}
                    {this.renderBlockButton('bulleted-list', <FontAwesomeIcon icon={faListUl}/>, value)}
                </Toolbar>
                <Editor
                    spellCheck
                    autoFocus
                    placeholder="Enter some rich text..."
                    ref={this.ref}
                    value={value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    renderBlock={this.renderBlock}
                    renderMark={this.renderMark}
                />
            </RichTextContainer>
        )
    }

    /**
     * Render a mark-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */

    renderMarkButton = (type, icon, value) => {
        const isActive = this.hasMark(type, value)

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickMark(event, type)}
            >{icon}
            </Button>
        )
    }


    /**
     *
     * @param type
     * @param icon
     * @param value
     * @returns {*}
     */
    renderBlockButton = (type, icon, value) => {
        let isActive = this.hasBlock(type, value)

        if (['numbered-list', 'bulleted-list'].includes(type)) {
            const { document, blocks } = value;

            if (blocks.size > 0) {
                const parent = document.getParent(blocks.first().key)
                isActive = this.hasBlock('list-item', value) && parent && parent.type === type
            }
        }

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickBlock(event, type, value)}
            >{icon}
            </Button>
        )
    }

    /**
     * Render a Slate block.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderBlock = (props, editor, next) => {
        const { attributes, children, node } = props


        switch (node.type) {
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
            return next()
        }
    }

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderMark = (props, editor, next) => {
        const { children, mark, attributes } = props

        switch (mark.type) {
        case 'bold':
            return <strong {...attributes}>{children}</strong>
        case 'code':
            return <code {...attributes}>{children}</code>
        case 'italic':
            return <em {...attributes}>{children}</em>
        case 'underlined':
            return <u {...attributes}>{children}</u>
        default:
            return next()
        }
    }

    /**
     * On change, save the new `value`.
     *
     * @param {Editor} editor
     */

    onChange = ({ value }) => {
        this.props.onChange(value)
    };

    /**
     * On key down, if it's a formatting command toggle a mark.
     *
     * @param {Event} event
     * @param {Editor} editor
     * @return {Change}
     */

    onKeyDown = (event, editor, next) => {
        let mark

        if (isBoldHotkey(event)) {
            mark = 'bold'
        } else if (isItalicHotkey(event)) {
            mark = 'italic'
        } else if (isUnderlinedHotkey(event)) {
            mark = 'underlined'
        } else if (isCodeHotkey(event)) {
            mark = 'code'
        } else {
            return next()
        }

        event.preventDefault()
        editor.toggleMark(mark)
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} event
     * @param {String} type
     */

    onClickMark = (event, type) => {
        event.preventDefault()
        this.editor.toggleMark(type)
    }

    /**
     *
     * @param event
     * @param type
     * @param value
     */
    onClickBlock = (event, type) => {
        event.preventDefault()

        const { editor } = this
        const { value } = editor
        const { document } = value

        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            const isActive = this.hasBlock(type, value)
            const isList = this.hasBlock('list-item', value)

            if (isList) {
                editor
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                editor.setBlocks(isActive ? DEFAULT_NODE : type)
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = this.hasBlock('list-item', value)
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === type)
            })

            if (isList && isType) {
                editor
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                editor
                    .unwrapBlock(
                        type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                editor.setBlocks('list-item').wrapBlock(type)
            }
        }
    }
}

export default RichText