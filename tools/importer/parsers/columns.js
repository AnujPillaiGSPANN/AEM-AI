/* eslint-disable */
/* global WebImporter */

/** Parser for columns block. Source: https://www.leica-microsystems.com/applications/education/. Selector: #c507724 [class*='t3m-con-gut'] */
export default function parse(element, { document }) {
  // Columns blocks are exempt from field hints (hinting.md Rule 4)
  const col1El = element.querySelector('[class*="t3m-con-column-1"]');
  const col2El = element.querySelector('[class*="t3m-con-column-2"]');

  if (!col1El && !col2El) return;

  const col1 = document.createDocumentFragment();
  const col2 = document.createDocumentFragment();

  if (col1El) {
    Array.from(col1El.childNodes).forEach((node) => col1.appendChild(node.cloneNode(true)));
  }
  if (col2El) {
    Array.from(col2El.childNodes).forEach((node) => col2.appendChild(node.cloneNode(true)));
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
