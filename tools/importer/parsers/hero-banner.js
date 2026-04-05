/* eslint-disable */
/* global WebImporter */

/** Parser for hero-banner block. Source: https://www.leica-microsystems.com/applications/education/. Selector: .t3m-FlxBillboard */
export default function parse(element, { document }) {
  // Row 0: background image (or video)
  const frag0 = document.createDocumentFragment();
  frag0.appendChild(document.createComment(' field:image '));
  const video = element.querySelector('video');
  const bgImg = element.querySelector('.t3m-FlxBillboard-imageWrapper img');
  if (video) {
    const a = document.createElement('a');
    a.href = video.src || video.querySelector('source')?.src || '';
    a.textContent = a.href;
    frag0.appendChild(a);
  } else if (bgImg) {
    const pic = bgImg.closest('picture') || bgImg;
    frag0.appendChild(pic.cloneNode(true));
  }

  // Row 1: text content (H1 heading + description)
  const frag1 = document.createDocumentFragment();
  frag1.appendChild(document.createComment(' field:text '));
  const h1 = element.querySelector('h1');
  if (h1) frag1.appendChild(h1.cloneNode(true));
  const subtitle = element.querySelector('.t3m-FlxBillboard-content p');
  if (subtitle) frag1.appendChild(subtitle.cloneNode(true));

  const cells = [
    [frag0],
    [frag1],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
