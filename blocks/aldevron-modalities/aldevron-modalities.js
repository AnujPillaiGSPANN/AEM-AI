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
  
  // 1. Handle Header
  const headerRow = rows.shift();
  if (headerRow) {
    headerRow.classList.add('aldevron-modalities-header');
    // We keep the original row to preserve instrumentation
  }

  // 2. Create Grid (The Container)
  const grid = document.createElement('ul');
  grid.classList.add('aldevron-modalities-grid');
  
  // CRITICAL: Map this to your component-filters.json ID
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-filter', 'aldevron-modalities');
  grid.setAttribute('data-aue-label', 'Modalities Grid');

  rows.forEach((row) => {
    // 3. Create Card (The Component)
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    
    // CRITICAL: Tell the editor this is an editable component
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', 'Modality Card');

    // Move content from row to card
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      if (cell.querySelector('picture')) {
        cell.classList.add('aldevron-modalities-icon');
        cell.querySelectorAll('img').forEach((img) => {
          const opt = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
          img.closest('picture').replaceWith(opt);
        });
      } else {
        cell.classList.add('aldevron-modalities-text');
      }
      card.append(cell);
    }
    
    grid.append(card);
    row.remove(); // We remove the empty row skeleton
  });

  block.append(grid);
}
