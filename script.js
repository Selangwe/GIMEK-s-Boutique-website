/* ═══════════════════════════════════════════════════════════
   GIMEK'S BOUTIQUE - interactions
   Vanilla, no dependencies. Everything degrades gracefully.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 0. Overlay helper ───────────────────────────────────
     A full-screen overlay has to take the page out of the tab
     order behind it, otherwise Tab walks straight off the
     dialog and into content the visitor cannot see. `inert`
     does that in one attribute and is ignored by browsers
     that do not support it, which only get the old behaviour.
     `keep` is the list that stays reachable; every other
     top-level region is frozen until thaw(). */
  function freeze(keep) {
    var all = document.querySelectorAll('a.skip, header.nav, main, footer, .bar, .menu, .lb');
    Array.prototype.forEach.call(all, function (el) {
      if (keep.indexOf(el) === -1) { el.inert = true; }
      else { el.inert = false; }
    });
  }
  function thaw() {
    var all = document.querySelectorAll('a.skip, header.nav, main, footer, .bar, .menu, .lb');
    Array.prototype.forEach.call(all, function (el) { el.inert = false; });
  }

  /* ── 1. Image slots ──────────────────────────────────────
     Photos live in /assets. Until a real file is dropped in,
     the CSS placeholder behind each frame carries the design.
     A gallery tile with no photo yet is also disabled, so the
     lightbox never opens on an empty placeholder. */
  function initSlots() {
    var slots = document.querySelectorAll('img[data-slot]');
    Array.prototype.forEach.call(slots, function (img, i) {
      if (i > 1) {
        img.loading = 'lazy';
      }
      img.decoding = 'async';

      var tile = img.closest('.tile');

      var miss = function () {
        img.setAttribute('data-missing', '');
        if (tile) tile.disabled = true;
      };
      var hit = function () {
        img.removeAttribute('data-missing');
        if (tile) tile.disabled = false;
      };

      img.addEventListener('error', miss);
      img.addEventListener('load', hit);

      // Images may have already failed before this script ran.
      if (img.complete) { (img.naturalWidth === 0 ? miss : hit)(); }
      else if (tile) { tile.disabled = true; }   // optimistic default
    });

    /* The hero's small frame is a short muted loop. Same rule as
       the photos: if the file is missing the placeholder shows.
       Under prefers-reduced-motion it holds on its first frame. */
    var vids = document.querySelectorAll('video[data-slot]');
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(vids, function (v) {
      v.addEventListener('error', function () { v.setAttribute('data-missing', ''); });
      if (still) { v.removeAttribute('autoplay'); v.pause(); }
    });
  }

  /* ── 2. Theme ────────────────────────────────────────────
     Dark is the brand and therefore the default for every
     visitor, whatever their OS says. Light is an opt-in the
     toggle remembers. The pre-paint script in <head> applies
     the stored choice; this only wires the button. */
  var THEME_KEY = 'gimek-theme';

  function initTheme() {
    var btn = document.getElementById('theme');
    if (!btn) return;

    var meta = document.querySelector('meta[name="theme-color"]');
    var root = document.documentElement;

    function paint() {
      var light = root.getAttribute('data-theme') === 'light';
      btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      // These two must stay equal to --bg in each theme in styles.css.
      if (meta) meta.setAttribute('content', light ? '#FBF8F6' : '#141011');
    }

    btn.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') === 'light';
      if (light) { root.removeAttribute('data-theme'); }
      else { root.setAttribute('data-theme', 'light'); }
      try { localStorage.setItem(THEME_KEY, light ? 'dark' : 'light'); } catch (e) {}
      paint();
    });

    paint();
  }

  /* ── 3. Sticky nav ───────────────────────────────────────
     Watches a 40px sentinel at the top of the document rather
     than listening to scroll, so nothing runs per frame. */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var sentinel = document.querySelector('.nav-sentinel');
    if (!sentinel || !('IntersectionObserver' in window)) {
      nav.classList.add('is-stuck');   // legible fallback
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 });

    io.observe(sentinel);
  }

  /* ── 4. Scroll progress ──────────────────────────────────
     Chrome and Edge drive the bar entirely in CSS with a
     native scroll timeline. Everywhere else we fall back to a
     passive listener that only ever writes one custom property
     inside a rAF, so there is still no layout work per frame. */
  function initProgress() {
    var bar = document.getElementById('progress');
    if (!bar || reduced) return;

    var native = window.CSS && CSS.supports &&
      CSS.supports('animation-timeline', 'scroll()');
    if (native) return;

    var ticking = false;

    function write() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(write); }
    }, { passive: true });

    window.addEventListener('resize', write, { passive: true });
    write();
  }

  /* ── 5. Mobile menu ────────────────────────────────────── */
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
      // The nav bar stays above the overlay and stays usable; the
      // page underneath must not.
      freeze([document.querySelector('header.nav'), menu]);
    }
    function close() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      thaw();
      window.setTimeout(function () {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, reduced ? 0 : 450);
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

  /* ── 6. Gallery lightbox ─────────────────────────────────
     Only tiles whose photo actually loaded are enabled, so this
     never opens onto a placeholder. Arrow keys and the on-screen
     buttons step through the set; Escape closes and focus goes
     back to the tile the visitor came from. */
  function initLightbox() {
    var lb = document.getElementById('lb');
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile[data-lb]'));
    if (!lb || !lbImg || !tiles.length) return;

    var btnPrev = document.getElementById('lb-prev');
    var btnNext = document.getElementById('lb-next');
    var btnClose = document.getElementById('lb-close');
    var index = 0;
    var lastFocus = null;

    function live() {
      // Only the tiles with a real photo behind them.
      return tiles.filter(function (t) { return !t.disabled; });
    }

    function show(list, i) {
      var n = list.length;
      if (!n) return;
      index = (i + n) % n;
      var img = list[index].querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCap.textContent = img.alt || '';
      var many = n > 1;
      btnPrev.hidden = !many;
      btnNext.hidden = !many;
    }

    function open(tile) {
      var list = live();
      var i = list.indexOf(tile);
      if (i < 0) return;

      lastFocus = tile;
      show(list, i);
      lb.hidden = false;
      void lb.offsetWidth;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      freeze([lb]);
      btnClose.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      thaw();
      window.setTimeout(function () {
        if (!lb.classList.contains('is-open')) {
          lb.hidden = true;
          lbImg.removeAttribute('src');
        }
      }, reduced ? 0 : 400);
      if (lastFocus) lastFocus.focus();
    }

    function step(delta) { show(live(), index + delta); }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () { open(tile); });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });

    // Clicking the backdrop, but not the photo or the controls.
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'Tab') {
        /* Keep focus inside the dialog. The list has to be in DOM
           order — prev, next, close — because that is the order Tab
           actually follows. Listing close first (it is the button we
           focus on open) put the wrap-around on the wrong end, and
           Tab from the close button walked out of the dialog and on
           into the page behind it. */
        var focusable = [btnPrev, btnNext, btnClose].filter(function (b) { return !b.hidden; });
        if (!focusable.length) { e.preventDefault(); return; }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (focusable.indexOf(document.activeElement) === -1) {
          e.preventDefault(); (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ── 7. Scroll reveals ─────────────────────────────────── */
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

  /* ── 8. Active section in nav ──────────────────────────── */
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

  /* ── 9. Opening status ───────────────────────────────────
     Mon-Sat 08:00-22:00, closed Sunday. Read on the boutique's
     own clock (West Africa Time, UTC+1, no daylight saving) so a
     visitor abroad still sees whether the door is actually open. */
  var OPENS = 8 * 60;
  var CLOSES = 22 * 60;

  function statusLabel(watNow) {
    var day = watNow.getDay();                                  // 0 = Sunday
    var mins = watNow.getHours() * 60 + watNow.getMinutes();
    var isOpen = day !== 0 && mins >= OPENS && mins < CLOSES;

    if (isOpen) return { open: true, text: 'Open now. Closes 10 PM' };
    if (day === 0 || (day === 6 && mins >= CLOSES)) {
      return { open: false, text: 'Closed. Opens Monday 8 AM' };
    }
    return { open: false, text: 'Closed. Opens 8 AM' };
  }

  function initStatus() {
    var els = document.querySelectorAll('[data-status]');
    if (!els.length) return;

    function paint() {
      var now = new Date();
      var wat = new Date(now.getTime() + (now.getTimezoneOffset() + 60) * 60000);
      var state = statusLabel(wat);

      Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('is-idle');       // the markup's neutral state
        el.classList.toggle('is-closed', !state.open);
        var dot = el.querySelector('i');
        el.textContent = state.text;            // clears the old label
        if (dot) el.insertBefore(dot, el.firstChild);
      });
    }

    paint();
    // A page left open should not keep claiming the shop is open.
    window.setInterval(paint, 60000);
  }

  /* ── 10. Map facade ──────────────────────────────────────
     The Google embed costs about 1.5 MB across 16 requests and was
     the slowest thing on the page by a wide margin. The markup ships
     a button instead; the real iframe is built here on the first
     tap. Get Directions and Call already do the job without it, so
     nobody who never presses this loses anything. */
  function initMap() {
    var btn = document.getElementById('map-load');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-map');
      if (!src) return;
      var frame = document.createElement('iframe');
      frame.src = src;
      frame.title = btn.getAttribute('data-title') || 'Map';
      frame.loading = 'eager';                 // it was just asked for
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      btn.replaceWith(frame);
      // The frame is what the visitor just asked to see, so send focus
      // there rather than leaving it on a button that no longer exists.
      frame.setAttribute('tabindex', '-1');
      frame.focus({ preventScroll: true });
    }, { once: true });
  }

  /* ── 11. Footer year ───────────────────────────────────── */
  function initYear() {
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  initSlots();
  initTheme();
  initNav();
  initProgress();
  initMenu();
  initLightbox();
  initReveal();
  initSpy();
  initStatus();
  initMap();
  initYear();
})();
