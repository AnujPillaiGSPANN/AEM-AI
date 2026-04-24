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
  
  // 1. This tells the Content Tree: "I am a folder for cards"
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-filter', 'aldevron-modality-card'); // Must match the child model name
  grid.setAttribute('data-aue-prop', 'items'); // This is often the missing link for the tree
  grid.setAttribute('data-aue-label', 'Modalities List');

  rows.forEach((row, index) => {
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    
    // 2. This tells the Content Tree: "I am an individual item"
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-model', 'aldevron-modality-card');
    card.setAttribute('data-aue-label', `Modality Card ${index + 1}`);
    
    // This attribute helps the tree track the specific index
    card.setAttribute('data-aue-resource', `customer-resource-${index}`); 

    const cells = [...row.children];
    
    // ICON
    const iconDiv = document.createElement('div');
    iconDiv.className = 'aldevron-modalities-icon';
    iconDiv.setAttribute('data-aue-prop', 'image'); // Matches JSON field name
    iconDiv.setAttribute('data-aue-type', 'media');
    
    const img = cells[0]?.querySelector('img');
    if (img) {
      iconDiv.append(createOptimizedPicture(img.src, img.alt || 'icon', false, [{ width: '200' }]));
    }
    card.append(iconDiv);

    // TEXT
    const textDiv = document.createElement('div');
    textDiv.className = 'aldevron-modalities-text';
    textDiv.setAttribute('data-aue-prop', 'text'); // Matches JSON field name
    textDiv.setAttribute('data-aue-type', 'richtext');
    
    if (cells[1]) {
      textDiv.innerHTML = cells[1].innerHTML;
    }
    card.append(textDiv);
    
    grid.append(card);
  });

  block.append(grid);
}
