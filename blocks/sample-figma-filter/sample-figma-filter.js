import { createOptimizedPicture } from '../../scripts/aem.js';

function buildFilterSection(cell) {
  const section = document.createElement('div');
  section.classList.add('sample-figma-filter-section');

  const heading = cell.querySelector('h3, h4, strong');
  if (heading) {
    const title = document.createElement('h4');
    title.classList.add('sample-figma-filter-title');
    title.textContent = heading.textContent;
    section.append(title);
  }

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search');
  searchInput.classList.add('sample-figma-filter-search');
  section.append(searchInput);

  const optionsList = document.createElement('ul');
  optionsList.classList.add('sample-figma-filter-options');

  const items = cell.querySelectorAll('li, p');
  items.forEach((item) => {
    const text = item.textContent.trim();
    if (!text || text === heading?.textContent) return;

    const li = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('sample-figma-filter-checkbox');
    label.append(checkbox);
    label.append(document.createTextNode(` ${text}`));
    li.append(label);
    optionsList.append(li);
  });

  section.append(optionsList);

  const showMore = document.createElement('button');
  showMore.setAttribute('type', 'button');
  showMore.classList.add('sample-figma-filter-show-more');
  showMore.textContent = 'Show more';
  section.append(showMore);

  return section;
}

function buildCard(row) {
  const card = document.createElement('div');
  card.classList.add('sample-figma-filter-card');

  const cells = [...row.children];

  if (cells[0]) {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('sample-figma-filter-card-image');
    const pic = cells[0].querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
        imgDiv.append(optimized);
      }
    }
    card.append(imgDiv);
  }

  if (cells[1]) {
    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('sample-figma-filter-card-body');
    while (cells[1].firstChild) bodyDiv.append(cells[1].firstChild);

    const links = bodyDiv.querySelectorAll('a');
    if (links.length > 0) {
      links[links.length - 1].classList.add('sample-figma-filter-readmore');
    }

    card.append(bodyDiv);
  }

  return card;
}

export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: Title row ("Stories" heading + count)
  const titleRow = rows.shift();
  const titleSection = document.createElement('div');
  titleSection.classList.add('sample-figma-filter-heading');
  if (titleRow) {
    while (titleRow.firstElementChild) {
      const cell = titleRow.firstElementChild;
      while (cell.firstChild) titleSection.append(cell.firstChild);
      cell.remove();
    }
    titleRow.remove();
  }
  block.prepend(titleSection);

  // Row 1: Filters sidebar content
  const filterRow = rows.shift();
  const sidebar = document.createElement('aside');
  sidebar.classList.add('sample-figma-filter-sidebar');

  const sidebarHeader = document.createElement('div');
  sidebarHeader.classList.add('sample-figma-filter-sidebar-header');
  sidebarHeader.innerHTML = '<h3>Filters</h3>';

  const collapseBtn = document.createElement('button');
  collapseBtn.setAttribute('type', 'button');
  collapseBtn.classList.add('sample-figma-filter-collapse');
  collapseBtn.textContent = 'Collapse All';
  sidebarHeader.append(collapseBtn);
  sidebar.append(sidebarHeader);

  if (filterRow) {
    const cells = [...filterRow.children];
    cells.forEach((cell) => {
      const filterSection = buildFilterSection(cell);
      sidebar.append(filterSection);
    });
    filterRow.remove();
  }

  // Remaining rows: article cards
  const mainContent = document.createElement('div');
  mainContent.classList.add('sample-figma-filter-main');

  const countDiv = document.createElement('div');
  countDiv.classList.add('sample-figma-filter-count');
  countDiv.textContent = `${rows.length} Stories Available`;
  mainContent.append(countDiv);

  const grid = document.createElement('div');
  grid.classList.add('sample-figma-filter-grid');

  rows.forEach((row) => {
    const card = buildCard(row);
    grid.append(card);
    row.remove();
  });

  mainContent.append(grid);

  // Layout container
  const layout = document.createElement('div');
  layout.classList.add('sample-figma-filter-layout');
  layout.append(sidebar);
  layout.append(mainContent);
  block.append(layout);
}
