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
  // 1. Capture the raw data before we clear the block
  const rawRows = [...block.querySelectorAll(':scope > div > div')];
  
  // Identify data by content type rather than index
  const titleText = rawRows.find(row => row.innerText && !row.querySelector('picture') && row.innerText.length < 150)?.innerText;
  const pictureElement = block.querySelector('picture');
  const richTextElement = rawRows.find(row => row.querySelector('p, ul, ol') && !row.querySelector('picture'));

  // 2. Clear the block for a clean rebuild
  block.innerHTML = '';

  // 3. Add the Title at the top
  if (titleText) {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'featured-story-header';
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    titleWrapper.append(h2);
    block.append(titleWrapper);
  }

  // 4. Create the Flex Container for Image/Text
  const contentBody = document.createElement('div');
  contentBody.className = 'featured-story-body';

  // Left Column: Image
  const imageCol = document.createElement('div');
  imageCol.className = 'featured-story-image';
  if (pictureElement) {
    const img = pictureElement.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    imageCol.append(optimized);
  }

  // Right Column: Text and Button
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (richTextElement) {
    textCol.innerHTML = richTextElement.innerHTML;
    
    // Style links as buttons automatically
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }

  // Assemble
  contentBody.append(imageCol, textCol);
  block.append(contentBody);
}
