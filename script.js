/* ═══════════════════════════════════════════════════════════
   GIMEK'S BOUTIQUE — interactions
   Vanilla, no dependencies. Everything degrades gracefully.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Image slots ──────────────────────────────────────
     Photos live in /assets. Until a real file is dropped in,
     the CSS placeholder behind each frame carries the design. */
  function initSlots() {
    var slots = document.querySelectorAll('img[data-slot]');
    Array.prototype.forEach.call(slots, function (img, i) {
      if (i > 1) {
        img.loading = 'lazy';
      }
      img.decoding = 'async';

      var miss = function () { img.setAttribute('data-missing', ''); };
      var hit = function () { img.removeAttribute('data-missing'); };

      img.addEventListener('error', miss);
      img.addEventListener('load', hit);

      // Images may have already failed before this script ran.
      if (img.complete) { (img.naturalWidth === 0 ? miss : hit)(); }
    });
  }

  /* ── 2. Sticky nav ─────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(function () {
        nav.classList.toggle('is-stuck', window.scrollY > 40);
        tick = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. Mobile menu ────────────────────────────────────── */
  function initMenu() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (!burger || !menu) return;

    function open() {
      menu.hidden = false;
      void menu.offsetWidth;              // force reflow so the fade runs
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, reduced ? 0 : 400);
    }

    burger.addEventListener('click', function () {
      burger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        close();
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && burger.getAttribute('aria-expanded') === 'true') close();
    });
  }

  /* ── 4. Scroll reveals ─────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ── 5. Active section in nav ──────────────────────────── */
  function initSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (!links.length) return;

    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = a;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = map[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(links, function (l) { l.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ── 6. Footer year ────────────────────────────────────── */
  function initYear() {
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  initSlots();
  initNav();
  initMenu();
  initReveal();
  initSpy();
  initYear();
})();
