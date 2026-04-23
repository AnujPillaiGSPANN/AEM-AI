export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-modalities-wrapper';

  // First row is heading + description
  const headerRow = rows.shift();
  if (headerRow) {
    const headerContent = headerRow.children[0];
    if (headerContent) {
      const header = document.createElement('div');
      header.className = 'aldevron-modalities-header';
      header.innerHTML = headerContent.innerHTML;
      wrapper.append(header);
    }
    headerRow.remove();
  }

  // Remaining rows are cards
  const grid = document.createElement('div');
  grid.className = 'aldevron-modalities-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'aldevron-modalities-card';

    // Column 1: icon image
    const iconCol = cols[0];
    if (iconCol) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'aldevron-modalities-card-icon';
      const pic = iconCol.querySelector('picture');
      if (pic) iconWrapper.append(pic);
      card.append(iconWrapper);
    }

    // Column 2: title, description, link
    const contentCol = cols[1];
    if (contentCol) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'aldevron-modalities-card-content';
      contentDiv.innerHTML = contentCol.innerHTML;

      contentDiv.querySelectorAll('a').forEach((a) => {
        a.classList.add('aldevron-modalities-link');
      });

      card.append(contentDiv);
    }

    grid.append(card);
    row.remove();
  });

  wrapper.append(grid);
  block.textContent = '';
  block.append(wrapper);
}
