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
  // 1. Get all the top-level data containers from the block
  const rows = [...block.children];

  /**
   * BASED ON YOUR COMPONENT-MODELS.JSON ORDER:
   * rows[0] = title
   * rows[1] = image
   * rows[2] = imageAlt (we usually skip this as a div)
   * rows[3] = text (Rich Text)
   */
  
  const titleData = rows[0]?.querySelector('div');
  const imageData = rows[1]?.querySelector('picture');
  const textData = rows[3]?.querySelector('div');

  // 2. Clear the block to build the specific layout you want
  block.innerHTML = '';

  // --- 1. TITLE (Top, Full Width) ---
  if (titleData && titleData.innerText.trim() !== '') {
    const header = document.createElement('div');
    header.className = 'featured-story-header';
    const h2 = document.createElement('h2');
    h2.innerHTML = titleData.innerHTML; // Keeps any bolding/formatting
    header.append(h2);
    block.append(header);
  }

  // --- 2. BODY CONTAINER (Flexbox for side-by-side) ---
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // LEFT COLUMN: Image
  const imageCol = document.createElement('div');
  imageCol.className = 'featured-story-image';
  if (imageData) {
    const img = imageData.querySelector('img');
    // Using the alt text field if available, otherwise default
    const alt = rows[2]?.innerText?.trim() || 'Featured story image';
    const optimized = createOptimizedPicture(img.src, alt, false, [{ width: '750' }]);
    imageCol.append(optimized);
  }
  body.append(imageCol);

  // RIGHT COLUMN: Content & Button
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (textData) {
    textCol.innerHTML = textData.innerHTML;
    
    // Find any links in this text and make them look like buttons
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }
  body.append(textCol);

  // 3. Final Assembly
  block.append(body);
}
