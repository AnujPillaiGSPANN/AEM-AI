import { createOptimizedPicture } from '../../scripts/aem.js';

function buildArticleCard(container) {
  const card = document.createElement('div');
  card.className = 'aldevron-recent-posts-card';

  while (container.firstElementChild) {
    card.append(container.firstElementChild);
  }

  card.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const columns = [];
  let currentColumn = null;

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (index % 2 === 0) {
      currentColumn = document.createElement('div');
      currentColumn.className = 'aldevron-recent-posts-column';
      const heading = document.createElement('div');
      heading.className = 'aldevron-recent-posts-heading';
      cells.forEach((cell) => {
        while (cell.firstElementChild) {
          heading.append(cell.firstElementChild);
        }
      });
      currentColumn.append(heading);
      columns.push(currentColumn);
    } else if (currentColumn) {
      const cardsWrapper = document.createElement('div');
      cardsWrapper.className = 'aldevron-recent-posts-cards';
      cells.forEach((cell) => {
        const card = buildArticleCard(cell);
        cardsWrapper.append(card);
      });
      currentColumn.append(cardsWrapper);
    }
  });

  block.textContent = '';
  columns.forEach((col) => {
    block.append(col);
  });
}
