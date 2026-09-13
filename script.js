/* GameForge Web - v8.3.0 */
(function () {
  'use strict';

  // === Preloader ===
  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 600);
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  } else {
    hidePreloader();
  }
  window.addEventListener('load', () => setTimeout(hidePreloader, 500));
  setTimeout(hidePreloader, 3000);

  // === Tema ===
  const THEME_KEY = 'gameforge-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === 'light' ? '#f4f6fa' : '#070a10';
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  initTheme();

  try {
    window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', (e) => {
        let saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
        if (!saved) applyTheme(e.matches ? 'light' : 'dark');
      });
  } catch (e) {}

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // === Navbar Scroll ===
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function updateNavbar() {
    const y = window.scrollY;
    if (navbar) {
      if (y > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    const btt = document.getElementById('backToTop');
    if (btt) {
      if (y > 500) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // === Mobile Menu ===
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navLinks.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(e.target) || mobileMenuBtn.contains(e.target)) return;
      navLinks.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // === Back to top ===
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Smooth scroll ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // === Screenshot Tabs ===
  const tabButtons = document.querySelectorAll('.tab-btn');
  const screenshotItems = document.querySelectorAll('.screenshot-item');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
      screenshotItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.tab === tab);
      });
    });
  });

  // === Reveal on Scroll ===
  const revealEls = document.querySelectorAll(
    '.feature-card, .section-header, .download-card, .faq-item, .trust-logo'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // === Download Button ===
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const original = downloadBtn.innerHTML;
      downloadBtn.innerHTML = 'İndiriliyor...';
      setTimeout(() => { downloadBtn.innerHTML = original; }, 2500);
    });
  }

  // === iOS 100vh fix ===
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  // === Service Worker ===
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  // === Console ===
  console.log(
    '%cGameForge%c v8.3.0 — GameGameStudios',
    'color:#43d9ff;font-weight:900;font-size:16px;',
    'color:#7e8ca1;font-size:12px;'
  );
})();