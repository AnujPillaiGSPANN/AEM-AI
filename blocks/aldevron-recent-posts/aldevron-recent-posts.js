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

function decorateCard(row) {
  // We treat the 'row' itself as the card
  row.className = 'aldevron-recent-posts-card';

  row.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  
  // No need to return anything, we are modifying the row in place
}

export default function decorate(block) {
  const rows = [...block.children];
  const columns = [];
  let currentColumn = null;

  rows.forEach((row, index) => {
    if (index % 2 === 0) {
      // This is a Heading Row
      currentColumn = document.createElement('div');
      currentColumn.className = 'aldevron-recent-posts-column';
      
      row.className = 'aldevron-recent-posts-heading';
      currentColumn.append(row); // Move the row into the column
      columns.push(currentColumn);
    } else if (currentColumn) {
      // This is a Cards Row
      const cardsWrapper = document.createElement('div');
      cardsWrapper.className = 'aldevron-recent-posts-cards';
      
      // The cells in this row are your individual "Post Cards"
      // In Edge Delivery, the Universal Editor maps child components to the 'div' inside a row
      [...row.children].forEach((cell) => {
        // We style the cell as the card
        cell.className = 'aldevron-recent-posts-card';
        
        // Optimize images inside the cell
        cell.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
          img.closest('picture').replaceWith(optimizedPic);
        });
        
        cardsWrapper.append(cell);
      });

      // We still need to keep the 'row' element alive if it has instrumentation
      // But since the cards are usually the cells, we append the wrapper to the column
      currentColumn.append(cardsWrapper);
      
      // Optional: Hide the now-empty row if it's causing layout issues, 
      // but don't .remove() it if the Editor is attached to it.
      row.style.display = 'none'; 
    }
  });

  // Use replaceChildren to swap out the old content for your new columns
  block.replaceChildren(...columns);
}
