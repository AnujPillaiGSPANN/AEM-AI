/* eslint-disable */
/* global WebImporter */

/** Parser for promo-banner block. Source: https://www.leica-microsystems.com/applications/education/. Selector: section.t3m-Section--bannerManager.t3m-bg-gray-300 */
export default function parse(element, { document }) {
  // Row 0: background image
  const frag0 = document.createDocumentFragment();
  frag0.appendChild(document.createComment(' field:image '));
  const img = element.querySelector('img');
  if (img) {
    const pic = img.closest('picture') || img;
    frag0.appendChild(pic.cloneNode(true));
  }

  // Row 1: text/link content
  const frag1 = document.createDocumentFragment();
  frag1.appendChild(document.createComment(' field:text '));
  const link = element.querySelector('a[href]');
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim() || 'Learn more';
    frag1.appendChild(a);
  }

  const cells = [
    [frag0],
    [frag1],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-banner', cells });
  element.replaceWith(block);
}
