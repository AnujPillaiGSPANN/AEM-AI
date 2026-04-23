export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-about-wrapper';

  rows.forEach((row) => {
    const cols = [...row.children];
    const content = cols[0];

    if (content) {
      const section = document.createElement('div');
      section.className = 'aldevron-about-content';
      section.innerHTML = content.innerHTML;

      // Style CTA links as buttons
      section.querySelectorAll('p > strong > a, p > a:only-child').forEach((a) => {
        a.classList.add('aldevron-about-cta');
      });

      wrapper.append(section);
    }

    row.remove();
  });

  block.textContent = '';
  block.append(wrapper);
}
