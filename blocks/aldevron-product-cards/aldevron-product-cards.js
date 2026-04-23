export default function decorate(block) {
  const rows = [...block.children];

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'aldevron-product-cards-container';

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'aldevron-product-card';

    // Column 1: product icon/image
    const iconCol = cols[0];
    if (iconCol) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'aldevron-product-card-icon';
      const pic = iconCol.querySelector('picture');
      if (pic) iconWrapper.append(pic);
      card.append(iconWrapper);
    }

    // Column 2: title, description, link
    const contentCol = cols[1];
    if (contentCol) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'aldevron-product-card-content';
      contentDiv.innerHTML = contentCol.innerHTML;

      contentDiv.querySelectorAll('a').forEach((a) => {
        a.classList.add('aldevron-product-card-link');
      });

      card.append(contentDiv);
    }

    scrollContainer.append(card);
    row.remove();
  });

  block.textContent = '';
  block.append(scrollContainer);
}
