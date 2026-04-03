export default function decorate(block) {
  const rows = [...block.children];
  const content = document.createElement('div');
  content.classList.add('cta-banner-content');

  rows.forEach((row) => {
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      while (cell.firstChild) content.append(cell.firstChild);
      cell.remove();
    }
    row.remove();
  });

  block.append(content);
}
