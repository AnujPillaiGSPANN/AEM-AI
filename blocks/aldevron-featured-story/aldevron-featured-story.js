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
  // 1. Extract data from the block (these names must match your JSON 'name' fields)
  // The UE usually renders these as divs within the block
  const titleContent = block.querySelector(':scope > div > div:nth-child(1)')?.innerText;
  const imageElement = block.querySelector('picture');
  const bodyContent = block.querySelector(':scope > div > div:nth-child(4)'); // The rich text area

  // 2. Clear the block to rebuild it cleanly
  block.innerHTML = '';

  // 3. Create the Title Header
  if (titleContent) {
    const header = document.createElement('div');
    header.className = 'featured-story-header';
    const h2 = document.createElement('h2');
    h2.textContent = titleContent;
    header.append(h2);
    block.append(header);
  }

  // 4. Create the Side-by-Side Body
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // Left side: Image
  const imgCol = document.createElement('div');
  imgCol.className = 'featured-story-image';
  if (imageElement) {
    imgCol.append(imageElement);
  }

  // Right side: Text and Button
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (bodyContent) {
    textCol.innerHTML = bodyContent.innerHTML;
    
    // Style any links as buttons
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }

  body.append(imgCol, textCol);
  block.append(body);
}
