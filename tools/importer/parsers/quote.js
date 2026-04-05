/* eslint-disable */
/* global WebImporter */

/** Parser for quote block (testimonial variant). Source: https://www.leica-microsystems.com/applications/education/. Selector: .t3m-Testimonial */
export default function parse(element, { document }) {
  const quoteEl = element.querySelector('.t3m-Testimonial-quote');
  const citeEl = element.querySelector('.t3m-Testimonial-cite, cite');

  const frag0 = document.createDocumentFragment();
  frag0.appendChild(document.createComment(' field:quotation '));
  if (quoteEl) {
    const p = document.createElement('p');
    p.textContent = quoteEl.textContent.trim();
    frag0.appendChild(p);
  }

  const frag1 = document.createDocumentFragment();
  frag1.appendChild(document.createComment(' field:attribution '));
  if (citeEl) {
    const p = document.createElement('p');
    p.textContent = citeEl.textContent.trim();
    frag1.appendChild(p);
  }

  const cells = [
    [frag0],
    [frag1],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote', cells });
  element.replaceWith(block);
}
