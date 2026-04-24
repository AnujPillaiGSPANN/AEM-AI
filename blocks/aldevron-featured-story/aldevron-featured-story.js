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
  // 1. Get all the data rows from the block
  const rows = [...block.children];

  // 2. Map the data based on your JSON structure
  // row[0] = Title, row[1] = Image, row[2] = Alt Text, row[3] = Content
  const titleData = rows[0]?.querySelector('div');
  const imageData = rows[1]?.querySelector('picture');
  const textData = rows[3]?.querySelector('div'); // This is your Story Content & Button

  // 3. Clear the block to rebuild the layout
  block.innerHTML = '';

  // 4. ADD TITLE (Top)
  if (titleData && titleData.innerText.trim() !== '') {
    const header = document.createElement('div');
    header.className = 'featured-story-header';
    const h2 = document.createElement('h2');
    h2.innerHTML = titleData.innerHTML;
    header.append(h2);
    block.append(header);
  }

  // 5. CREATE BODY (Flex Container)
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // LEFT COLUMN: Image
  const imageCol = document.createElement('div');
  imageCol.className = 'featured-story-image';
  if (imageData) {
    const img = imageData.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    imageCol.append(optimized);
  }
  body.append(imageCol);

  // RIGHT COLUMN: All Text and Buttons
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (textData) {
    // This takes EVERYTHING inside the rich text field (paragraphs, links, etc.)
    textCol.innerHTML = textData.innerHTML;
    
    // Convert links into buttons
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }
  body.append(textCol);

  // 6. Add the Body to the Block
  block.append(body);
}
