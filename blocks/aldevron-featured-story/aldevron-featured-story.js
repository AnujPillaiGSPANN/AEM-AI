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
  // 1. Find the elements by their common tags/classes
  const title = block.querySelector('h1, h2, h3');
  const picture = block.querySelector('picture');
  const paragraphs = [...block.querySelectorAll('p')];
  const links = [...block.querySelectorAll('a')];

  // 2. Create a clean structure
  block.innerHTML = ''; // Clear the messy default render

  // Add the Title to the top
  if (title) {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'featured-story-header';
    titleWrapper.append(title);
    block.append(titleWrapper);
  }

  // Create the Flex Body (Image Left, Text Right)
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // Left Column: Image
  const imageCol = document.createElement('div');
  imageCol.className = 'featured-story-image';
  if (picture) {
    const img = picture.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    imageCol.append(optimized);
  }
  
  // Right Column: Text & Button
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  paragraphs.forEach(p => {
    if (!p.querySelector('a')) textCol.append(p); // Add text
  });
  links.forEach(link => {
    link.className = 'button aldevron-featured-story-cta';
    textCol.append(link); // Add button
  });

  body.append(imageCol, textCol);
  block.append(body);
}
