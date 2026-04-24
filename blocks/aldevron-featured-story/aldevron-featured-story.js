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
  // 1. Collect all potential data parts
  const allDivs = [...block.querySelectorAll(':scope > div > div')];
  
  let titleNode = null;
  let pictureNode = null;
  let contentNode = null;

  allDivs.forEach((div) => {
    // Check if it's the image
    if (div.querySelector('picture')) {
      pictureNode = div.querySelector('picture');
    } 
    // Check if it's the Rich Text (usually contains P, UL, or multiple lines)
    else if (div.querySelector('p, ul, ol, a') || div.innerHTML.includes('<br>')) {
      contentNode = div;
    }
    // If it's just plain text and not empty, it's likely the title
    else if (div.innerText.trim() !== '' && !titleNode) {
      titleNode = div;
    }
  });

  // 2. Build the new clean structure
  block.innerHTML = '';

  // --- Title (Top) ---
  if (titleNode) {
    const header = document.createElement('div');
    header.className = 'featured-story-header';
    const h2 = document.createElement('h2');
    h2.innerHTML = titleNode.innerHTML;
    header.append(h2);
    block.append(header);
  }

  // --- Flex Body Container ---
  const body = document.createElement('div');
  body.className = 'featured-story-body';

  // Left side: Image
  const imgCol = document.createElement('div');
  imgCol.className = 'featured-story-image';
  if (pictureNode) {
    const img = pictureNode.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt || 'featured story image', false, [{ width: '750' }]);
    imgCol.append(optimized);
  }
  body.append(imgCol);

  // Right side: Everything else (Story text & Button)
  const textCol = document.createElement('div');
  textCol.className = 'featured-story-text';
  if (contentNode) {
    textCol.innerHTML = contentNode.innerHTML;
    
    // Format any links inside this area as buttons
    textCol.querySelectorAll('a').forEach((link) => {
      link.classList.add('button', 'primary');
    });
  }
  body.append(textCol);

  block.append(body);
}
