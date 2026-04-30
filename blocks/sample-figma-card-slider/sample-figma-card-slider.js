import { createOptimizedPicture } from '../../scripts/aem.js';

function buildCard(row) {
  const card = document.createElement('li');
  card.classList.add('sample-figma-card-slider-card');

  const cells = [...row.children];

  // First cell: image
  if (cells[0]) {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('sample-figma-card-slider-image');
    const pic = cells[0].querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
        imgDiv.append(optimized);
      }
    }
    card.append(imgDiv);
  }

  // Second cell: content (title, description, date, tag, read more)
  if (cells[1]) {
    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('sample-figma-card-slider-body');
    while (cells[1].firstChild) bodyDiv.append(cells[1].firstChild);

    // Style the last link as "Read More"
    const links = bodyDiv.querySelectorAll('a');
    if (links.length > 0) {
      const lastLink = links[links.length - 1];
      lastLink.classList.add('sample-figma-card-slider-readmore');
    }

    card.append(bodyDiv);
  }

  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows.shift();

  // First row: section title + nav arrows
  const header = document.createElement('div');
  header.classList.add('sample-figma-card-slider-header');
  if (firstRow) {
    while (firstRow.firstElementChild) {
      const cell = firstRow.firstElementChild;
      while (cell.firstChild) header.append(cell.firstChild);
      cell.remove();
    }
    firstRow.remove();
  }

  const navButtons = document.createElement('div');
  navButtons.classList.add('sample-figma-card-slider-nav');

  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.classList.add('sample-figma-card-slider-prev');
  prevBtn.textContent = '←';

  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.classList.add('sample-figma-card-slider-next');
  nextBtn.textContent = '→';

  navButtons.append(prevBtn, nextBtn);
  header.append(navButtons);
  block.prepend(header);

  // Remaining rows: cards
  const track = document.createElement('ul');
  track.classList.add('sample-figma-card-slider-track');

  rows.forEach((row) => {
    const card = buildCard(row);
    track.append(card);
    row.remove();
  });

  block.append(track);

  // Nav functionality
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -320, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 320, behavior: 'smooth' });
  });
}
