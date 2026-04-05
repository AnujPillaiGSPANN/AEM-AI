/* eslint-disable */
/* global WebImporter */

/** Parser for video block. Source: https://www.leica-microsystems.com/applications/education/. Selector: .t3m-Video */
export default function parse(element, { document }) {
  const videoEl = element.querySelector('video');
  const source = videoEl ? (videoEl.src || videoEl.querySelector('source')?.src) : '';

  if (!source) return;

  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:uri '));
  const a = document.createElement('a');
  a.href = source;
  a.textContent = source;
  frag.appendChild(a);

  const cells = [[frag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'video', cells });
  element.replaceWith(block);
}
