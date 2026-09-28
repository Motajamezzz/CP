/* ==========================================================================
   Comissão de Praxe de Enfermagem — Coimbra · 2026/2027
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------------- Bloquear scroll (menu / perfil) */
  const locks = new Set();

  function lockScroll(key, on) {
    if (on) locks.add(key); else locks.delete(key);
    root.classList.toggle('is-locked', locks.size > 0);
  }

  function onScrollFrame(fn) {
    let ticking = false;
    const run = () => { ticking = false; fn(); };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    window.addEventListener('resize', fn);
    fn();
  }

  /* ---------------------------------------------------------------- 1. Hero */
  function initHero() {
    const hero = $('.hero');
    if (!hero) return;
    const title = $('.hero__title', hero);
    const lines = title ? $$('.hero__line', title) : [];
    let chars = 0;

    // divide o título em letras para a entrada
    if (!reducedMotion && lines.length) {
      title.setAttribute('aria-label', lines.map(l => l.textContent.trim()).join(' '));
      lines.forEach(line => {
        const text = line.textContent.trim();
        line.dataset.text = text;
        line.setAttribute('aria-hidden', 'true');
        line.textContent = '';
        text.split(/\s+/).forEach((word, w) => {
          if (w) line.append(' ');
          const wordEl = document.createElement('span');
          wordEl.className = 'word';
          for (const ch of word) {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            c.style.setProperty('--i', chars++);
            wordEl.append(c);
          }
          line.append(wordEl);
        });
      });
    }

    const start = () => requestAnimationFrame(() => {
      hero.classList.add('is-ready');
      if (!title || reducedMotion) return;
      // no fim da entrada: volta ao texto simples e acende o reflexo de luz
      setTimeout(() => {
        lines.forEach(line => {
          line.textContent = line.dataset.text;
          line.removeAttribute('aria-hidden');
        });
        title.removeAttribute('aria-label');
        title.classList.add('is-lit');
      }, 350 + chars * 42 + 1200);
    });

    // espera pelas fontes (no máximo 1,5 s) para as letras não mudarem a meio da animação
    const fonts = document.fonts && document.fonts.load
      ? Promise.all([
          document.fonts.load('800 1em "Cinzel"'),
          document.fonts.load('italic 400 1em "EB Garamond"'),
        ]).catch(() => {})
      : Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 1500))]).then(start);
  }

  /* ---------------------------------------------------------------- Navegação */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const bar = $('.nav__progress span', nav);

    onScrollFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      if (bar) {
        const max = root.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
      }
    });

    // secção ativa no menu
    const links = $$('[data-nav]');
    const sections = [...new Set(links.map(a => a.getAttribute('href')))]
      .map(href => document.querySelector(href))
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = id => links.forEach(a => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------------------------------------------------------------- Menu hamburger */
  function initMenu() {
    const toggle = $('.nav__toggle');
    const menu = $('#menu');
    if (!toggle || !menu) return;
    const outside = [$('main'), $('footer')].filter(Boolean);
    const isOpen = () => menu.classList.contains('is-open');

    function open() {
      menu.classList.add('is-open');
      root.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      outside.forEach(el => { el.inert = true; });
      lockScroll('menu', true);
      const first = $('a', menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    }

    function close(restoreFocus = true) {
      if (!isOpen()) return;
      menu.classList.remove('is-open');
      root.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      outside.forEach(el => { el.inert = false; });
      lockScroll('menu', false);
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => (isOpen() ? close() : open()));
    menu.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) close(false); });
    const brand = $('.nav__brand');
    if (brand) brand.addEventListener('click', () => close(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(); });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) close(false); });
  }

  /* ---------------------------------------------------------------- Aparecer ao fazer scroll */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      let k = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // elementos que aparecem juntos entram em cascata
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(k, 6) * 0.08}s`);
        k += 1;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------- Parallax subtil */
  function initParallax() {
    if (reducedMotion) return;
    const hero = $('[data-parallax-hero]');
    const layers = $$('[data-parallax]').map(el => ({ el, box: el.parentElement, speed: parseFloat(el.dataset.parallax) || 0.15, on: false }));

    if ('IntersectionObserver' in window) {
      const byBox = new Map(layers.map(it => [it.box, it]));
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        const it = byBox.get(e.target);
        if (it) it.on = e.isIntersecting;
      }), { rootMargin: '20% 0px' });
      layers.forEach(it => io.observe(it.box));
    } else {
      layers.forEach(it => { it.on = true; });
    }

    onScrollFrame(() => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (hero && y < vh * 1.4) hero.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0)`;

      layers.forEach(it => {
        if (!it.on) return;
        const r = it.box.getBoundingClientRect();
        const max = r.height * 0.2;
        const off = Math.max(-max, Math.min(max, (r.top + r.height / 2 - vh / 2) * -it.speed));
        it.el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    });
  }

  /* ---------------------------------------------------------------- 3. Comissão: luz que segue o rato */
  function initRoles() {
    if (!canHover) return;
    $$('.role').forEach(card => card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
      card.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
    }));
  }

  /* ---------------------------------------------------------------- 6. Doutores */
  function initDeck() {
    const cards = $$('.deck .card');
    if (!cards.length) return;

    // fotografia: aparece quando carrega; se o ficheiro não existir fica a inicial
    cards.forEach(card => {
      const img = $('.card__img', card);
      if (!img) { card.classList.add('no-photo'); return; }
      card.dataset.photo = img.getAttribute('src') || '';
      const ok = () => { img.classList.add('is-loaded'); card.classList.add('has-photo'); };
      const fail = () => { img.remove(); card.classList.add('no-photo'); };
      if (img.complete) {
        if (img.naturalWidth > 0) ok(); else fail();
      } else {
        img.addEventListener('load', ok, { once: true });
        img.addEventListener('error', fail, { once: true });
      }
    });

    // inclinação 3D subtil
    if (canHover && !reducedMotion) {
      cards.forEach(card => {
        const btn = $('.card__btn', card);
        const frame = $('.card__frame', card);
        btn.addEventListener('pointermove', e => {
          const r = btn.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          frame.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
          frame.style.setProperty('--rx', `${(py * -9).toFixed(2)}deg`);
          frame.style.setProperty('--sx', `${((px + 0.5) * 100).toFixed(1)}%`);
          frame.style.setProperty('--sy', `${((py + 0.5) * 100).toFixed(1)}%`);
        });
        btn.addEventListener('pointerleave', () => {
          frame.style.setProperty('--rx', '0deg');
          frame.style.setProperty('--ry', '0deg');
        });
      });
    }

    // telemóvel: sem rato não há hover, por isso a frase aparece nos cartões que passam pelo centro do ecrã
    if (!canHover && 'IntersectionObserver' in window) {
      const spot = new IntersectionObserver(entries => {
        entries.forEach(e => e.target.classList.toggle('is-active', e.isIntersecting));
      }, { rootMargin: '-38% 0px -38% 0px' });
      cards.forEach(card => spot.observe(card));
    }

    initLightbox(cards);
  }

  function initLightbox(cards) {
    const dialog = $('#lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const img = $('.lightbox__img', dialog);
    const mono = $('.lightbox__monogram', dialog);
    const titleEl = $('[data-lb-title]', dialog);
    const given = $('[data-lb-given]', dialog);
    const quote = $('[data-lb-quote]', dialog);
    const wait = ms => (reducedMotion ? 0 : ms);
    let index = 0;
    let opener = null;
    let closeTimer = 0;
    let switchTimer = 0;

    const text = (card, sel) => $(sel, card).textContent.trim();

    function render(i) {
      const card = cards[i];
      const title = text(card, '.card__title');
      const name = text(card, '.card__given');
      titleEl.textContent = title;
      given.textContent = name;
      quote.textContent = text(card, '.card__quote');
      mono.textContent = text(card, '.card__monogram');

      img.hidden = true;
      img.onload = null;
      img.onerror = null;
      img.removeAttribute('src');
      const photo = card.classList.contains('no-photo') ? '' : card.dataset.photo;
      if (photo) {
        img.alt = `Fotografia: ${title} ${name}`;
        img.onload = () => { img.hidden = false; };
        img.onerror = () => { card.classList.add('no-photo'); };
        img.src = photo;
      }
    }

    function preload(i) {
      [i - 1, i + 1].forEach(j => {
        const card = cards[(j + cards.length) % cards.length];
        if (card.dataset.photo && !card.classList.contains('no-photo')) new Image().src = card.dataset.photo;
      });
    }

    function open(i) {
      index = i;
      opener = $('.card__btn', cards[i]);
      render(i);
      clearTimeout(closeTimer);
      if (!dialog.open) {
        dialog.showModal();
        void dialog.offsetWidth; // garante a transição de entrada
      }
      dialog.classList.add('is-open');
      lockScroll('lightbox', true);
      preload(i);
    }

    function close() {
      if (!dialog.open) return;
      dialog.classList.remove('is-open');
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        dialog.close();
        lockScroll('lightbox', false);
        if (opener) {
          opener.focus({ preventScroll: true });
          opener.scrollIntoView({ block: 'nearest' });
        }
      }, wait(380));
    }

    function go(delta) {
      const next = (index + delta + cards.length) % cards.length;
      dialog.classList.add('is-switching');
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => {
        index = next;
        opener = $('.card__btn', cards[next]);
        render(next);
        preload(next);
        requestAnimationFrame(() => dialog.classList.remove('is-switching'));
      }, wait(200));
    }

    cards.forEach((card, i) => $('.card__btn', card).addEventListener('click', () => open(i)));
    $('[data-lb-close]', dialog).addEventListener('click', close);
    $('[data-lb-prev]', dialog).addEventListener('click', () => go(-1));
    $('[data-lb-next]', dialog).addEventListener('click', () => go(1));
    dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    // deslizar para o lado no telemóvel
    let startX = 0;
    let startY = 0;
    let tracking = false;
    dialog.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    });
    dialog.addEventListener('pointerup', e => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    });
    dialog.addEventListener('pointercancel', () => { tracking = false; });
  }

  initHero();
  initNav();
  initMenu();
  initReveal();
  initParallax();
  initRoles();
  initDeck();
})();
