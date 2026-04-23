export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-product-preps-wrapper';

  // First row: left content (heading + description + CTA)
  const leftCol = document.createElement('div');
  leftCol.className = 'aldevron-product-preps-left';

  // Right side: product cards
  const rightCol = document.createElement('div');
  rightCol.className = 'aldevron-product-preps-right';

  rows.forEach((row, index) => {
    const cols = [...row.children];

    if (index === 0) {
      // First row is intro content
      leftCol.innerHTML = cols[0] ? cols[0].innerHTML : '';

      // Style CTA links
      leftCol.querySelectorAll('p > strong > a, p > a:only-child').forEach((a) => {
        a.classList.add('aldevron-product-preps-cta');
      });
    } else {
      // Remaining rows are product cards
      const card = document.createElement('div');
      card.className = 'aldevron-product-preps-card';

      const imageCol = cols[0];
      if (imageCol) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'aldevron-product-preps-card-image';
        const pic = imageCol.querySelector('picture');
        if (pic) imageWrapper.append(pic);
        card.append(imageWrapper);
      }

      const linkCol = cols[1];
      if (linkCol) {
        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'aldevron-product-preps-card-btn';
        const link = linkCol.querySelector('a');
        if (link) {
          link.classList.add('aldevron-product-preps-buy-btn');
          btnWrapper.append(link);
        }
        card.append(btnWrapper);
      }

      rightCol.append(card);
    }

    row.remove();
  });

  wrapper.append(leftCol);
  wrapper.append(rightCol);

  block.textContent = '';
  block.append(wrapper);
}
