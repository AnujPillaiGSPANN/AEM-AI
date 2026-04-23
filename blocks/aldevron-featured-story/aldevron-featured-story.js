export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-featured-story-wrapper';

  rows.forEach((row) => {
    const cols = [...row.children];
    const content = cols[0];

    if (content) {
      const section = document.createElement('div');
      section.className = 'aldevron-featured-story-section';
      section.innerHTML = content.innerHTML;

      // Style emphasis items as bullet highlights
      section.querySelectorAll('em').forEach((em) => {
        em.closest('li')?.classList.add('aldevron-featured-story-highlight');
      });

      // Style CTA links as buttons
      section.querySelectorAll('p > strong > a, p > a:only-child').forEach((a) => {
        a.classList.add('aldevron-featured-story-cta');
      });

      wrapper.append(section);
    }

    row.remove();
  });

  block.textContent = '';
  block.append(wrapper);
}
