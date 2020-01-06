import { Value } from "slate";
import htmlSerializer from "./htmlSerializer";
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server'

export function blocksToSlateValue(rootBlocks) {
    let rootNodes = rootBlocks.map(b => {

        if(b.type === "paragraph") {
            let fragment= htmlSerializer.parseHtml(b.html_text);
            const children = Array.from(fragment.childNodes)
            return htmlSerializer.deserializeElements(children)[0];
        }

        if(b.type === "content_type") {
            return {
                object: "block",
                type: "content_type",
                data: b.data
            }
        }
    });
    
    const json = {
        object: 'value',
        document: {
          object: 'document',
          data: {},
          nodes: rootNodes,
        },
      }

    return Value.fromJSON(json);
}

export function slateValueToBlocks(slateValue) {
    let json = slateValue.toJSON();
    
    let rootNodes = json.document.nodes;

    let blocks = rootNodes.map(node => {

        if(node.type == "paragraph") {

            let elements =  htmlSerializer.serializeNode(node);
            const html = renderToStaticMarkup(<body>{elements}</body>)
            let htmlText = html.slice(6, -7)

            return {
                type: "paragraph",
                html_text: htmlText
            }
        }

        if(node.type == "content_type") {
            return {
                type: "content_type",
                data: node.data
            }
        }

    });

    return blocks;
}