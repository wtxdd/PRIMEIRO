// ===== CARROSSEL DE FOTOS (linhas de produto na home) =====
document.addEventListener('DOMContentLoaded', function () {
  var carousels = document.querySelectorAll('.carousel');

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var total = slides.length;
    var current = 0;
    var autoplayDelay = parseInt(carousel.dataset.autoplay, 10) || 4000;
    var timer = null;

    if (total === 0) return;

    // Cria os pontinhos (dots) dinamicamente
    slides.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para foto ' + (index + 1));
      dot.addEventListener('click', function () {
        goTo(index);
        resetAutoplay();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.carousel-dot'));

    function update() {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, index) {
        dot.classList.toggle('active', index === current);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      timer = setInterval(next, autoplayDelay);
    }

    function resetAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        next();
        resetAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prev();
        resetAutoplay();
      });
    }

    // Swipe (arrastar) no touch/mobile
    var startX = 0;
    var isDragging = false;

    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) { next(); } else { prev(); }
        resetAutoplay();
      }
    });

    // Pausa o autoplay quando o mouse está sobre o carrossel (desktop)
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', function () { startAutoplay(); });

    update();
    startAutoplay();
  });
});
