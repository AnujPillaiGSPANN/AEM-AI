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
  
  // 1. Create the grid container first
  const grid = document.createElement('ul');
  grid.classList.add('aldevron-modalities-grid');
  
  // Instrumentation for Universal Editor
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-filter', 'aldevron-modalities');
  grid.setAttribute('data-aue-label', 'Modalities Grid');

  rows.forEach((row) => {
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    
    // Instrumentation for the individual component
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', 'Modality Card');

    // 2. Identify data safely
    const cells = [...row.children];
    // Cell 0 is usually the image, Cell 1 is the text
    const imageCell = cells[0];
    const textCell = cells[1];

    // --- Icon Column ---
    const iconDiv = document.createElement('div');
    iconDiv.className = 'aldevron-modalities-icon';
    
    const img = imageCell?.querySelector('img');
    if (img) {
      iconDiv.append(createOptimizedPicture(img.src, img.alt || 'icon', false, [{ width: '200' }]));
    } else {
      // Show a placeholder so the card isn't invisible while empty
      iconDiv.innerHTML = '<div style="width:50px; height:50px; border:1px dashed #ccc;"></div>';
    }
    card.append(iconDiv);

    // --- Text Column ---
    const textDiv = document.createElement('div');
    textDiv.className = 'aldevron-modalities-text';
    
    // If textCell exists, use it; otherwise, use a placeholder
    if (textCell && textCell.innerHTML.trim() !== '') {
      textDiv.innerHTML = textCell.innerHTML;
    } else {
      textDiv.innerHTML = '<h3>New Modality</h3><p>Click to edit content</p>';
    }
    card.append(textDiv);
    
    grid.append(card);
  });

  // 3. Clear and replace ONLY at the very end
  block.replaceChildren(grid);
}
