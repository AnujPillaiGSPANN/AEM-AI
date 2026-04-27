function buildProfile(row) {
  const profile = document.createElement('div');
  profile.className = 'travel-calendar-profile';

  const img = row.querySelector('picture img');
  if (img) {
    const avatar = document.createElement('div');
    avatar.className = 'travel-calendar-avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = img.src;
    avatarImg.alt = img.alt || 'Profile';
    avatarImg.loading = 'lazy';
    avatar.append(avatarImg);
    profile.append(avatar);
  }

  const info = document.createElement('div');
  info.className = 'travel-calendar-profile-info';

  const texts = [];
  row.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    const text = el.textContent.trim();
    if (text) {
      texts.push(text);
    }
  });

  const [nameText, roleText] = texts;

  if (nameText) {
    const name = document.createElement('h4');
    name.className = 'travel-calendar-name';
    name.textContent = nameText;
    info.append(name);
  }

  if (roleText) {
    const role = document.createElement('p');
    role.className = 'travel-calendar-role';
    role.textContent = roleText;
    info.append(role);
  }

  profile.append(info);
  return profile;
}

function buildCalendar(row) {
  const calendar = document.createElement('div');
  calendar.className = 'travel-calendar-grid';

  const existing = row.querySelector('table, .calendar');
  if (existing) {
    calendar.innerHTML = existing.outerHTML;
    return calendar;
  }

  const heading = row.querySelector('h2, h3, h4, p');
  if (heading) {
    const monthHeader = document.createElement('div');
    monthHeader.className = 'travel-calendar-month';
    monthHeader.textContent = heading.textContent.trim();
    calendar.append(monthHeader);
  }

  const content = row.querySelector('div:last-child');
  if (content) {
    const gridContent = document.createElement('div');
    gridContent.className = 'travel-calendar-cells';
    gridContent.innerHTML = content.innerHTML;
    calendar.append(gridContent);
  }

  return calendar;
}

export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'travel-calendar-wrapper';

  if (rows.length > 0) {
    wrapper.append(buildProfile(rows[0]));
  }

  if (rows.length > 1) {
    wrapper.append(buildCalendar(rows[1]));
  }

  block.textContent = '';
  block.append(wrapper);
}
