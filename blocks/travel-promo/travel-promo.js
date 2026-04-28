function buildOverlay(block) {
  const overlay = document.createElement('div');
  overlay.className = 'travel-promo-overlay';

  const heading = block.querySelector('h1, h2, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'travel-promo-heading';
    h2.textContent = heading.textContent;
    overlay.append(h2);
  }

  const paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const link = p.querySelector('a');
    if (link) {
      const cta = document.createElement('a');
      cta.className = 'travel-promo-cta';
      cta.href = link.href;
      cta.textContent = link.textContent;
      overlay.append(cta);
    } else {
      const text = p.textContent.trim();
      if (text) {
        const subtitle = document.createElement('p');
        subtitle.className = 'travel-promo-subtitle';
        subtitle.textContent = text;
        overlay.append(subtitle);
      }
    }
  });

  return overlay;
}

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const bgImage = picture ? picture.querySelector('img') : null;

  const card = document.createElement('div');
  card.className = 'travel-promo-card';

  if (bgImage) {
    card.style.backgroundImage = `url(${bgImage.src})`;
  }

  card.append(buildOverlay(block));

  block.textContent = '';
  block.append(card);
}
