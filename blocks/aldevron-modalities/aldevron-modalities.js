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
  block.innerHTML = '';

  const grid = document.createElement('ul');
  grid.classList.add('aldevron-modalities-grid');
  
  // This connects the UL to the "items" field in your JSON
  grid.setAttribute('data-aue-prop', 'items');
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-label', 'Modalities List');
  grid.setAttribute('data-aue-filter', 'aldevron-modality-card');

  rows.forEach((row, index) => {
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    
    // Mark this LI as the Modality Card component
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', `Modality Card ${index + 1}`);

    const cells = [...row.children];

    // ICON (Matches "image" in your JSON)
    const iconDiv = document.createElement('div');
    iconDiv.className = 'aldevron-modalities-icon';
    iconDiv.setAttribute('data-aue-prop', 'image');
    iconDiv.setAttribute('data-aue-type', 'media');
    iconDiv.setAttribute('data-aue-label', 'Icon');
    
    const img = cells[0]?.querySelector('img');
    if (img) {
      iconDiv.append(createOptimizedPicture(img.src, img.alt || 'icon', false, [{ width: '200' }]));
    }
    card.append(iconDiv);

    // TEXT (Matches "text" in your JSON)
    const textDiv = document.createElement('div');
    textDiv.className = 'aldevron-modalities-text';
    textDiv.setAttribute('data-aue-prop', 'text');
    textDiv.setAttribute('data-aue-type', 'richtext');
    textDiv.setAttribute('data-aue-label', 'Card Content');
    
    if (cells[1]) {
      textDiv.innerHTML = cells[1].innerHTML;
    }
    card.append(textDiv);
    
    grid.append(card);
  });

  block.append(grid);
}
