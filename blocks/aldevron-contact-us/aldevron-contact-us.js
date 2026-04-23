export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-contact-us-wrapper';

  rows.forEach((row) => {
    const cols = [...row.children];
    const content = cols[0];

    if (content) {
      const section = document.createElement('div');
      section.className = 'aldevron-contact-us-content';
      section.innerHTML = content.innerHTML;

      // Style phone number links
      section.querySelectorAll('a[href^="tel:"]').forEach((a) => {
        a.classList.add('aldevron-contact-us-phone');
      });

      // Style CTA links as buttons (exclude phone links)
      section.querySelectorAll('p > strong > a, p > a:only-child').forEach((a) => {
        if (!a.classList.contains('aldevron-contact-us-phone')) {
          a.classList.add('aldevron-contact-us-cta');
        }
      });

      wrapper.append(section);
    }

    row.remove();
  });

  block.textContent = '';
  block.append(wrapper);
}
