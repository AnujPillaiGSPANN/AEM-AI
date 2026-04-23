import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const header = rows.shift();

  if (header) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('aldevron-modalities-header');
    while (header.firstElementChild) {
      const cell = header.firstElementChild;
      while (cell.firstChild) headerDiv.append(cell.firstChild);
      cell.remove();
    }
    header.remove();
    block.prepend(headerDiv);
  }

  const grid = document.createElement('ul');
  grid.classList.add('aldevron-modalities-grid');

  rows.forEach((row) => {
    const card = document.createElement('li');
    card.classList.add('aldevron-modalities-card');
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      if (cell.querySelector('picture')) {
        cell.classList.add('aldevron-modalities-icon');
        cell.querySelectorAll('picture > img').forEach((img) => {
          const opt = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
          img.closest('picture').replaceWith(opt);
        });
      } else {
        cell.classList.add('aldevron-modalities-text');
      }
      card.append(cell);
    }
    grid.append(card);
    row.remove();
  });

  block.append(grid);
}
