export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-about-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      while (col.firstElementChild) {
        wrapper.append(col.firstElementChild);
      }
    });
  });

  wrapper.querySelectorAll('a').forEach((link) => {
    const parent = link.parentElement;
    if (parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === link.textContent.trim()) {
      link.classList.add('cta');
    }
  });

  block.textContent = '';

  const overlay = document.createElement('div');
  overlay.className = 'aldevron-about-overlay';
  overlay.append(wrapper);
  block.append(overlay);
}
