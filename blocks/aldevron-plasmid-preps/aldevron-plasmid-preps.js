import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const introRow = rows.shift();
  const introDiv = document.createElement('div');
  introDiv.className = 'aldevron-plasmid-preps-intro';

  if (introRow) {
    [...introRow.children].forEach((col) => {
      while (col.firstElementChild) {
        introDiv.append(col.firstElementChild);
      }
    });
  }

  introDiv.querySelectorAll('a').forEach((link) => {
    const parent = link.parentElement;
    if (parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === link.textContent.trim()) {
      link.classList.add('cta');
    }
  });

  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'aldevron-plasmid-preps-cards';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'aldevron-plasmid-preps-card';

    [...row.children].forEach((col) => {
      while (col.firstElementChild) {
        card.append(col.firstElementChild);
      }
    });

    card.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      img.closest('picture').replaceWith(optimizedPic);
    });

    card.querySelectorAll('a').forEach((link) => {
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1) {
        link.classList.add('buy-now');
      }
    });

    cardsDiv.append(card);
  });

  block.textContent = '';
  block.append(introDiv);
  block.append(cardsDiv);
}
