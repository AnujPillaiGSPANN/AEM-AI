export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-facilities-wrapper';

  // First row: intro content (heading, description, subheading, paragraphs)
  const introSection = document.createElement('div');
  introSection.className = 'aldevron-facilities-intro';

  // Cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'aldevron-facilities-cards';

  rows.forEach((row, index) => {
    const cols = [...row.children];

    if (index === 0) {
      // Intro content
      introSection.innerHTML = cols[0] ? cols[0].innerHTML : '';

      // Style inline links
      introSection.querySelectorAll('a').forEach((a) => {
        a.classList.add('aldevron-facilities-link');
      });
    } else {
      // Facility cards
      const card = document.createElement('div');
      card.className = 'aldevron-facilities-card';

      const imageCol = cols[0];
      if (imageCol) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'aldevron-facilities-card-image';
        const pic = imageCol.querySelector('picture');
        if (pic) imageWrapper.append(pic);
        card.append(imageWrapper);
      }

      const contentCol = cols[1];
      if (contentCol) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'aldevron-facilities-card-content';
        contentDiv.innerHTML = contentCol.innerHTML;

        contentDiv.querySelectorAll('p > strong > a, p > a:only-child').forEach((a) => {
          a.classList.add('aldevron-facilities-card-link');
        });

        card.append(contentDiv);
      }

      cardsContainer.append(card);
    }

    row.remove();
  });

  wrapper.append(introSection);
  wrapper.append(cardsContainer);

  block.textContent = '';
  block.append(wrapper);
}
