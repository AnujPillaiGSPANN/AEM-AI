export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Row 0: background image
  const imageRow = rows[0];
  const picture = imageRow.querySelector('picture');
  if (picture) {
    picture.classList.add('hero-banner-bg');
    block.prepend(picture);
  }
  imageRow.remove();

  // Collect remaining rows
  const contentRow = rows[1];
  const mediaRow = rows[2];

  // Build text content from row 1
  const textCol = document.createElement('div');
  textCol.classList.add('hero-banner-text');
  if (contentRow) {
    while (contentRow.firstElementChild) {
      const cell = contentRow.firstElementChild;
      while (cell.firstChild) textCol.append(cell.firstChild);
      cell.remove();
    }
    contentRow.remove();
  }

  // Check row 2 for optional foreground media (image or video)
  let mediaCol = null;
  if (mediaRow) {
    const vid = mediaRow.querySelector('a[href*=".mp4"], a[href*=".webm"], video');
    const pic = mediaRow.querySelector('picture');

    if (vid || pic) {
      mediaCol = document.createElement('div');
      mediaCol.classList.add('hero-banner-media');

      if (vid && vid.tagName === 'A') {
        // Convert link to <video>
        const video = document.createElement('video');
        video.src = vid.href;
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        mediaCol.append(video);
      } else if (vid) {
        mediaCol.append(vid);
      } else {
        mediaCol.append(pic);
      }

      block.classList.add('hero-banner-with-media');
    }
    mediaRow.remove();
  }

  // Remove any leftover rows
  rows.slice(3).forEach((row) => row.remove());

  // Assemble overlay
  const overlay = document.createElement('div');
  overlay.classList.add('hero-banner-content');
  overlay.append(textCol);
  if (mediaCol) overlay.append(mediaCol);

  block.append(overlay);
}
