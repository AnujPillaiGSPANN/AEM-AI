import { createOptimizedPicture } from '../../scripts/aem.js';

function buildCard(row) {
  const card = document.createElement('div');
  card.className = 'travel-schedule-card';

  const img = row.querySelector('picture img');
  if (img) {
    const thumb = document.createElement('div');
    thumb.className = 'travel-schedule-thumb';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    thumb.append(optimized);
    card.append(thumb);
  }

  const content = document.createElement('div');
  content.className = 'travel-schedule-content';

  const texts = [];
  row.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    const text = el.textContent.trim();
    if (text) {
      texts.push(text);
    }
  });

  const [nameText, datesText, participantsText] = texts;

  if (nameText) {
    const name = document.createElement('h4');
    name.className = 'travel-schedule-name';
    name.textContent = nameText;
    content.append(name);
  }

  if (datesText) {
    const dates = document.createElement('p');
    dates.className = 'travel-schedule-dates';
    dates.textContent = datesText;
    content.append(dates);
  }

  if (participantsText) {
    const participants = document.createElement('span');
    participants.className = 'travel-schedule-participants';
    participants.textContent = participantsText;
    content.append(participants);
  }

  card.append(content);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'travel-schedule-wrapper';

  if (rows.length > 0) {
    const heading = rows[0].querySelector('h1, h2, h3, h4');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.className = 'travel-schedule-heading';
      h3.textContent = heading.textContent;
      wrapper.append(h3);
    }
  }

  const list = document.createElement('div');
  list.className = 'travel-schedule-list';

  rows.slice(1).forEach((row) => {
    list.append(buildCard(row));
  });

  wrapper.append(list);
  block.textContent = '';
  block.append(wrapper);
}
