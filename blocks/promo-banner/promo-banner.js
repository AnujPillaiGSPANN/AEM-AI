export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Row 0: background image
  const imageRow = rows[0];
  const picture = imageRow.querySelector('picture');
  if (picture) {
    picture.classList.add('promo-banner-bg');
    block.prepend(picture);
  }
  imageRow.remove();

  // Remaining rows: overlay content
  const overlay = document.createElement('div');
  overlay.classList.add('promo-banner-content');
  rows.slice(1).forEach((row) => {
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      while (cell.firstChild) overlay.append(cell.firstChild);
      cell.remove();
    }
    row.remove();
  });

  block.append(overlay);
}
