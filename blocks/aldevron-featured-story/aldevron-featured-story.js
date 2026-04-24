export default function decorate(block) {
  const content = document.createElement('div');
  content.classList.add('aldevron-featured-story-content');

  [...block.children].forEach((row) => {
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      while (cell.firstChild) content.append(cell.firstChild);
      cell.remove();
    }
    row.remove();
  });

  content.querySelectorAll('a').forEach((link) => {
    if (link.parentElement.tagName === 'P' && link.parentElement.children.length === 1) {
      link.classList.add('aldevron-featured-story-cta');
    }
  });

  block.append(content);
}
