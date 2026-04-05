/* eslint-disable */
/* global WebImporter */

/** Parser for cards-carousel block. Source: https://www.leica-microsystems.com/applications/education/. Selector: swiper-container.m-slider */
export default function parse(element, { document }) {
  // element is the swiper-container. swiper-slide children are direct children.
  let slides = element.querySelectorAll(':scope > swiper-slide');
  if (slides.length === 0) {
    // Fallback: any card-like children
    slides = element.querySelectorAll('[class*="card"], [class*="Card"], figure, .t3m-ProductList-item');
  }
  if (slides.length === 0) {
    // Last fallback: all direct children that contain content
    slides = element.querySelectorAll(':scope > *');
  }

  const cells = [];
  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const titleEl = slide.querySelector('h3, h4, a[class*="font-bold"], [class*="title"]');
    const link = slide.querySelector('a[href]');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const linkText = link ? link.textContent.trim() : '';

    // Skip slides with no meaningful content
    if (!img && !titleText && !linkText) return;

    const frag0 = document.createDocumentFragment();
    frag0.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = img.closest('picture') || img;
      frag0.appendChild(pic.cloneNode(true));
    }

    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(' field:text '));
    if (titleText) {
      const h = document.createElement('h3');
      h.textContent = titleText;
      frag1.appendChild(h);
    }
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = linkText || 'View details';
      frag1.appendChild(a);
    }

    cells.push([frag0, frag1]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-carousel', cells });
  element.replaceWith(block);
}
