/* eslint-disable */
/* global WebImporter */

/** Parser for cta-banner block. Source: https://www.leica-microsystems.com/applications/education/. Selector: #t3m-Section--ctaHub */
export default function parse(element, { document }) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:text '));

  const h2 = element.querySelector('h2');
  if (h2) {
    const heading = document.createElement('h2');
    heading.textContent = h2.textContent.trim();
    frag.appendChild(heading);
  }

  const desc = element.querySelector('p:not(:empty)');
  if (desc && desc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    frag.appendChild(p);
  }

  // Look for contact links/buttons
  const links = element.querySelectorAll('a[href]');
  links.forEach((link) => {
    const text = link.textContent.trim();
    if (text && !text.includes('Scroll') && text.length > 1) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = text;
      frag.appendChild(a);
    }
  });

  const cells = [[frag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'cta-banner', cells });
  element.replaceWith(block);
}
