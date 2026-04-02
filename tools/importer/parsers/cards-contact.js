/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-contact variant.
 * Base block: cards
 * Source: https://www.leica-microsystems.com/contact/contact-us-online/
 * Selector: #t3m-Section--ctaHub .grid
 *
 * Source DOM structure (from captured HTML):
 * - Grid container with 4 card columns (.t3m-con-column-N)
 * - Each column has a link wrapping the card content
 * - Inside: icon (img in circular div), h3 heading, p description
 *
 * Target: Cards block with 2 columns per row (image | text)
 * Each row represents one card-contact item.
 */
export default function parse(element, { document }) {
  // Each card is inside a .t3m-Disclosure wrapper within a column div
  const cardWrappers = element.querySelectorAll('[class*="t3m-con-column"]');
  const cells = [];

  cardWrappers.forEach((wrapper) => {
    const link = wrapper.querySelector('a');
    const icon = wrapper.querySelector('.rounded-full img, [class*="justify-center"] img');
    const heading = wrapper.querySelector('h3');
    const description = wrapper.querySelector('p');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) {
      const img = document.createElement('img');
      img.src = icon.src || '';
      img.alt = heading ? heading.textContent.trim() : '';
      imageCell.appendChild(img);
    }

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (heading) {
      const h3 = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || '';
        a.textContent = heading.textContent.trim();
        h3.appendChild(a);
      } else {
        h3.textContent = heading.textContent.trim();
      }
      textCell.appendChild(h3);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-contact',
    cells,
  });

  element.replaceWith(block);
}
