function buildNavItem(row, index) {
  const li = document.createElement('li');
  li.className = 'travel-sidebar-nav-item';

  const link = row.querySelector('a');
  const icon = row.querySelector('picture');
  const texts = row.querySelectorAll('p, h2, h3, h4');

  const anchor = document.createElement('a');
  anchor.href = link ? link.href : '#';

  if (icon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'travel-sidebar-icon';
    iconWrap.append(icon.cloneNode(true));
    anchor.append(iconWrap);
  }

  let label = '';
  texts.forEach((t) => {
    const text = t.textContent.trim();
    if (text && text !== link?.textContent.trim()) {
      label = text;
    }
  });

  if (!label && link) {
    label = link.textContent.trim();
  }

  const labelSpan = document.createElement('span');
  labelSpan.className = 'travel-sidebar-label';
  labelSpan.textContent = label;
  anchor.append(labelSpan);

  if (index === 0) {
    li.classList.add('active');
  }

  if (label.toLowerCase().includes('log out')) {
    li.classList.add('travel-sidebar-logout');
  }

  li.append(anchor);
  return li;
}

function buildPromoCard(row) {
  const card = document.createElement('div');
  card.className = 'travel-sidebar-promo';

  const children = [...row.children];
  children.forEach((child) => {
    card.append(child.cloneNode(true));
  });

  return card;
}

function isPromoRow(row) {
  const text = row.textContent.toLowerCase();
  return text.includes('discount') || text.includes('off') || text.includes('promo') || text.includes('%');
}

export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'travel-sidebar-wrapper';

  if (rows.length > 0) {
    const logoRow = rows[0];
    const logo = document.createElement('div');
    logo.className = 'travel-sidebar-logo';
    const img = logoRow.querySelector('picture');
    if (img) {
      logo.append(img.cloneNode(true));
    }
    const logoText = logoRow.querySelector('h1, h2, h3, p');
    if (logoText) {
      const title = document.createElement('span');
      title.className = 'travel-sidebar-title';
      title.textContent = logoText.textContent.trim();
      logo.append(title);
    }
    wrapper.append(logo);
  }

  const nav = document.createElement('nav');
  nav.className = 'travel-sidebar-nav';
  const ul = document.createElement('ul');

  const navRows = rows.slice(1);
  let promoRow = null;
  const logoutIndex = navRows.findIndex((r) => r.textContent.toLowerCase().includes('log out'));

  if (logoutIndex > 0) {
    const candidate = navRows[logoutIndex - 1];
    if (isPromoRow(candidate)) {
      promoRow = candidate;
    }
  }

  let navIndex = 0;
  navRows.forEach((row) => {
    if (row === promoRow) return;
    const li = buildNavItem(row, navIndex);
    ul.append(li);
    navIndex += 1;
  });

  nav.append(ul);
  wrapper.append(nav);

  if (promoRow) {
    wrapper.append(buildPromoCard(promoRow));
  }

  block.textContent = '';
  block.append(wrapper);
}
