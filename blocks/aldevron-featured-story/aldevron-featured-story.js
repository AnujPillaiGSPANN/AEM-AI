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
  const rows = [...block.children];
  
  // 1. Create the main containers
  const container = document.createElement('div');
  container.classList.add('aldevron-featured-story-container');

  const titleArea = document.createElement('div');
  titleArea.classList.add('aldevron-featured-story-title');

  const bodyArea = document.createElement('div');
  bodyArea.classList.add('aldevron-featured-story-body');

  const imageArea = document.createElement('div');
  imageArea.classList.add('aldevron-featured-story-image');

  const textArea = document.createElement('div');
  textArea.classList.add('aldevron-featured-story-text');

  // 2. Distribute the content
  rows.forEach((row, index) => {
    if (index === 0) {
      // First row content goes to Title
      while (row.firstChild) titleArea.append(row.firstChild);
    } else {
      // Subsequent rows: Separate Image from Text
      [...row.children].forEach((cell) => {
        const picture = cell.querySelector('picture');
        if (picture) {
          // Optimize and move Image
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
          picture.replaceWith(optimizedPic);
          imageArea.append(cell);
        } else {
          // Move Text and style Buttons
          cell.querySelectorAll('a').forEach((link) => {
             link.classList.add('button', 'aldevron-featured-story-cta');
          });
          textArea.append(cell);
        }
      });
    }
  });

  // 3. Assemble the DOM
  bodyArea.append(imageArea, textArea);
  container.append(titleArea, bodyArea);

  block.replaceChildren(container);
}
