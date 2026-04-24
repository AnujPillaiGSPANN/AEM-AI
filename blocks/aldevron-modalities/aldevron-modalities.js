// import { createOptimizedPicture } from '../../scripts/aem.js';

// export default function decorate(block) {
//   const rows = [...block.children];
//   const header = rows.shift();

//   if (header) {
//     const headerDiv = document.createElement('div');
//     headerDiv.classList.add('aldevron-modalities-header');
//     while (header.firstElementChild) {
//       const cell = header.firstElementChild;
//       while (cell.firstChild) headerDiv.append(cell.firstChild);
//       cell.remove();
//     }
//     header.remove();
//     block.prepend(headerDiv);
//   }

//   const grid = document.createElement('ul');
//   grid.classList.add('aldevron-modalities-grid');

//   rows.forEach((row) => {
//     const card = document.createElement('li');
//     card.classList.add('aldevron-modalities-card');
//     while (row.firstElementChild) {
//       const cell = row.firstElementChild;
//       if (cell.querySelector('picture')) {
//         cell.classList.add('aldevron-modalities-icon');
//         cell.querySelectorAll('picture > img').forEach((img) => {
//           const opt = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
//           img.closest('picture').replaceWith(opt);
//         });
//       } else {
//         cell.classList.add('aldevron-modalities-text');
//       }
//       card.append(cell);
//     }
//     grid.append(card);
//     row.remove();
//   });

//   block.append(grid);
// }

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  
  // 1. Clear the block to prevent "leaked" content/ghosts
  block.innerHTML = '';

  // 2. Create Grid (The Container)
  const grid = document.createElement('ul');
  grid.classList.add('aldevron-modalities-grid');
  
  // Instrumentation for Universal Editor
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-filter', 'aldevron-modalities');
  grid.setAttribute('data-aue-label', 'Modalities Grid');

  rows.forEach((row) => {
    // 3. Create Card (The Component)
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    
    // Instrumentation for the individual card
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', 'Modality Card');

    // Identify cells: [0] is Image, [1] is Text
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    // --- Image Handling ---
    if (imageCell) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'aldevron-modalities-icon';
      const img = imageCell.querySelector('img');
      if (img) {
        iconDiv.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
      }
      card.append(iconDiv);
    }

    // --- Text Handling ---
    if (textCell) {
      const textDiv = document.createElement('div');
      textDiv.className = 'aldevron-modalities-text';
      textDiv.innerHTML = textCell.innerHTML;
      card.append(textDiv);
    }
    
    grid.append(card);
  });

  block.append(grid);
}
