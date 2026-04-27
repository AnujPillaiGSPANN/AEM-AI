function buildGreeting(row) {
  const greeting = document.createElement('div');
  greeting.className = 'travel-header-greeting';

  const heading = row.querySelector('h1, h2, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent;
    greeting.append(h2);
  }

  const paragraphs = row.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const subtitle = document.createElement('p');
    subtitle.className = 'travel-header-subtitle';
    subtitle.textContent = p.textContent;
    greeting.append(subtitle);
  });

  return greeting;
}

function buildSearchBar(row) {
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'travel-header-search';

  const placeholder = row.textContent.trim() || 'Search destination...';

  const searchIcon = document.createElement('span');
  searchIcon.className = 'travel-header-search-icon';
  searchIcon.setAttribute('aria-hidden', 'true');
  searchWrapper.append(searchIcon);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.className = 'travel-header-search-input';
  input.setAttribute('aria-label', placeholder);
  searchWrapper.append(input);

  const bell = document.createElement('button');
  bell.className = 'travel-header-bell';
  bell.setAttribute('aria-label', 'Notifications');
  bell.type = 'button';
  searchWrapper.append(bell);

  return searchWrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const header = document.createElement('div');
  header.className = 'travel-header-wrapper';

  if (rows.length > 0) {
    header.append(buildGreeting(rows[0]));
  }

  if (rows.length > 1) {
    header.append(buildSearchBar(rows[1]));
  }

  block.textContent = '';
  block.append(header);
}
