// export default function decorate(block) {
//   const content = document.createElement('div');
//   content.classList.add('aldevron-featured-story-content');

//   [...block.children].forEach((row) => {
//     while (row.firstElementChild) {
//       const cell = row.firstElementChild;
//       while (cell.firstChild) content.append(cell.firstChild);
//       cell.remove();
//     }
//     row.remove();
//   });

//   content.querySelectorAll('a').forEach((link) => {
//     if (link.parentElement.tagName === 'P' && link.parentElement.children.length === 1) {
//       link.classList.add('aldevron-featured-story-cta');
//     }
//   });

//   block.append(content);
// }

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // 1. Find the data by the 'name' you gave them in component-models.json
  // We look for the div that contains the specific property attribute
  const titleEl = block.querySelector('[data-aue-prop="title"]') || block.querySelector(':scope > div:nth-child(1) > div');
  const imageEl = block.querySelector('[data-aue-prop="image"] picture') || block.querySelector('picture');
  const textEl = block.querySelector('[data-aue-prop="text"]') || block.querySelector(':scope > div:last-child > div');

  // 2. Capture the content before we wipe the block
  const titleHtml = titleEl ? titleEl.innerHTML : '';
  const pictureHtml = imageEl ? imageEl.outerHTML : '';
  const textHtml = textEl ? textEl.innerHTML : '';

  // 3. Rebuild the UI
  block.innerHTML = '';

  // --- Title Row ---
  if (titleHtml) {
    const header = document.createElement('div');
    header.className = 'featured-story-header';
    header.innerHTML = `<h2>${titleHtml}</h2>`;
    block.append(header);
  }

  // --- Content Row (Flexbox) ---
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // Left Column: Image
  const imageCol = document.createElement('div');
  imageCol.className = 'featured-story-image';
  if (pictureHtml) {
    imageCol.innerHTML = pictureHtml;
    // Optimize the image if it exists
    const img = imageCol.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || 'featured story', false, [{ width: '750' }]);
      imageCol.querySelector('picture').replaceWith(optimized);
    }
  }
  body.append(imageCol);

  // Right Column: Text & Button
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (textHtml) {
    textCol.innerHTML = textHtml;
    // Force all links in this section to be buttons
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }
  body.append(textCol);

  block.append(body);
}
