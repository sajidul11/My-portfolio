/* Sajidul Islam portfolio — vanilla JS */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(hover: hover) and (pointer: fine)').matches && innerWidth > 860;

/* ===== Edit project details here ===== */
const PROJECTS = {
  realestate: {
    title: 'Real Estate Project',
    desc: 'A college real-estate website showcasing featured properties with images and important details such as price, location, and amenities.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    features: ['Featured properties with images', 'Price, location and amenities', 'Home, About, Properties, Services and Contact/Inquiry sections'],
    img: 'images/projects/realestate.png',
    live: 'https://realestate-project-indol.vercel.app/',
    code: 'https://github.com/sajidul11/Realestate-Project'
  },
  news: {
    title: 'NewsPulse',
    desc: 'A modern news dashboard interface for browsing and searching the news.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    features: ['News search', 'Category filtering', 'Async news loading', 'Animated cards', 'Responsive design'],
    img: 'images/projects/newspulse.png',
    live: 'https://news-project-ivory-rho.vercel.app/',
    code: 'https://github.com/sajidul11/NewsProject'
  },
  robot: {
    title: 'Autonomous Line-Following Robot',
    desc: 'Robotics / Embedded Systems. An autonomous robot designed for fast and accurate path tracking using an ESP32 and an 8-channel IR sensor array.',
    tags: ['ESP32', 'RLS-08 IR sensor', 'L298N driver', 'N20 12V 600 RPM motors', 'LM2596 buck converter', '42mm wheels', 'Custom chassis'],
    features: ['Real-time sensor feedback and motor control to hold the line', 'Handles sharp 90-degree turns', 'Detects an all-white track / end condition'],
    img: 'images/projects/line-following-robot.jpg'
  }
};

/* ===== Loader ===== */
function initLoader() {
  const done = () => { $('#loader').classList.add('done'); document.body.classList.add('ready'); };
  addEventListener('load', () => setTimeout(done, 700));
  setTimeout(done, 2000); // safety fallback
}

/* ===== Navigation: sticky style, mobile menu, active link ===== */
function initNavigation() {
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const toggle = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  const links = $$('#menu a[href^="#"]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => io.observe(s));
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 30), { passive: true });
}

/* ===== Scroll progress bar ===== */
function initScrollProgress() {
  const bar = $('#progress');
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }, { passive: true });
}

/* ===== Reveal on scroll ===== */
function initScrollAnimations() {
  const items = $$('.prose, .stats .card, .project, .skills .card, .cert, .soon .card, .timeline li, form, .soon-head');
  items.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  items.forEach(el => io.observe(el));
}

/* ===== Glow orb, hero parallax, tilt, magnetic buttons ===== */
function initInteractions() {
  const orb = $('.orb');
  const hero = $('#tilt-hero'), layers = $$('[data-depth]', hero);
  let mx = innerWidth / 2, my = innerHeight / 3, ox = mx, oy = my;

  if (desktop && !reduced) {
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
    });

    // Magnetic buttons
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      b.addEventListener('mouseleave', () => (b.style.transform = ''));
    });

    // 3D tilt for project + coming-soon cards
    $$('.project, .tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => (card.style.transform = ''));
    });

    // Smooth loop: glow orb, hero layers
    (function loop() {
      ox += (mx - ox) * .04; oy += (my - oy) * .04;
      orb.style.setProperty('--mx', ox + 'px'); orb.style.setProperty('--my', oy + 'px');
      const px = mx / innerWidth - .5, py = my / innerHeight - .5;
      layers.forEach(l => {
        const d = +l.dataset.depth;
        l.style.transform = `translate3d(${px * d}px,${py * d}px,0)`;
      });
      requestAnimationFrame(loop);
    })();
  }
}

/* ===== Project detail modal ===== */
function initProjectInteractions() {
  const modal = $('#modal'); let last;
  const link = (href, text, ghost) => `<a class="btn ${ghost ? 'ghost' : ''}" href="${href}" target="_blank" rel="noopener">${text}</a>`;
  const open = key => {
    const p = PROJECTS[key]; last = document.activeElement;
    const img = $('#m-img');
    img.src = p.img; img.alt = p.title + ' preview'; img.hidden = false; img.onerror = () => (img.hidden = true);
    $('#m-title').textContent = p.title; $('#m-desc').textContent = p.desc;
    $('#m-tags').innerHTML = p.tags.map(t => `<li>${t}</li>`).join('');
    $('#m-feat').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
    $('#m-links').innerHTML = (p.live ? link(p.live, 'Live Demo') : '') + (p.code ? link(p.code, 'View Code', true) : '');
    modal.hidden = false; requestAnimationFrame(() => modal.classList.add('open'));
    $('#m-close').focus();
  };
  const close = () => {
    modal.classList.remove('open');
    setTimeout(() => (modal.hidden = true), 250);
    if (last) last.focus();
  };
  $$('.project').forEach(c => {
    c.addEventListener('click', () => open(c.dataset.project));
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(c.dataset.project); } });
  });
  $('#m-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

/* ===== Contact form: validation + mailto (no fake "sent" message) ===== */
function initContactForm() {
  const form = $('#form');
  const rules = {
    name: v => v.trim() ? '' : 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    msg: v => v.trim() ? '' : 'Write a message.'
  };
  const check = k => {
    const f = form.elements[k], msg = rules[k](f.value);
    $(`[data-for="${k}"]`).textContent = msg; f.classList.toggle('bad', !!msg);
    return !msg;
  };
  Object.keys(rules).forEach(k => form.elements[k].addEventListener('blur', () => check(k)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!Object.keys(rules).map(check).every(Boolean)) return;
    const { name, email, msg } = form.elements;
    const body = `${msg.value}\n\nFrom: ${name.value} (${email.value})`;
    location.href = `mailto:sajidulislam.official11@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + name.value)}&body=${encodeURIComponent(body)}`;
    $('#status').textContent = 'Your email app should open with the message ready to send.';
  });
}

initLoader(); initNavigation(); initScrollProgress(); initScrollAnimations();
initInteractions(); initProjectInteractions(); initContactForm();
