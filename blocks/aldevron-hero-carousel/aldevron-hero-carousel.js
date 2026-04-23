export default function decorate(block) {
  const slides = [...block.children];
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  // Build carousel structure
  const carousel = document.createElement('div');
  carousel.className = 'aldevron-hero-carousel-slides';

  slides.forEach((row, index) => {
    const slide = document.createElement('div');
    slide.className = 'aldevron-hero-carousel-slide';
    if (index === 0) slide.classList.add('active');

    const cols = [...row.children];
    const imageSrc = cols[0]?.querySelector('picture');
    const content = cols[1];

    // Background image
    if (imageSrc) {
      const bgWrapper = document.createElement('div');
      bgWrapper.className = 'aldevron-hero-carousel-bg';
      bgWrapper.append(imageSrc);
      slide.append(bgWrapper);
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'aldevron-hero-carousel-overlay';

    // Content
    if (content) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'aldevron-hero-carousel-content';
      contentDiv.innerHTML = content.innerHTML;

      // Style CTA links as buttons
      contentDiv.querySelectorAll('a').forEach((a) => {
        a.classList.add('aldevron-hero-carousel-cta');
      });

      overlay.append(contentDiv);
    }

    slide.append(overlay);
    carousel.append(slide);
    row.remove();
  });

  // Dot navigation
  const dots = document.createElement('div');
  dots.className = 'aldevron-hero-carousel-dots';
  for (let i = 0; i < totalSlides; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'aldevron-hero-carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dots.append(dot);
  }

  block.textContent = '';
  block.append(carousel);
  block.append(dots);

  let currentSlide = 0;
  let autoPlayTimer;

  const goToSlide = (index) => {
    const allSlides = block.querySelectorAll('.aldevron-hero-carousel-slide');
    const allDots = block.querySelectorAll('.aldevron-hero-carousel-dot');
    allSlides.forEach((s) => s.classList.remove('active'));
    allDots.forEach((d) => d.classList.remove('active'));
    allSlides[index]?.classList.add('active');
    allDots[index]?.classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % totalSlides);
  };

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  // Wire up dot click handlers now that goToSlide is defined
  block.querySelectorAll('.aldevron-hero-carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  block.addEventListener('click', resetAutoPlay);
  startAutoPlay();
}
