import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const introRow = rows.shift();
  const introDiv = document.createElement('div');
  introDiv.className = 'aldevron-facilities-intro';

  if (introRow) {
    [...introRow.children].forEach((col) => {
      while (col.firstElementChild) {
        introDiv.append(col.firstElementChild);
      }
    });
  }

  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'aldevron-facilities-cards';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'aldevron-facilities-card';

    [...row.children].forEach((col) => {
      if (col.children.length === 1 && col.querySelector('picture')) {
        col.className = 'aldevron-facilities-card-image';
        card.append(col);
      } else {
        col.className = 'aldevron-facilities-card-body';
        card.append(col);
      }
    });

    card.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      img.closest('picture').replaceWith(optimizedPic);
    });

    card.querySelectorAll('a').forEach((link) => {
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1) {
        link.classList.add('learn-more');
      }
    });

    cardsDiv.append(card);
  });

  block.textContent = '';
  block.append(introDiv);
  block.append(cardsDiv);
}
