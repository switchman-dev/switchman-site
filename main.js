  // Sticky nav
  window.addEventListener('scroll', () =>
    document.getElementById('nav').classList.toggle('scrolled', scrollY > 30)
  );

  // Copy install command
  function copyInstall(el) {
    navigator.clipboard.writeText('npm install -g switchman-dev').then(() => {
      el.classList.add('copied');
      el.textContent = '✓  copied to clipboard';
      setTimeout(() => {
        el.classList.remove('copied');
        el.textContent = '$ npm install -g switchman-dev';
      }, 2000);
    });
  }

  // Scroll reveal
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }),
    { threshold: 0.06 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Terminal typewriter
  const script = [
    { t: 'comment', s: '# 4 tasks ready, 3 agent branches set up' },
    { t: 'blank' },
    { t: 'cmd', agent: null,      s: 'switchman status' },
    { t: 'dim',                   s: 'Pending 4  ·  In progress 0  ·  Done 0' },
    { t: 'ok',                    s: '✓  No conflicts across 4 branches' },
    { t: 'blank' },
    { t: 'comment', s: '# Agent 1 picks up the highest-priority task' },
    { t: 'cmd', agent: 'agent-1', s: 'switchman task next' },
    { t: 'ok',                    s: '✓  Assigned: "Add rate limiting to all routes"' },
    { t: 'blank' },
    { t: 'comment', s: '# Agent 1 locks the files it needs' },
    { t: 'cmd', agent: 'agent-1', s: 'switchman claim src/middleware/auth.js src/server.js' },
    { t: 'ok',                    s: '✓  2 files locked — no conflicts' },
    { t: 'blank' },
    { t: 'comment', s: '# Agent 2 picks up the next task' },
    { t: 'cmd', agent: 'agent-2', s: 'switchman task next' },
    { t: 'ok',                    s: '✓  Assigned: "Add validation to POST /tasks"' },
    { t: 'blank' },
    { t: 'comment', s: '# Agent 2 tries to claim auth.js — already locked' },
    { t: 'cmd', agent: 'agent-2', s: 'switchman claim src/middleware/auth.js' },
    { t: 'warn',                  s: '⚠  Conflict: auth.js is locked by agent-1' },
    { t: 'dim',                   s: '   Agent 2 claims different files instead...' },
    { t: 'blank' },
    { t: 'cmd', agent: 'agent-2', s: 'switchman claim src/middleware/validate.js src/routes/tasks.js' },
    { t: 'ok',                    s: '✓  2 files locked — no conflicts' },
    { t: 'blank' },
    { t: 'dim',                   s: '  agent-1  →  editing auth.js and server.js' },
    { t: 'dim',                   s: '  agent-2  →  editing validate.js and tasks.js' },
    { t: 'ok',                    s: '✓  Both agents running. Zero collisions.' },
    { t: 'cursor' },
  ];

  const term = document.getElementById('term');
  let i = 0;
  function next() {
    if (i >= script.length) return;
    const l = script[i++];
    const el = document.createElement('span');
    if (l.t === 'blank') {
      el.className = 'tl-blank tl';
    } else if (l.t === 'cursor') {
      el.className = 'tl';
      el.innerHTML = '<span class="tl-prompt">$ </span><span class="tl-cursor"></span>';
    } else if (l.t === 'cmd') {
      el.className = 'tl';
      const p = l.agent
        ? `<span class="tl-prompt">[<span class="tl-agent">${l.agent}</span>]$ </span>`
        : `<span class="tl-prompt">$ </span>`;
      el.innerHTML = `${p}<span class="tl-cmd">${l.s}</span>`;
    } else {
      const map = { comment:'tl-comment', ok:'tl-ok', warn:'tl-warn', dim:'tl-dim' };
      el.className = `tl ${map[l.t]}`;
      el.textContent = l.s;
    }
    term.appendChild(el);
    const d = l.t==='blank'?50 : l.t==='cmd'?90 : l.t==='comment'?30 : 45;
    setTimeout(next, d);
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { setTimeout(next, 300); }
  }, { threshold: 0.15 }).observe(document.querySelector('.terminal-outer'));

  // Auto-update version badge from npm
fetch('https://registry.npmjs.org/switchman-dev/latest')
  .then(r => r.json())
  .then(data => {
    const badge = document.querySelector('.hero-kicker');
    if (badge && data.version) {
      badge.innerHTML = `<div class="kicker-dot"></div>v${data.version} · open source · MIT`;
    }
  })
  .catch(() => {}); // silently fail, static text remains as fallback