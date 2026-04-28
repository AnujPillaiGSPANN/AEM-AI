import { createOptimizedPicture } from '../../scripts/aem.js';

function buildCard(row) {
  const card = document.createElement('div');
  card.className = 'travel-featured-card';

  const img = row.querySelector('picture img');
  if (img) {
    const pictureWrap = document.createElement('div');
    pictureWrap.className = 'travel-featured-card-image';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    pictureWrap.append(optimized);
    card.append(pictureWrap);
  }

  const overlay = document.createElement('div');
  overlay.className = 'travel-featured-card-overlay';

  const texts = row.querySelectorAll('h1, h2, h3, h4, p');
  const textValues = [];
  texts.forEach((t) => {
    const content = t.textContent.trim();
    if (content) {
      textValues.push({ tag: t.tagName.toLowerCase(), content });
    }
  });

  if (textValues.length > 0) {
    const title = document.createElement('h3');
    title.className = 'travel-featured-card-title';
    title.textContent = textValues[0].content;
    overlay.append(title);
  }

  if (textValues.length > 1) {
    const location = document.createElement('p');
    location.className = 'travel-featured-card-location';
    location.textContent = textValues[1].content;
    overlay.append(location);
  }

  if (textValues.length > 2) {
    const rating = document.createElement('span');
    rating.className = 'travel-featured-card-rating';
    rating.textContent = textValues[2].content;
    overlay.append(rating);
  }

  card.append(overlay);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'travel-featured-container';

  rows.forEach((row) => {
    container.append(buildCard(row));
  });

  block.textContent = '';
  block.append(container);
}
