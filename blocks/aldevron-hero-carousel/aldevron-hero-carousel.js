function updateActiveSlide(block, index) {
  const slides = block.querySelectorAll('.aldevron-hero-carousel-slide');
  const dots = block.querySelectorAll('.aldevron-hero-carousel-dot');

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== index);
  });
  dots.forEach((dot, i) => {
    if (i === index) dot.setAttribute('disabled', 'true');
    else dot.removeAttribute('disabled');
  });
  block.dataset.activeSlide = index;
}

function showSlide(block, index) {
  const slides = block.querySelectorAll('.aldevron-hero-carousel-slide');
  const count = slides.length;
  let target = index;
  if (target < 0) target = count - 1;
  if (target >= count) target = 0;
  updateActiveSlide(block, target);
}

export default function decorate(block) {
  const rows = [...block.children];
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('aldevron-hero-carousel-slides');

  // rows.forEach((row, idx) => {
  //   const slide = document.createElement('div');
  //   slide.classList.add('aldevron-hero-carousel-slide');
  //   slide.setAttribute('aria-hidden', idx !== 0);
  //   while (row.firstElementChild) {
  //     const cell = row.firstElementChild;
  //     if (cell.querySelector('picture')) {
  //       cell.classList.add('aldevron-hero-carousel-image');
  //     } else {
  //       cell.classList.add('aldevron-hero-carousel-content');
  //     }
  //     slide.append(cell);
  //   }
  //   slidesContainer.append(slide);
  //   row.remove();
  // });

  rows.forEach((row, idx) => {
    // 1. Give the existing row the slide class (don't create a new 'slide' div)
    row.classList.add('aldevron-hero-carousel-slide');
    row.setAttribute('aria-hidden', idx !== 0);
    
    // 2. Classify the children that are already inside the row
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.classList.add('aldevron-hero-carousel-image');
      } else {
        cell.classList.add('aldevron-hero-carousel-content');
      }
    });

    // 3. Move the row into your new container
    slidesContainer.append(row);
  });

  block.append(slidesContainer);
  block.dataset.activeSlide = 0;

  if (rows.length > 1) {
    const dotsNav = document.createElement('div');
    dotsNav.classList.add('aldevron-hero-carousel-dots');
    rows.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('aldevron-hero-carousel-dot');
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Show slide ${idx + 1}`);
      if (idx === 0) dot.setAttribute('disabled', 'true');
      dot.addEventListener('click', () => showSlide(block, idx));
      dotsNav.append(dot);
    });
    block.append(dotsNav);

    let autoplayId = setInterval(() => {
      const current = parseInt(block.dataset.activeSlide, 10);
      showSlide(block, current + 1);
    }, 5000);

    block.addEventListener('mouseenter', () => {
      clearInterval(autoplayId);
    });
    block.addEventListener('mouseleave', () => {
      autoplayId = setInterval(() => {
        const current = parseInt(block.dataset.activeSlide, 10);
        showSlide(block, current + 1);
      }, 5000);
    });
  }
}
