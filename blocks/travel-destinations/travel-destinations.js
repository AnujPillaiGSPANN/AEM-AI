import { createOptimizedPicture } from '../../scripts/aem.js';

function buildHeader(row) {
  const header = document.createElement('div');
  header.className = 'travel-destinations-header';

  const heading = row.querySelector('h1, h2, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'travel-destinations-title';
    h2.textContent = heading.textContent;
    header.append(h2);
  }

  const paragraphs = row.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text) {
      const count = document.createElement('span');
      count.className = 'travel-destinations-count';
      count.textContent = text;
      header.append(count);
    }
  });

  const filterBtn = document.createElement('button');
  filterBtn.className = 'travel-destinations-filter-btn';
  filterBtn.type = 'button';
  filterBtn.textContent = 'Filters';
  header.append(filterBtn);

  return header;
}

function buildItem(row) {
  const item = document.createElement('div');
  item.className = 'travel-destinations-item';

  const img = row.querySelector('picture img');
  if (img) {
    const thumb = document.createElement('div');
    thumb.className = 'travel-destinations-thumb';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    thumb.append(optimized);
    item.append(thumb);
  }

  const content = document.createElement('div');
  content.className = 'travel-destinations-content';

  const texts = [];
  row.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    const text = el.textContent.trim();
    if (text) {
      texts.push(text);
    }
  });

  const [nameText, locationText, ratingText, priceText] = texts;

  if (nameText) {
    const name = document.createElement('h4');
    name.className = 'travel-destinations-name';
    name.textContent = nameText;
    content.append(name);
  }

  if (locationText) {
    const location = document.createElement('p');
    location.className = 'travel-destinations-location';
    location.textContent = locationText;
    content.append(location);
  }

  if (ratingText) {
    const rating = document.createElement('span');
    rating.className = 'travel-destinations-rating';
    rating.textContent = ratingText;
    content.append(rating);
  }

  item.append(content);

  if (priceText) {
    const price = document.createElement('span');
    price.className = 'travel-destinations-price';
    price.textContent = priceText;
    item.append(price);
  }

  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'travel-destinations-wrapper';

  if (rows.length > 0) {
    wrapper.append(buildHeader(rows[0]));
  }

  const list = document.createElement('div');
  list.className = 'travel-destinations-list';

  rows.slice(1).forEach((row) => {
    list.append(buildItem(row));
  });

  wrapper.append(list);
  block.textContent = '';
  block.append(wrapper);
}
