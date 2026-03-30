/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-info variant.
 * Base block: columns
 * Source: https://www.lipsum.com/
 * Selector: #Panes
 *
 * Extracts Q&A content from #Panes child divs into a 2-column layout.
 * Left column: "What is Lorem Ipsum?" + "Where does it come from?"
 * Right column: "Why do we use it?" + "Where can I get some?" (excluding form)
 *
 * Columns blocks do NOT require field hint comments (xwalk exception).
 */
export default function parse(element, { document }) {
  // Get direct child divs from #Panes (the Q&A content divs)
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  if (childDivs.length < 4) return;

  // Source layout: divs alternate left/right in pairs
  // div[0] = "What is Lorem Ipsum?" (left)
  // div[1] = "Why do we use it?" (right)
  // div[2] = "Where does it come from?" (left)
  // div[3] = "Where can I get some?" (right) - may contain form

  // Build left column content
  const leftCol = document.createElement('div');
  if (childDivs[0]) {
    Array.from(childDivs[0].childNodes).forEach((node) => leftCol.appendChild(node.cloneNode(true)));
  }
  if (childDivs[2]) {
    Array.from(childDivs[2].childNodes).forEach((node) => leftCol.appendChild(node.cloneNode(true)));
  }

  // Build right column content (exclude form elements)
  const rightCol = document.createElement('div');
  if (childDivs[1]) {
    Array.from(childDivs[1].childNodes).forEach((node) => rightCol.appendChild(node.cloneNode(true)));
  }
  if (childDivs[3]) {
    Array.from(childDivs[3].childNodes).forEach((node) => {
      if (node.nodeName !== 'FORM') {
        rightCol.appendChild(node.cloneNode(true));
      }
    });
  }

  const cells = [
    [leftCol, rightCol],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
