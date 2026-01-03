// 域名规范化（仅 http/https）
(() => {
  const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  const hostname = location.hostname;

  if (
    isHttp &&
    hostname &&
    hostname !== 'sysri.cn' &&
    !hostname.includes('localhost') &&
    hostname !== '127.0.0.1'
  ) {
    const { pathname, search, hash } = location;
    location.replace(`https://sysri.cn${pathname}${search}${hash}`);
  }
})();

// 统计/埋点（仅 sysri.cn 域）
(() => {
  const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  const hostname = location.hostname;
  const isProd = isHttp && hostname && (hostname === 'sysri.cn' || hostname.endsWith('.sysri.cn'));
  if (!isProd) return;

  (function () {
    const script = document.createElement('script');
    script.src = 'https://mxana.tacool.com/sdk.js';
    script.id = 'MXA_COLLECT';
    script.async = true;
    script.onload = function () {
      if (window.MXA && window.MXA.init) {
        window.MXA.init({ id: 'c1-DcvmmKgc' });
      }
    };
    document.head.appendChild(script);
  })();

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = '//www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'ne64v69ll5');
})();

// UI 逻辑（主题/导航/下载弹窗/动效）
(() => {
  const html = document.documentElement;
  const themeModes = ['light', 'dark', 'system'];
  const themeIcons = { light: 'fa-sun-o', dark: 'fa-moon-o', system: 'fa-desktop' };

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }

  function applyTheme(mode) {
    const resolved = themeModes.includes(mode) ? mode : 'system';
    html.setAttribute('data-theme', resolved);
    safeSet('theme', resolved);

    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const icon = themeIcons[resolved] || themeIcons.system;
    toggle.innerHTML = `<i class="fa ${icon}"></i>`;
    toggle.setAttribute(
      'aria-label',
      `当前主题：${resolved === 'system' ? '跟随系统' : resolved === 'dark' ? '深色' : '浅色'}`
    );
  }

  function nextTheme() {
    const current = safeGet('theme') || 'system';
    const idx = themeModes.indexOf(current);
    const next = themeModes[(idx + 1) % themeModes.length];
    applyTheme(next);
  }

  function getDownloadModal() {
    return document.getElementById('downloadModal');
  }

  function showDownloadModal() {
    const modal = getDownloadModal();
    if (!modal) return;
    modal.classList.add('active');
  }

  function hideDownloadModal() {
    const modal = getDownloadModal();
    if (!modal) return;
    modal.classList.remove('active');
  }

  // 兼容已有 HTML onclick
  window.downloadAndShowModal = function downloadAndShowModal(url) {
    if (url) window.open(url, '_self');
    window.setTimeout(showDownloadModal, 1200);
  };
  window.closeModal = hideDownloadModal;

  // 尽早应用主题，减少闪烁
  applyTheme(safeGet('theme') || 'system');

  document.addEventListener('DOMContentLoaded', () => {
    // 主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', nextTheme);

    // 下载弹窗：点击遮罩关闭 + Esc 关闭
    const modal = getDownloadModal();
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) hideDownloadModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideDownloadModal();
      });
    }

    // 导航滚动状态 + 折叠
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const setNavState = () => {
      if (!navbar) return;
      if (window.scrollY > 12) navbar.classList.add('navbar--scrolled');
      else navbar.classList.remove('navbar--scrolled');
    };
    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });
    if (navbar && navToggle) {
      navToggle.addEventListener('click', () => {
        navbar.classList.toggle('navbar--open');
        navToggle.innerHTML = navbar.classList.contains('navbar--open')
          ? '<i class="fa fa-times"></i>'
          : '<i class="fa fa-bars"></i>';
      });
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          navbar.classList.remove('navbar--open');
          navToggle.innerHTML = '<i class="fa fa-bars"></i>';
        });
      });
    }

    // 平滑滚动（仅站内锚点）
    document.querySelectorAll('a[href^=\"#\"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Hero 标语打字机（仅首页）
    (() => {
      const prefixEl = document.getElementById('heroSloganPrefix');
      const highlightEl = document.getElementById('heroSloganHighlight');
      if (!prefixEl || !highlightEl) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const slogans = [
        { prefix: '重装也能很轻松，', highlight: '一键就绪' },
        { prefix: '纯净无捆绑，', highlight: '装完就走' },
        { prefix: '三步搞定，', highlight: '稳稳重装' },
        { prefix: '跟着提示走，', highlight: '新手也能装好' },
      ];

      const typeDelay = 70;
      const deleteDelay = 40;
      const holdDelay = 2200;
      const switchDelay = 420;

      const setSlogan = (idx) => {
        const s = slogans[idx] || slogans[0];
        prefixEl.textContent = s.prefix;
        highlightEl.textContent = s.highlight;
      };

      setSlogan(0);
      if (prefersReducedMotion || slogans.length < 2) return;

      let index = 0;
      let timerId = 0;

      const schedule = (fn, ms) => {
        timerId = window.setTimeout(fn, ms);
      };

      const cleanup = () => {
        if (timerId) window.clearTimeout(timerId);
        timerId = 0;
      };

      window.addEventListener('pagehide', cleanup, { once: true });

      const deleteStep = () => {
        const h = highlightEl.textContent || '';
        if (h.length) {
          highlightEl.textContent = h.slice(0, -1);
          schedule(deleteStep, deleteDelay);
          return;
        }

        const p = prefixEl.textContent || '';
        if (p.length) {
          prefixEl.textContent = p.slice(0, -1);
          schedule(deleteStep, deleteDelay);
          return;
        }

        index = (index + 1) % slogans.length;
        schedule(typePrefixStep, switchDelay);
      };

      const typePrefixStep = () => {
        const target = slogans[index].prefix;
        const current = prefixEl.textContent || '';
        if (current.length < target.length) {
          prefixEl.textContent = target.slice(0, current.length + 1);
          schedule(typePrefixStep, typeDelay);
          return;
        }
        schedule(typeHighlightStep, 120);
      };

      const typeHighlightStep = () => {
        const target = slogans[index].highlight;
        const current = highlightEl.textContent || '';
        if (current.length < target.length) {
          highlightEl.textContent = target.slice(0, current.length + 1);
          schedule(typeHighlightStep, typeDelay);
          return;
        }
        schedule(deleteStep, holdDelay);
      };

      schedule(deleteStep, holdDelay);
    })();

    // 自定义页项目折叠
    const toggleBtn = document.getElementById('toggleProjects');
    if (toggleBtn) {
      const hiddenProjectsWrap = document.querySelector('.hidden-projects');
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.classList.toggle('expanded');
        if (hiddenProjectsWrap) {
          hiddenProjectsWrap.classList.toggle('is-visible', isExpanded);
        }
        toggleBtn.innerHTML = isExpanded
          ? '收起项目 <i class="fa fa-chevron-up"></i>'
          : '查看更多项目 <i class="fa fa-chevron-down"></i>';
      });
    }

    // 入场动画（仅首页引入 GSAP 时启用）
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      window.gsap.set('[data-animate]', { opacity: 0, y: 28 });
      window.gsap.utils.toArray('[data-animate]').forEach((el, idx) => {
        window.gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: Math.min(idx * 0.06, 0.5),
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });

      window.gsap.from('.hero-visual .layer-card', {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.2,
      });
    }

    // 鼠标倾斜互动（精细指针 + 非减少动效）
    const heroShot = document.querySelector('.hero-shot');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroShot && isFinePointer && !reduceMotion) {
      const strength = 8;
      heroShot.addEventListener('mousemove', (e) => {
        const rect = heroShot.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = -(y * strength);
        const rotateY = x * strength;
        heroShot.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      heroShot.addEventListener('mouseleave', () => {
        heroShot.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    }
  });
})();
