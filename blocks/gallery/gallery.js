export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.classList.add('gallery-grid');

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.append(picture);
        grid.append(item);
      }
    });
    row.remove();
  });

  block.append(grid);
}
