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
  // 1. Identify the rows. 
  // If the block was already decorated, we look for the grid we created.
  const isAlreadyDecorated = block.querySelector('.aldevron-modalities-grid');
  const rows = isAlreadyDecorated 
    ? [...block.querySelectorAll('.aldevron-modalities-card')] 
    : [...block.children];

  // 2. Create/Get the Grid Container
  let grid = block.querySelector('.aldevron-modalities-grid');
  if (!grid) {
    grid = document.createElement('ul');
    grid.classList.add('aldevron-modalities-grid');
    grid.setAttribute('data-aue-type', 'container');
    grid.setAttribute('data-aue-filter', 'aldevron-modalities');
    grid.setAttribute('data-aue-label', 'Modalities Grid');
  }

  // 3. Process Rows
  rows.forEach((row) => {
    // If it's already a card, don't re-decorate it, just ensure instrumentation
    if (row.classList.contains('aldevron-modalities-card')) return;

    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', 'Modality Card');

    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    // --- Icon ---
    const iconDiv = document.createElement('div');
    iconDiv.className = 'aldevron-modalities-icon';
    const img = imageCell?.querySelector('img');
    if (img) {
      iconDiv.append(createOptimizedPicture(img.src, img.alt || 'icon', false, [{ width: '200' }]));
    }
    card.append(iconDiv);

    // --- Text ---
    const textDiv = document.createElement('div');
    textDiv.className = 'aldevron-modalities-text';
    textDiv.innerHTML = textCell?.innerHTML || '<h3>New Modality</h3><p>Edit content...</p>';
    card.append(textDiv);
    
    grid.append(card);
  });

  // 4. Final step: Only clear and append if we actually have new content
  if (!isAlreadyDecorated) {
    block.innerHTML = '';
    block.append(grid);
  }
}
