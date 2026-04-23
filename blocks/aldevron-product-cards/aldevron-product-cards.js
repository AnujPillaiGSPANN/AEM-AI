import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    [...row.children].forEach((col) => {
      if (col.children.length === 1 && col.querySelector('picture')) {
        col.className = 'aldevron-product-cards-card-icon';
      } else {
        col.className = 'aldevron-product-cards-card-body';
      }
      li.append(col);
    });

    li.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      img.closest('picture').replaceWith(optimizedPic);
    });

    li.querySelectorAll('a').forEach((link) => {
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1) {
        link.classList.add('learn-more');
      }
    });

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
