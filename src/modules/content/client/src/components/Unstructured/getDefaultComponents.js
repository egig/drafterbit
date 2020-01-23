import React from 'react'

import Embed from "./embed";
import ContentType from "./content_type";

const Image = ({ attributes, data }) => (
    <img {...attributes} src={data.get("src")} />
  );

  const Italic = ({ attributes, children }) => (
    <i {...attributes}>{children}</i>
  );

  const Bold = ({ attributes, children }) => (
    <strong {...attributes}>{children}</strong>
  );

  const Underline = ({ attributes, children }) => (
    <u {...attributes}>{children}</u>
  );
  
  const Link = ({ attributes, children, data }) => (
    <a {...attributes} href={data.get("href")}>
      {children}
    </a>
  );
  const Paragraph = ({ attributes, children }) => (
    <p {...attributes}>{children}</p>
  );
  const Blockquote = ({ attributes, children }) => (
    <blockquote {...attributes}>{children}</blockquote>
  );
  const HeadingOne = ({ attributes, children }) => (
    <h1 {...attributes}>{children}</h1>
  );
  const HeadingTwo = ({ attributes, children }) => (
    <h2 {...attributes}>{children}</h2>
  );
  const BulletedList = ({ attributes, children }) => (
    <ul {...attributes}>{children}</ul>
  );
  const NumberedList = ({ attributes, children }) => (
    <ol {...attributes}>{children}</ol>
  );
  const ListItem = ({ attributes, children }) => (
    <li {...attributes}>{children}</li>
  );
  
  const VideoEmbed = ({ attributes, data, editor }) => (
    <Embed {...attributes} editor={editor} data={data} />
  );

const DEFAULT_COMPONENTS = {
    italic: Italic,
    bold: Bold,
    underline: Underline,
    image: Image,
    paragraph: Paragraph,
    "block-quote": Blockquote,
    "heading-one": HeadingOne,
    "heading-two": HeadingTwo,
    "bulleted-list": BulletedList,
    "numbered-list": NumberedList,
    "list-item": ListItem,
    embed: VideoEmbed,
    content_type: ContentType
    
  };

export default function getDefaultComponents() {
  return DEFAULT_COMPONENTS;
};