/* ============================================
   GAMEFORGE - SCRIPT v2.0
   Tema sistemi + Animasyonlar + Etkileşimler
   ============================================ */

(function() {
  'use strict';

  /* ===== THEME SYSTEM ===== */
  const THEME_KEY = 'gameforge-theme';
  const ACCENT_KEY = 'gameforge-accent';

  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeDropdown = document.getElementById('themeDropdown');
  const themePicker = document.getElementById('themePicker');
  const themeOptions = document.querySelectorAll('.theme-option');

  function setTheme(theme, accent) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-accent', accent);
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(ACCENT_KEY, accent);

    // Meta theme-color güncelle
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'light' ? '#f8fafc' : '#070a10';
    }

    // Aktif seçeneği işaretle
    themeOptions.forEach(opt => {
      const isActive = opt.dataset.theme === theme && opt.dataset.accent === accent;
      opt.classList.toggle('active', isActive);
    });
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    const savedAccent = localStorage.getItem(ACCENT_KEY) || 'blue';
    setTheme(savedTheme, savedAccent);
  }

  // Tema seçici toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });
  }

  // Tema seçenekleri
  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      setTheme(opt.dataset.theme, opt.dataset.accent);
      themeDropdown.classList.remove('open');
    });
  });

  // Dışarı tıklayınca kapat
  document.addEventListener('click', (e) => {
    if (themePicker && !themePicker.contains(e.target)) {
      themeDropdown.classList.remove('open');
    }
  });

  // İlk yükleme
  loadTheme();

  /* ===== PRELOADER ===== */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1500);
  });

  // Güvenlik: 4 saniye sonra zorla kapat
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 4000);

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (currentScroll > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ===== MOBILE MENU ===== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Link tıklanınca menüyü kapat
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ===== SCREENSHOT TABS ===== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const screenshotItems = document.querySelectorAll('.screenshot-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      screenshotItems.forEach(item => item.classList.remove('active'));

      btn.classList.add('active');
      const target = document.querySelector(`.screenshot-item[data-tab="${tab}"]`);
      if (target) target.classList.add('active');
    });
  });

  /* ===== BACK TO TOP ===== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== SMOOTH SCROLL (fallback) ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== HERO PARTICLES ===== */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: var(--accent);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.1};
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
      `;
      particlesContainer.appendChild(particle);
    }

    // Particle animasyonu için style ekle
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ===== SCROLL REVEAL ===== */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .req-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  /* ===== KLAVYE KISAYOLLARI ===== */
  document.addEventListener('keydown', (e) => {
    // ESC ile menüleri kapat
    if (e.key === 'Escape') {
      themeDropdown?.classList.remove('open');
      mobileMenuBtn?.classList.remove('open');
      navLinks?.classList.remove('open');
    }
  });

})();
