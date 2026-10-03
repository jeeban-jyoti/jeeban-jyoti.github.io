/* Jeeban Jyoti Patra — portfolio. Plain JS, no build step. */
(function () {
  'use strict';
  var MOTION = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
  var THEME_KEY = 'jjp-portfolio-theme';
  var root = document.documentElement;

  // Theme: saved choice → OS preference → light
  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  root.dataset.theme = saved || (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });

    // Scroll engine
    var raf = 0, rafAt = 0;
    function onScroll() {
      var now = performance.now();
      if (raf && now - rafAt < 100) return;
      rafAt = now;
      raf = requestAnimationFrame(function () { raf = 0; tick(); });
    }
    function tick() {
        const vh = innerHeight, k = MOTION;
        const c = v => Math.max(0, Math.min(1, v));
        const ease = t => 1 - Math.pow(1 - t, 3);
        const $ = s => document.querySelectorAll(s);
    
        $('[data-reveal]').forEach(el => {
          const r = el.getBoundingClientRect(), o = el._o || 0;
          const top = r.top - o, bot = r.bottom - o, d = +(el.dataset.delay || 0), zone = vh * 0.3;
          const en = c((vh - top - d * 50) / zone), ex = c(bot / zone);
          const t = ease(Math.min(en, ex)), dir = en <= ex ? 1 : -1;
          const m = (1 - t) * k, mc = Math.min(1, m);
          let ty = 0, tf;
          switch (el.dataset.reveal) {
            case 'left': tf = `translateX(${-m * 120}px)`; break;
            case 'right': tf = `translateX(${m * 120}px)`; break;
            case 'scale': tf = `scale(${1 - mc * 0.18})`; break;
            case 'tilt': ty = dir * m * 90; tf = `translateY(${ty}px) rotate(${dir * m * 5}deg)`; break;
            case 'clip':
              ty = dir * m * 40; tf = `translateY(${ty}px)`;
              el.style.clipPath = dir > 0 ? `inset(0 0 ${mc * 100}% 0)` : `inset(${mc * 100}% 0 0 0)`; break;
            default: ty = dir * m * 80; tf = `translateY(${ty}px)`;
          }
          el._o = ty;
          el.style.transform = tf;
          el.style.opacity = 1 - mc;
        });
    
        $('[data-line]').forEach(el => {
          const r = el.parentElement.getBoundingClientRect();
          el.style.transform = `scaleY(${c((vh * 0.6 - r.top) / r.height)})`;
        });
        $('[data-drift]').forEach(el => {
          const r = el.parentElement.getBoundingClientRect();
          el.style.transform = `translateY(${r.top * -(+el.dataset.drift) * k}px)`;
        });
        $('[data-parallax]').forEach(el => {
          const y = scrollY;
          el.style.transform = `translateY(${y * (+el.dataset.parallax) * k}px)`;
          if (el.dataset.fade) el.style.opacity = 1 - c(y / (vh * 0.75));
        });
        $('[data-hscroll]').forEach(el => {
          const r = el.getBoundingClientRect(), track = el.querySelector('[data-track]');
          if (!track) return;
          const p = c(-r.top / (r.height - vh));
          const dist = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
          track.style.transform = `translateX(${-p * dist}px)`;
          const bar = el.querySelector('[data-hbar]');
          if (bar) bar.style.transform = `scaleX(${p})`;
        });
        $('[data-count]').forEach(el => {
          const r = el.getBoundingClientRect();
          const t = ease(c((vh - r.top) / (vh * 0.45)));
          el.textContent = Math.round(+el.dataset.count * t) + (el.dataset.suffix || '');
        });
        $('[data-ring]').forEach(el => {
          const r = el.getBoundingClientRect();
          const t = ease(c((vh - r.top) / (vh * 0.5)));
          el.style.strokeDashoffset = 326.73 * (1 - +el.dataset.ring * t);
        });
    
        const max = document.documentElement.scrollHeight - vh;
        const pb = document.querySelector('[data-progress]');
        if (pb) pb.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        let active = null;
        $('[data-section]').forEach(s => {
          const r = s.getBoundingClientRect();
          if (r.top < vh * 0.45 && r.bottom > vh * 0.45) active = s.dataset.section;
        });
        if (active === 'leadership') active = 'education';
        $('[data-nav]').forEach(a => {
          const on = a.dataset.nav === active;
          a.style.opacity = on ? 1 : 0.55;
          if (a.firstElementChild) a.firstElementChild.style.transform = `scale(${on ? 1 : 0})`;
        });
      }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    tick();
    setTimeout(onScroll, 400);

    // Rotating hero word
    var state = {};
    if (MOTION) {
      state.wi = 0;
      state.wordTimer = setInterval(() => {
        const col = document.querySelector('[data-wordcol]');
        if (!col) return;
        const n = col.children.length - 1;
        state.wi += 1;
        col.style.transition = 'transform .9s cubic-bezier(.76,0,.24,1)';
        col.style.transform = 'translate3d(0,' + (-1.3 * state.wi) + 'em,0)';
        if (state.wi === n) {
          clearTimeout(state.snap);
          state.snap = setTimeout(() => {
            col.style.transition = 'none';
            col.style.transform = 'translate3d(0,0,0)';
            col.offsetHeight;
            state.wi = 0;
          }, 950);
        }
      }, 2600);
    }
  });
})();
