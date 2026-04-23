export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-catalog-intro-content';

  [...block.children].forEach((row) => {
    while (row.firstElementChild) {
      const child = row.firstElementChild;
      wrapper.append(child);
    }
  });

  wrapper.querySelectorAll('a').forEach((link) => {
    const parent = link.parentElement;
    if (parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === link.textContent.trim()) {
      link.classList.add('cta');
    }
  });

  block.textContent = '';
  block.append(wrapper);
}
