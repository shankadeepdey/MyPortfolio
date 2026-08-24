document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Scroll progress bar =====
  const progress = document.getElementById('scrollProgress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ===== Nav background on scroll + active link highlight =====
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.navlinks a, .mobile-panel a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');
  function onScroll(){
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu toggle =====
  const navToggle = document.getElementById('navToggle');
  const mobilePanel = document.getElementById('mobilePanel');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  function closeMobileMenu(){
    if (!navToggle) return;
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openMobileMenu(){
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  if (navToggle && mobilePanel && mobileBackdrop) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.contains('open');
      if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
    mobileBackdrop.addEventListener('click', closeMobileMenu);
    mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) closeMobileMenu(); });
  }

  // ===== Typing effect for hero role line =====
  const roles = [
    'Computer Science Engineer',
    'Problem Solver',
    'DSA Enthusiast',
    'Web Developer'
  ];
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      const TYPE_SPEED = 55, DELETE_SPEED = 30, HOLD = 1400, GAP = 400;
      function tick(){
        const word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            setTimeout(tick, HOLD);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, GAP);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }
      tick();
    }
  }

  // ===== Scroll reveal (IntersectionObserver) =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ===== Count-up numbers =====
  const counters = document.querySelectorAll('.num[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      function frame(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      if (reduceMotion) el.textContent = target.toFixed(decimals) + suffix;
      else requestAnimationFrame(frame);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIO.observe(el));

  // Text-based stat (e.g. "Top 5%")
  document.querySelectorAll('.num[data-text]').forEach(el => {
    el.textContent = el.dataset.text;
  });

  // ===== Portrait tilt on mouse move =====
  const tilt = document.getElementById('portraitTilt');
  if (tilt && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    tilt.addEventListener('mouseleave', () => {
      tilt.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    });
  }

  // ===== Project card tilt =====
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  // ===== Magnetic buttons =====
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ===== Cursor glow =====
  const glow = document.getElementById('cursorGlow');
  if (glow && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  // ===== Education timeline: traveling dot =====
  const eduTimeline = document.getElementById('eduTimeline');
  const eduDot = document.getElementById('eduProgressDot');
  const eduFill = document.getElementById('eduProgressFill');
  if (eduTimeline && eduDot) {
    const eduItems = Array.from(eduTimeline.querySelectorAll('.edu-item'));
    function updateEduDot(){
      const timelineRect = eduTimeline.getBoundingClientRect();
      const viewportRef = window.innerHeight * 0.45;
      let activeIndex = 0, minDist = Infinity;
      eduItems.forEach((item, i) => {
        const node = item.querySelector('.edu-node');
        const nodeRect = node.getBoundingClientRect();
        const dist = Math.abs((nodeRect.top + nodeRect.height / 2) - viewportRef);
        if (dist < minDist) { minDist = dist; activeIndex = i; }
      });
      const activeNode = eduItems[activeIndex].querySelector('.edu-node');
      const nodeRect = activeNode.getBoundingClientRect();
      const posWithinTimeline = nodeRect.top - timelineRect.top + nodeRect.height / 2;
      eduDot.style.top = posWithinTimeline + 'px';
      if (eduFill) eduFill.style.height = posWithinTimeline + 'px';
      eduItems.forEach((item, i) => item.classList.toggle('is-active', i === activeIndex));
    }
    updateEduDot();
    document.addEventListener('scroll', updateEduDot, { passive: true });
    window.addEventListener('resize', updateEduDot);
  }

  // ===== Smooth anchor scroll offset for sticky nav =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
});