// import { createOptimizedPicture } from '../../scripts/aem.js';

// export default function decorate(block) {
//   const rows = [...block.children];
//   const introRow = rows.shift();
//   const introDiv = document.createElement('div');
//   introDiv.className = 'aldevron-facilities-intro';

//   if (introRow) {
//     [...introRow.children].forEach((col) => {
//       while (col.firstElementChild) {
//         introDiv.append(col.firstElementChild);
//       }
//     });
//   }

//   const cardsDiv = document.createElement('div');
//   cardsDiv.className = 'aldevron-facilities-cards';

//   rows.forEach((row) => {
//     const card = document.createElement('div');
//     card.className = 'aldevron-facilities-card';

//     [...row.children].forEach((col) => {
//       if (col.children.length === 1 && col.querySelector('picture')) {
//         col.className = 'aldevron-facilities-card-image';
//         card.append(col);
//       } else {
//         col.className = 'aldevron-facilities-card-body';
//         card.append(col);
//       }
//     });

//     card.querySelectorAll('picture > img').forEach((img) => {
//       const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
//       img.closest('picture').replaceWith(optimizedPic);
//     });

//     card.querySelectorAll('a').forEach((link) => {
//       const parent = link.parentElement;
//       if (parent.tagName === 'P' && parent.children.length === 1) {
//         link.classList.add('learn-more');
//       }
//     });

//     cardsDiv.append(card);
//   });

//   block.textContent = '';
//   block.append(introDiv);
//   block.append(cardsDiv);
// }


import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  
  // 1. Handle the Intro Row (The first row in the table)
  const introRow = rows[0]; // Don't shift, just reference
  const introDiv = document.createElement('div');
  introDiv.className = 'aldevron-facilities-intro';

  if (introRow) {
    // Style the introRow instead of emptying it
    introRow.classList.add('aldevron-facilities-intro-row');
    // Move all cells into the intro container
    [...introRow.children].forEach((col) => {
       introDiv.append(col);
    });
    // Optional: if you want to keep the introRow as the container, 
    // you can just append introRow to block later.
  }

  // 2. Handle the Cards (The remaining rows)
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'aldevron-facilities-cards';

  // Slice from 1 to skip the intro row
  rows.slice(1).forEach((row) => {
    // IMPORTANT: Treat the 'row' as the card itself to keep UE happy
    row.className = 'aldevron-facilities-card';

    [...row.children].forEach((col) => {
      if (col.children.length === 1 && col.querySelector('picture')) {
        col.className = 'aldevron-facilities-card-image';
      } else {
        col.className = 'aldevron-facilities-card-body';
      }
    });

    // Optimization and Link styling logic stays the same
    row.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      img.closest('picture').replaceWith(optimizedPic);
    });

    row.querySelectorAll('a').forEach((link) => {
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1) {
        link.classList.add('learn-more');
      }
    });

    cardsDiv.append(row); // Move the row into the cards container
  });

  // 3. Clear and Rebuild without using .textContent = ''
  // Using replaceChildren is safer and cleaner
  block.replaceChildren(introDiv, cardsDiv);
}
