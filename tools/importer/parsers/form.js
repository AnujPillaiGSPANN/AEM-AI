/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form block.
 * Base block: form
 * Source: https://www.lipsum.com/
 * Selector: #Panes form
 *
 * Extracts the Lorem Ipsum generator form into an EDS Form block.
 * Model fields: reference (aem-content), action (string).
 * Simple block = 2 rows (one per field, excluding collapsed suffixes).
 */
export default function parse(element, { document }) {
  // Row 1: reference (aem-content) - path to form definition
  const frag1 = document.createDocumentFragment();
  frag1.appendChild(document.createComment(' field:reference '));
  const refLink = document.createElement('a');
  refLink.href = '/content/EMA_SAMPLE_PROJECT/forms/lorem-ipsum-generator';
  refLink.textContent = '/content/EMA_SAMPLE_PROJECT/forms/lorem-ipsum-generator';
  frag1.appendChild(refLink);

  // Row 2: action (string) - form action URL
  const actionUrl = element.getAttribute('action') || '';
  let frag2;
  if (actionUrl) {
    frag2 = document.createDocumentFragment();
    frag2.appendChild(document.createComment(' field:action '));
    frag2.appendChild(document.createTextNode(actionUrl));
  }

  const cells = [
    [frag1],
    [frag2 || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
