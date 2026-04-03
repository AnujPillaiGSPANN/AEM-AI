export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('feature-list-item');
    const cells = [...row.children];

    // First cell: icon or number
    if (cells[0]) {
      cells[0].classList.add('feature-list-icon');
    }

    // Second cell: text content (heading + description)
    if (cells[1]) {
      cells[1].classList.add('feature-list-text');
    }
  });
}
