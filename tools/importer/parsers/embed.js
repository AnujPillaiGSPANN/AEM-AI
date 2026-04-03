/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block.
 * Source: https://www.leica-microsystems.com/contact/contact-us-online/
 * Selector: #t3m-PartnerMap
 *
 * The partner finder is an interactive TYPO3 widget that cannot be statically authored.
 * This parser creates an embed block with a link to the original page's partner finder section.
 */
export default function parse(element, { document }) {
  // Create a link to the original partner finder
  const a = document.createElement('a');
  const sourceUrl = 'https://www.leica-microsystems.com/contact/contact-us-online/#t3m-PartnerMap';
  a.href = sourceUrl;
  a.textContent = sourceUrl;

  const cells = [[a]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'embed',
    cells,
  });

  element.replaceWith(block);
}
