export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-contact-us-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      while (col.firstElementChild) {
        wrapper.append(col.firstElementChild);
      }
    });
  });

  wrapper.querySelectorAll('a').forEach((link) => {
    if (link.href && link.href.startsWith('tel:')) {
      link.classList.add('phone-link');
    } else {
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === link.textContent.trim()) {
        link.classList.add('cta');
      }
    }
  });

  block.textContent = '';
  block.append(wrapper);
}
