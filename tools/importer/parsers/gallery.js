/* eslint-disable */
/* global WebImporter */

/** Parser for gallery block. Source: https://www.leica-microsystems.com/applications/education/. Selector: #c438873 */
export default function parse(element, { document }) {
  const images = element.querySelectorAll('img');
  const cells = [];

  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!src || src.includes('data:image') || src.includes('google.com') || src.includes('clarity.ms')) return;

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    const pic = img.closest('picture') || img;
    frag.appendChild(pic.cloneNode(true));

    cells.push([frag]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'gallery', cells });
  element.replaceWith(block);
}
