/* eslint-disable */
/* global WebImporter */

/** Parser for feature-list block. Source: https://www.leica-microsystems.com/applications/education/. Selector: #c507799 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.t3m-Accordion-item, [class*="Accordion-item"]');
  const cells = [];

  items.forEach((item) => {
    const trigger = item.querySelector('.t3m-Accordion-trigger, h3, h4, h5');
    const panel = item.querySelector('.t3m-Accordion-panel, [class*="Accordion-panel"]');

    const frag0 = document.createDocumentFragment();
    frag0.appendChild(document.createComment(' field:icon '));
    const num = trigger ? trigger.textContent.trim().match(/^\d+/) : null;
    frag0.appendChild(document.createTextNode(num ? num[0] : ''));

    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(' field:text '));
    const titleText = trigger ? trigger.textContent.trim().replace(/^\d+\s*/, '') : '';
    if (titleText) {
      const h = document.createElement('h4');
      h.textContent = titleText;
      frag1.appendChild(h);
    }
    if (panel) {
      const p = document.createElement('p');
      p.textContent = panel.textContent.trim().substring(0, 500);
      frag1.appendChild(p);
    }

    cells.push([frag0, frag1]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'feature-list', cells });
  element.replaceWith(block);
}
