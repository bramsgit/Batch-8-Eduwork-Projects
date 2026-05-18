/* ============================================================
   MARIA BRAMASTRI — PORTFOLIO JS
   Handles: Carousel, Mobile Nav, Scroll-to-top, Email Modal
   ============================================================ */

'use strict';

/* ── UTILITIES ──────────────────────────────────────────────── */

/**
 * Query a single element; throws if not found.
 * @param {string} selector
 * @param {Document|Element} [ctx=document]
 * @returns {Element}
 */
function qs(selector, ctx = document) {
  const el = ctx.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

/**
 * Query all elements matching a selector.
 * @param {string} selector
 * @param {Document|Element} [ctx=document]
 * @returns {NodeList}
 */
function qsa(selector, ctx = document) {
  return ctx.querySelectorAll(selector);
}


/* ── MOBILE NAVIGATION ──────────────────────────────────────── */

function initMobileNav() {
  const toggle = qs('.nav-toggle');
  const nav    = qs('.primary-nav');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  qsa('.primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── PROJECT CAROUSEL ───────────────────────────────────────── */

function initCarousel() {
  const track      = qs('.carousel__track');
  const slides     = Array.from(qsa('.carousel__slide'));
  const dots       = Array.from(qsa('.carousel__dot'));
  const btnPrev    = qs('.carousel__btn--prev');
  const btnNext    = qs('.carousel__btn--next');

  let currentIndex = 0;
  let autoTimer    = null;
  const AUTO_DELAY = 5000; // ms

  /**
   * Move carousel to a given slide index.
   * @param {number} index
   */
  function goTo(index) {
    // Clamp with wrap-around
    const total = slides.length;
    const next  = ((index % total) + total) % total;

    // Slide track
    track.style.transform = `translateX(-${next * 100}%)`;

    // Update aria attributes
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== next));
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === next);
      dot.setAttribute('aria-current', String(i === next));
    });

    currentIndex = next;
  }

  // Button handlers
  btnPrev.addEventListener('click', () => {
    goTo(currentIndex - 1);
    resetAutoplay();
  });

  btnNext.addEventListener('click', () => {
    goTo(currentIndex + 1);
    resetAutoplay();
  });

  // Dot handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      goTo(idx);
      resetAutoplay();
    });
  });

  // Keyboard navigation on the carousel region
  track.closest('.carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(currentIndex - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(currentIndex + 1); resetAutoplay(); }
  });

  // Touch / swipe support
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) < 40) return; // ignore tiny swipes
    if (delta < 0) goTo(currentIndex + 1);
    else           goTo(currentIndex - 1);
    resetAutoplay();
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    autoTimer = setInterval(() => goTo(currentIndex + 1), AUTO_DELAY);
  }

  function resetAutoplay() {
    clearInterval(autoTimer);
    startAutoplay();
  }

  // Pause autoplay on hover / focus
  const carouselEl = track.closest('.carousel');
  carouselEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carouselEl.addEventListener('mouseleave', startAutoplay);
  carouselEl.addEventListener('focusin',   () => clearInterval(autoTimer));
  carouselEl.addEventListener('focusout',  startAutoplay);

  // Init
  goTo(0);
  startAutoplay();
}


/* ── SCROLL TO TOP ──────────────────────────────────────────── */

function initScrollToTop() {
  const btn = qs('#scroll-top');

  // Show/hide based on scroll position
  const SHOW_THRESHOLD = 400; // px

  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > SHOW_THRESHOLD;
    btn.classList.toggle('is-visible', shouldShow);
    // Use hidden attribute for accessibility
    btn.hidden = !shouldShow;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ── EMAIL MODAL ────────────────────────────────────────────── */

function initEmailModal() {
  const overlay     = qs('#email-modal');
  const openBtn     = qs('#open-email-modal');
  const closeBtn    = qs('#close-email-modal');
  const sendBtn     = qs('#send-email-btn');
  const feedback    = qs('#form-feedback');

  // YOUR email address — change this before deploying
  const RECIPIENT_EMAIL = 'your@email.com';

  function openModal() {
    overlay.hidden = false;
    // Return focus to close button
    closeBtn.focus();
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    openBtn.focus();
    feedback.textContent = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // Send via mailto (no backend required)
  sendBtn.addEventListener('click', () => {
    const senderEmail = qs('#sender-email').value.trim();
    const subject     = qs('#message-subject').value.trim();
    const message     = qs('#message-body').value.trim();

    // Basic validation
    if (!senderEmail || !message) {
      feedback.textContent = '⚠ PLEASE FILL IN YOUR EMAIL AND MESSAGE.';
      feedback.style.color = '#c0392b';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      feedback.textContent = '⚠ PLEASE ENTER A VALID EMAIL ADDRESS.';
      feedback.style.color = '#c0392b';
      return;
    }

    // Compose mailto link
    const mailtoSubject = encodeURIComponent(subject || 'PORTFOLIO CONTACT');
    const mailtoBody    = encodeURIComponent(
      `FROM: ${senderEmail}\n\n${message}`
    );
    const mailtoHref    = `mailto:${RECIPIENT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open default mail client
    window.location.href = mailtoHref;

    feedback.textContent = '✓ YOUR EMAIL CLIENT IS OPENING...';
    feedback.style.color = '#155724';

    // Close modal after short delay
    setTimeout(closeModal, 1800);
  });
}


/* ── FOOTER YEAR ────────────────────────────────────────────── */

function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ── INIT ALL ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCarousel();
  initScrollToTop();
  initEmailModal();
  initFooterYear();
});