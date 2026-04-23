export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aldevron-recent-posts-wrapper';

  // Build two columns: news and blog
  const newsCol = document.createElement('div');
  newsCol.className = 'aldevron-recent-posts-column';

  const blogCol = document.createElement('div');
  blogCol.className = 'aldevron-recent-posts-column';

  let currentColumn = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    const content = cols[0];

    if (content) {
      const heading = content.querySelector('h2');

      if (heading) {
        // This is a column header row
        const header = document.createElement('div');
        header.className = 'aldevron-recent-posts-header';
        header.append(heading);

        if (!newsCol.querySelector('.aldevron-recent-posts-header')) {
          newsCol.append(header);
          currentColumn = newsCol;
        } else {
          blogCol.append(header);
          currentColumn = blogCol;
        }
      } else if (currentColumn) {
        // This is a card row
        const card = document.createElement('div');
        card.className = 'aldevron-recent-posts-card';

        const imageCol = cols[0];
        const textCol = cols[1] || cols[0];

        if (cols[1]) {
          // Two columns: image + text
          const imageWrapper = document.createElement('div');
          imageWrapper.className = 'aldevron-recent-posts-card-image';
          const pic = imageCol.querySelector('picture');
          if (pic) imageWrapper.append(pic);
          card.append(imageWrapper);

          const contentDiv = document.createElement('div');
          contentDiv.className = 'aldevron-recent-posts-card-content';
          contentDiv.innerHTML = textCol.innerHTML;
          card.append(contentDiv);
        } else {
          // Single column with mixed content
          const contentDiv = document.createElement('div');
          contentDiv.className = 'aldevron-recent-posts-card-content';
          contentDiv.innerHTML = content.innerHTML;
          card.append(contentDiv);
        }

        currentColumn.append(card);
      }
    }

    row.remove();
  });

  wrapper.append(newsCol);
  wrapper.append(blogCol);

  block.textContent = '';
  block.append(wrapper);
}
