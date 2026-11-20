/* =========================================================
   Script Portofolio Keylovelica
   Fitur: efek ketik, scroll reveal, menu aktif, navbar,
   tutup menu di HP, hitung angka, tombol kembali ke atas
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tandai bahwa JS aktif (supaya konten tetap terlihat kalau JS mati)
  document.documentElement.classList.add('js');

  /* ---------- 1. Navbar: bayangan saat di-scroll ---------- */
  var navbar = document.querySelector('.navbar');
  function onScrollNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  /* ---------- 2. Menu HP: tutup setelah link diklik ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menuToggle) menuToggle.checked = false;
    });
  });

  /* ---------- 3. Menu aktif sesuai bagian yang sedang dilihat ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 4. Efek mengetik pada peran ---------- */
  var typedEl = document.getElementById('typed');
  var roles = ['Web Developer', 'Graphic Designer', 'UI Designer', 'Video Editor'];

  function startTyping() {
    if (!typedEl || reduceMotion) return;
    var roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      var word = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        }
        return setTimeout(tick, 90);
      }
      charIndex--;
      typedEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 350);
      }
      setTimeout(tick, 45);
    }

    typedEl.textContent = '';
    tick();
  }

  /* ---------- 5. Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .about-photo-wrap, .about-card, .skill-card, .timeline-item, .contact-box'
  );

  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    // jeda bertahap untuk elemen bersaudara
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(siblings, 5) * 90 + 'ms';
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('show');
          obs.unobserve(el);
          // hapus jeda setelah muncul supaya efek hover tidak terasa lambat
          setTimeout(function () { el.style.transitionDelay = '0ms'; }, 1200);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('show'); });
  }

  /* ---------- 6. Hitung angka pada statistik ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduceMotion) return;
    var duration = 1200, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObs.observe(c); });
  }

  /* ---------- 7. Tombol kembali ke atas ---------- */
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Kembali ke atas');
  toTop.innerHTML = '&#8593;';
  document.body.appendChild(toTop);

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  function onScrollTop() {
    toTop.classList.toggle('visible', window.scrollY > 500);
  }

  /* ---------- Gabungkan event scroll ---------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollNavbar();
      onScrollTop();
      ticking = false;
    });
  }, { passive: true });

  onScrollNavbar();
  onScrollTop();
  setActive('home');
  startTyping();
})();
