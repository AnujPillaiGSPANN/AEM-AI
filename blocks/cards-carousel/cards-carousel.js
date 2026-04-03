export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('div');
  track.classList.add('cards-carousel-track');

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.classList.add('cards-carousel-card');

    const cells = [...row.children];
    // First cell: image
    if (cells[0]) {
      const picture = cells[0].querySelector('picture');
      if (picture) {
        const imageWrap = document.createElement('div');
        imageWrap.classList.add('cards-carousel-image');
        imageWrap.append(picture);
        card.append(imageWrap);
      }
    }

    // Second cell: text content (category, title, link)
    if (cells[1]) {
      const textWrap = document.createElement('div');
      textWrap.classList.add('cards-carousel-text');
      while (cells[1].firstChild) textWrap.append(cells[1].firstChild);
      card.append(textWrap);
    }

    row.remove();
    track.append(card);
  });

  // Navigation buttons
  const nav = document.createElement('div');
  nav.classList.add('cards-carousel-nav');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('cards-carousel-prev');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '\u2039';
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('cards-carousel-next');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '\u203A';

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
  });

  nav.append(prevBtn, nextBtn);
  block.append(track, nav);
}
