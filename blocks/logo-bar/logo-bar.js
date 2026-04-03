export default function decorate(block) {
  const rows = [...block.children];
  const logos = document.createElement('div');
  logos.classList.add('logo-bar-logos');

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const link = cell.querySelector('a');
      const picture = cell.querySelector('picture');

      if (link || picture) {
        const item = document.createElement('div');
        item.classList.add('logo-bar-item');

        if (link) {
          item.append(link);
        } else {
          item.append(picture);
        }

        logos.append(item);
      }
    });
    row.remove();
  });

  block.append(logos);
}
