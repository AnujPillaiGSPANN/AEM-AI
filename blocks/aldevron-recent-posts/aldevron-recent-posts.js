// import { createOptimizedPicture } from '../../scripts/aem.js';

// function buildArticleCard(container) {
//   const card = document.createElement('div');
//   card.className = 'aldevron-recent-posts-card';

//   while (container.firstElementChild) {
//     card.append(container.firstElementChild);
//   }

//   card.querySelectorAll('picture > img').forEach((img) => {
//     const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
//     img.closest('picture').replaceWith(optimizedPic);
//   });

//   return card;
// }

// export default function decorate(block) {
//   const rows = [...block.children];
//   const columns = [];
//   let currentColumn = null;

//   rows.forEach((row, index) => {
//     const cells = [...row.children];
//     if (index % 2 === 0) {
//       currentColumn = document.createElement('div');
//       currentColumn.className = 'aldevron-recent-posts-column';
//       const heading = document.createElement('div');
//       heading.className = 'aldevron-recent-posts-heading';
//       cells.forEach((cell) => {
//         while (cell.firstElementChild) {
//           heading.append(cell.firstElementChild);
//         }
//       });
//       currentColumn.append(heading);
//       columns.push(currentColumn);
//     } else if (currentColumn) {
//       const cardsWrapper = document.createElement('div');
//       cardsWrapper.className = 'aldevron-recent-posts-cards';
//       cells.forEach((cell) => {
//         const card = buildArticleCard(cell);
//         cardsWrapper.append(card);
//       });
//       currentColumn.append(cardsWrapper);
//     }
//   });

//   block.textContent = '';
//   columns.forEach((col) => {
//     block.append(col);
//   });
// }

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const columns = [];
  let currentColumn = null;

  rows.forEach((row, index) => {
    if (index % 2 === 0) {
      // 1. HEADING ROW
      currentColumn = document.createElement('div');
      currentColumn.className = 'aldevron-recent-posts-column';
      
      row.className = 'aldevron-recent-posts-heading';
      currentColumn.append(row); 
      columns.push(currentColumn);
    } else if (currentColumn) {
      // 2. CARDS ROW (The Container)
      // This 'row' is likely what holds the 'data-aue-prop="items"' 
      // or similar from the Universal Editor.
      
      row.className = 'aldevron-recent-posts-cards';
      
      // Ensure this row is flagged as the container for the editor
      row.setAttribute('data-aue-type', 'container');
      row.setAttribute('data-aue-filter', 'aldevron-recent-posts');

      [...row.children].forEach((cell) => {
        cell.className = 'aldevron-recent-posts-card';
        // Flag individual cards so the editor knows they are components
        cell.setAttribute('data-aue-type', 'component');
        cell.setAttribute('data-aue-label', 'Post Card');

        cell.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
          img.closest('picture').replaceWith(optimizedPic);
        });
      });

      currentColumn.append(row); // Append the original row, don't hide it!
    }
  });

  block.replaceChildren(...columns);
}
