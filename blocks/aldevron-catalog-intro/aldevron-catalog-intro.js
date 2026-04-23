export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-catalog-intro-wrapper';

  rows.forEach((row) => {
    const content = row.children[0];
    if (content) {
      wrapper.innerHTML += content.innerHTML;
    }
    row.remove();
  });

  // Style CTA links as buttons
  wrapper.querySelectorAll('a').forEach((a) => {
    a.classList.add('aldevron-catalog-intro-cta');
  });

  block.textContent = '';
  block.append(wrapper);
}
