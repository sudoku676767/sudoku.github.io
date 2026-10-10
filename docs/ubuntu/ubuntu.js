/* Ubuntu 26.04 风格桌面主题（Gmeek 用）
 * 首页变成桌面：顶栏 + Dock + 窗口；文章、标签页在窗口里打开。
 * 被嵌进窗口 iframe 时只做精简排版。 */
(function () {
  'use strict';

  var BASE = window.UBU_BASE || '';
  var html = document.documentElement;
  var embedded = window.self !== window.top;

  // ---------- 页面信息 ----------
  var isPost = !!document.getElementById('postBody');
  var isTag = !!document.querySelector('.tagTitle');
  var isIndex = !isPost && !isTag && !!document.querySelector('#header .title-left');

  if (embedded) {
    html.classList.add('ubu-embed', 'ubu-ready');
    // 窗口里点到站内链接时保持在窗口里，站外链接新开标签页
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (a && a.host && a.host !== location.host) a.target = '_blank';
    });
    return;
  }

  var footerLink = document.querySelector('#footer a');
  var info = {
    title: (document.querySelector('.blogTitle') || footerLink || {}).textContent || document.title,
    sub: '',
    avatar: (document.getElementById('avatarImg') || {}).src ||
      (document.querySelector('link[rel="icon"]') || {}).href || '',
    owner: location.hostname.split('.')[0]
  };
  info.title = info.title.trim();
  var desc = document.querySelector('meta[name="description"]');
  if (isIndex && desc) {
    info.sub = desc.content;
    try { sessionStorage.setItem('ubu_sub', info.sub); } catch (e) {}
  } else {
    try { info.sub = sessionStorage.getItem('ubu_sub') || ''; } catch (e) {}
  }

  // ---------- 小工具 ----------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function svg(s) { return '<svg viewBox="0 0 48 48" aria-hidden="true">' + s + '</svg>'; }
  var isMobile = function () { return window.innerWidth <= 720; };

  // ---------- 图标（Yaru 风格的简化版） ----------
  var ICON = {
    files: svg('<rect x="4" y="10" width="40" height="32" rx="5" fill="#cf4a1c"/><path d="M4 15a5 5 0 0 1 5-5h11l4 4h15a5 5 0 0 1 5 5v1H4z" fill="#a83a13"/><rect x="4" y="17" width="40" height="25" rx="5" fill="#e95420"/><rect x="18" y="26" width="12" height="3" rx="1.5" fill="#fff" opacity=".85"/>'),
    folder: svg('<path d="M4 13a5 5 0 0 1 5-5h10l4 4h16a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#c7a46a"/><rect x="4" y="16" width="40" height="26" rx="5" fill="#e3c48f"/>'),
    folderOrange: svg('<path d="M4 13a5 5 0 0 1 5-5h10l4 4h16a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#b8431a"/><rect x="4" y="16" width="40" height="26" rx="5" fill="#e95420"/><path d="M18 27h12M18 32h8" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>'),
    doc: svg('<path d="M11 4h18l10 10v28a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff" stroke="#c9c9c9"/><path d="M29 4v8a2 2 0 0 0 2 2h8" fill="#e6e6e6" stroke="#c9c9c9"/><path d="M14 22h20M14 27h20M14 32h14" stroke="#e95420" stroke-width="2" stroke-linecap="round" opacity=".75"/>'),
    terminal: svg('<rect x="4" y="7" width="40" height="34" rx="6" fill="#2c2c2c"/><rect x="4" y="7" width="40" height="7" rx="3" fill="#3d3d3d"/><path d="M12 22l6 5-6 5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 33h12" stroke="#e95420" stroke-width="2.6" stroke-linecap="round"/>'),
    about: svg('<circle cx="24" cy="24" r="20" fill="#77216f"/><circle cx="24" cy="19" r="7" fill="#fff"/><path d="M11 36c3-6 8-8 13-8s10 2 13 8" fill="#fff"/>'),
    english: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#26a269"/><path d="M12 33l6-18h2l6 18M14.5 27h9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 20h8M33 17v3M30 31c4-2 6-6 7-11M31 25c2 3 4 5 7 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>'),
    code: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#3584e4"/><path d="M18 16l-8 8 8 8M30 16l8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 13l-4 22" stroke="#ffd166" stroke-width="2.6" stroke-linecap="round"/>'),
    tags: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#3584e4"/><path d="M13 14h11l11 11-10 10-12-12z" fill="#fff"/><circle cx="18" cy="19" r="2.3" fill="#3584e4"/>'),
    search: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#5e5c64"/><circle cx="21" cy="21" r="8" fill="none" stroke="#fff" stroke-width="3"/><path d="M27 27l8 8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>'),
    rss: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#f6a01a"/><circle cx="15" cy="33" r="3" fill="#fff"/><path d="M12 22a14 14 0 0 1 14 14M12 13a23 23 0 0 1 23 23" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>'),
    github: svg('<rect x="4" y="4" width="40" height="40" rx="10" fill="#24292f"/><path fill="#fff" d="M24 11a13 13 0 0 0-4.1 25.3c.6.1.9-.3.9-.6v-2.3c-3.6.8-4.4-1.6-4.4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3.1 1.4 3.8 1.1.1-.8.5-1.4.8-1.7-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.7.1-3.5 0 0 1.1-.3 3.6 1.3a12.4 12.4 0 0 1 6.5 0c2.5-1.7 3.6-1.3 3.6-1.3.7 1.8.3 3.2.1 3.5.8.9 1.3 2.1 1.3 3.5 0 5-3 6.1-5.9 6.4.5.4.9 1.2.9 2.4v3.6c0 .3.2.7.9.6A13 13 0 0 0 24 11z"/>'),
    apps: svg('<g fill="#fff" opacity=".9"><circle cx="14" cy="14" r="3"/><circle cx="24" cy="14" r="3"/><circle cx="34" cy="14" r="3"/><circle cx="14" cy="24" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="34" cy="24" r="3"/><circle cx="14" cy="34" r="3"/><circle cx="24" cy="34" r="3"/><circle cx="34" cy="34" r="3"/></g>'),
    trash: svg('<path d="M12 14h24l-2 28H14z" fill="#9a9996"/><rect x="9" y="9" width="30" height="5" rx="2" fill="#77767b"/><rect x="19" y="5" width="10" height="4" rx="1" fill="#77767b"/>')
  };
  var SMALL = {
    min: '<svg viewBox="0 0 10 10"><path d="M2 5h6"/></svg>',
    max: '<svg viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" rx="1"/></svg>',
    close: '<svg viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg>',
    ext: '<svg viewBox="0 0 16 16"><path d="M9 2h5v5h-1.5V4.6L7.6 9.5 6.5 8.4l4.9-4.9H9zM3 4h4v1.5H4.5v6h6V9H12v4H3z"/></svg>',
    back: '<svg viewBox="0 0 16 16"><path d="M10.5 2.5 5 8l5.5 5.5 1-1L7 8l4.5-4.5z"/></svg>',
    home: '<svg viewBox="0 0 16 16"><path d="M8 1.5 1 7.5l1 1.1L3 7.8V14h4v-4h2v4h4V7.8l1 .8 1-1.1z"/></svg>',
    doc: '<svg viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3zm1.5 1.5v11h7V5H9V2.5z"/></svg>',
    tag: '<svg viewBox="0 0 16 16"><path d="M1.5 1.5h6l7 7-6 6-7-7zM5 3.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>',
    sun: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.2"/><path d="M8 .5v2.2M8 13.3v2.2M.5 8h2.2M13.3 8h2.2M2.7 2.7l1.6 1.6M11.7 11.7l1.6 1.6M2.7 13.3l1.6-1.6M11.7 4.3l1.6-1.6" stroke="#fff" stroke-width="1.4"/></svg>',
    moon: '<svg viewBox="0 0 16 16"><path d="M6.2 1.2a6.8 6.8 0 1 0 8.6 8.6A5.6 5.6 0 0 1 6.2 1.2z"/></svg>',
    net: '<svg viewBox="0 0 16 16"><path d="M8 13.5 15.5 5A11.5 11.5 0 0 0 .5 5z"/></svg>',
    vol: '<svg viewBox="0 0 16 16"><path d="M2 6h3l4-3.5v11L5 10H2zM11 4.5a5 5 0 0 1 0 7M12.8 2.5a8 8 0 0 1 0 11" stroke="#fff" stroke-width="1.3" fill-opacity="1"/></svg>',
    power: '<svg viewBox="0 0 16 16"><path d="M7.2 1h1.6v7H7.2zM4.2 3.4l1.1 1.1a4.5 4.5 0 1 0 5.4 0l1.1-1.1a6 6 0 1 1-7.6 0z"/></svg>'
  };

  // ---------- 主题 ----------
  function currentMode() {
    var m = html.getAttribute('data-color-mode');
    if (m === 'auto') return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return m === 'dark' ? 'dark' : 'light';
  }
  function setMode(mode) {
    try { localStorage.setItem('meek_theme', mode); } catch (e) {}
    if (typeof changeTheme === 'function' && typeof themeSettings === 'object' && themeSettings[mode]) {
      changeTheme.apply(null, themeSettings[mode]);
    } else {
      html.setAttribute('data-color-mode', mode);
    }
    document.querySelectorAll('.ubu-body iframe').forEach(function (f) {
      try { f.contentDocument.documentElement.setAttribute('data-color-mode', mode); } catch (e) {}
    });
    var t = document.getElementById('ubu-theme');
    if (t) t.innerHTML = mode === 'dark' ? SMALL.moon : SMALL.sun;
  }

  // ---------- 文章数据 ----------
  var postsPromise = null;
  function loadPosts() {
    if (!postsPromise) {
      postsPromise = fetch(BASE + '/postList.json', { cache: 'no-cache' })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var colors = data.labelColorDict || {};
          var list = Object.keys(data).filter(function (k) { return /^P\d+$/.test(k); }).map(function (k) {
            var p = data[k];
            return { title: p.postTitle, url: BASE + '/' + p.postUrl, labels: p.labels || [], date: p.createdDate || '' };
          });
          list.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
          var used = {};
          list.forEach(function (p) { p.labels.forEach(function (l) { used[l] = colors[l] || '#888'; }); });
          return { posts: list, labels: used };
        })
        .catch(function () { return { posts: [], labels: {} }; });
    }
    return postsPromise;
  }

  // ---------- 窗口管理 ----------
  var wins = {};
  var zTop = 100;
  var cascade = 0;

  function focusWin(w) {
    Object.keys(wins).forEach(function (id) { wins[id].node.classList.remove('focused'); });
    w.node.classList.add('focused');
    w.node.style.zIndex = ++zTop;
    w.node.classList.remove('min');
  }

  function openWindow(opt) {
    if (wins[opt.id]) {
      var ex = wins[opt.id];
      if (opt.onReuse) opt.onReuse(ex);
      focusWin(ex);
      return ex;
    }
    var vw = window.innerWidth, vh = window.innerHeight;
    var w = Math.min(opt.w || 900, vw - 100), h = Math.min(opt.h || 600, vh - 70);
    var left = Math.max(72, Math.round((vw - w) / 2) + cascade * 28 - 40);
    var top = Math.max(40, Math.round((vh - h) / 2) + cascade * 28 - 20);
    cascade = (cascade + 1) % 6;

    var title = el('div', { class: 'ubu-title', text: opt.title });
    var headL = el('div', { class: 'ubu-head-l' }, opt.headLeft || []);
    var headR = el('div', { class: 'ubu-head-r' }, (opt.headRight || []).concat([
      el('button', { class: 'ubu-ctl', title: '最小化', html: SMALL.min, onclick: function (e) { e.stopPropagation(); minimize(win); } }),
      el('button', { class: 'ubu-ctl maxi', title: '最大化', html: SMALL.max, onclick: function (e) { e.stopPropagation(); toggleMax(win); } }),
      el('button', { class: 'ubu-ctl close', title: '关闭', html: SMALL.close, onclick: function (e) { e.stopPropagation(); closeWin(win); } })
    ]));
    var head = el('div', { class: 'ubu-head' }, [headL, title, headR]);
    var body = el('div', { class: 'ubu-body' }, [opt.content]);
    var node = el('section', { class: 'ubu-win', role: 'dialog', 'aria-label': opt.title }, [head, body]);
    node.style.cssText = 'left:' + left + 'px;top:' + top + 'px;width:' + w + 'px;height:' + h + 'px';
    if (opt.max) node.classList.add('max');

    var win = { id: opt.id, app: opt.app || opt.id, node: node, titleEl: title, onClose: opt.onClose };
    wins[opt.id] = win;
    document.getElementById('ubu-windows').appendChild(node);
    node.addEventListener('pointerdown', function () { focusWin(win); });
    head.addEventListener('dblclick', function (e) { if (!e.target.closest('button')) toggleMax(win); });
    dragify(win, head);
    focusWin(win);
    refreshDock();
    return win;
  }

  function dragify(win, head) {
    head.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button,input,a') || isMobile() || win.node.classList.contains('max')) return;
      var sx = e.clientX, sy = e.clientY, ox = win.node.offsetLeft, oy = win.node.offsetTop;
      // 拖动时屏蔽 iframe，避免鼠标被吃掉
      var frames = document.querySelectorAll('.ubu-body iframe');
      frames.forEach(function (f) { f.style.pointerEvents = 'none'; });
      head.setPointerCapture(e.pointerId);
      function mv(ev) {
        win.node.style.left = Math.max(0, Math.min(window.innerWidth - 80, ox + ev.clientX - sx)) + 'px';
        win.node.style.top = Math.max(32, Math.min(window.innerHeight - 46, oy + ev.clientY - sy)) + 'px';
      }
      function up() {
        head.removeEventListener('pointermove', mv);
        head.removeEventListener('pointerup', up);
        frames.forEach(function (f) { f.style.pointerEvents = ''; });
      }
      head.addEventListener('pointermove', mv);
      head.addEventListener('pointerup', up);
    });
  }

  function minimize(w) { w.node.classList.add('min'); w.node.classList.remove('focused'); }
  function toggleMax(w) { w.node.classList.toggle('max'); }
  function closeWin(w) {
    w.node.classList.add('closing');
    setTimeout(function () {
      w.node.remove();
      delete wins[w.id];
      refreshDock();
      if (w.onClose) w.onClose();
    }, 120);
  }

  function appWindows(app) {
    return Object.keys(wins).map(function (k) { return wins[k]; }).filter(function (w) { return w.app === app; });
  }

  // ---------- 应用 ----------
  var APPS = [
    { id: 'files', name: '文件', icon: 'files', run: function () { openFiles(); } },
    { id: 'cet4', name: '四级英语', icon: 'english', run: function () { openFiles({ section: 'cet4', label: '四级', title: '四级英语' }); } },
    { id: 'code', name: '编程学习', icon: 'code', run: function () { openFiles({ section: 'code', label: '编程', title: '编程学习' }); } },
    { id: 'post', name: '文本编辑器', icon: 'doc', hidden: true },
    { id: 'tags', name: '标签与搜索', icon: 'search', run: function () { openPage('tags', '标签与搜索', BASE + '/tag.html', 'tags'); } },
    { id: 'terminal', name: '终端', icon: 'terminal', run: function () { openTerminal(); } },
    { id: 'about', name: '关于我', icon: 'about', run: function () { openAbout(); } },
    { id: 'rss', name: 'RSS 订阅', icon: 'rss', run: function () { window.open(BASE + '/rss.xml', '_blank'); } },
    { id: 'github', name: 'GitHub', icon: 'github', run: function () { window.open('https://github.com/' + info.owner, '_blank'); } }
  ];
  function app(id) { return APPS.filter(function (a) { return a.id === id; })[0]; }

  function openPost(p) {
    var ext = el('button', { class: 'ubu-btn', title: '在新标签页打开（可评论）', html: SMALL.ext, onclick: function () { window.open(p.url, '_blank'); } });
    var frame = el('iframe', { src: p.url, title: p.title });
    return openWindow({
      id: 'post:' + p.url, app: 'post', title: p.title, w: 960, h: 680,
      headLeft: [el('button', { class: 'ubu-btn', title: '文件', html: SMALL.home, onclick: function () { openFiles(); } })],
      headRight: [ext], content: frame
    });
  }

  function openPage(id, title, url, appId) {
    var frame = el('iframe', { src: url, title: title });
    return openWindow({ id: id, app: appId || id, title: title, w: 900, h: 640, content: frame });
  }

  function openFiles(opts) {
    opts = opts || {};
    var state = { label: opts.label || null, q: '' };
    var side = el('nav', { class: 'ubu-side' });
    var grid = el('div', { class: 'ubu-grid' });
    var status = el('div', { class: 'ubu-status', text: '正在读取…' });
    var crumb = el('span', { class: 'crumb', text: '全部文章' });
    var search = el('input', { class: 'ubu-search', type: 'search', placeholder: '搜索文章…', 'aria-label': '搜索文章' });
    var root = el('div', { class: 'ubu-files' }, [side, el('div', { class: 'ubu-main' }, [
      el('div', { class: 'ubu-pathbar' }, [crumb, search]), grid, status
    ])]);

    var w = openWindow({
      // 「四级英语」「编程学习」各自是独立的窗口，只显示对应标签的文章
      id: opts.section ? 'files:' + opts.section : 'files', app: opts.section || 'files',
      title: opts.title || '文章', w: 880, h: 560, content: root,
      onReuse: function (ex) { if (opts.label !== undefined && ex.setLabel) ex.setLabel(opts.label); if (opts.focusSearch && ex.search) ex.search.focus(); }
    });
    if (w.search) return w;
    w.search = search;

    loadPosts().then(function (data) {
      function sideBtn(label, text, iconHtml) {
        var b = el('button', { onclick: function () { setLabel(label); } }, []);
        b.innerHTML = iconHtml + '<span>' + esc(text) + '</span>';
        b.dataset.label = label || '';
        return b;
      }
      side.appendChild(sideBtn(null, '全部文章', SMALL.doc));
      var names = Object.keys(data.labels);
      if (names.length) {
        side.appendChild(el('h6', { text: '标签' }));
        names.forEach(function (l) {
          side.appendChild(sideBtn(l, l, '<span class="dot" style="background:' + esc(data.labels[l]) + '"></span>'));
        });
      }
      function setLabel(l) { state.label = l; render(); }
      w.setLabel = setLabel;

      function render() {
        side.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', (b.dataset.label || null) === state.label); });
        var named = opts.title && state.label === opts.label;
        crumb.textContent = named ? opts.title : state.label || '全部文章';
        w.titleEl.textContent = named ? opts.title : state.label ? '标签：' + state.label : '文章';
        var q = state.q.toLowerCase();
        var list = data.posts.filter(function (p) {
          return (!state.label || p.labels.indexOf(state.label) >= 0) && (!q || p.title.toLowerCase().indexOf(q) >= 0);
        });
        grid.innerHTML = '';
        list.forEach(function (p) {
          var b = el('button', { class: 'ubu-file', title: p.title + '\n' + p.date + (p.labels.length ? '\n' + p.labels.join(', ') : '') });
          b.innerHTML = ICON.doc + '<span class="name">' + esc(p.title) + '</span><span class="meta">' + esc(p.date) + '</span>';
          // 桌面上双击打开，手机上单击打开
          b.addEventListener('dblclick', function () { openPost(p); });
          b.addEventListener('click', function () { if (isMobile() || matchMedia('(pointer: coarse)').matches) openPost(p); });
          b.addEventListener('keydown', function (e) { if (e.key === 'Enter') openPost(p); });
          grid.appendChild(b);
        });
        if (!list.length) grid.appendChild(el('div', { class: 'ubu-empty', text: data.posts.length ? '没有找到匹配的文章' : '这里还没有文章' }));
        status.textContent = list.length + ' 篇文章' + (isMobile() ? '' : '　·　双击打开');
      }
      search.addEventListener('input', function () { state.q = search.value.trim(); render(); });
      render();
      if (opts.focusSearch) search.focus();
    });
    return w;
  }

  function openAbout() {
    var box = el('div', { class: 'ubu-about' });
    function fill(sub, count) {
      var home = location.origin + BASE + '/';
      box.innerHTML =
        '<img src="' + esc(info.avatar) + '" alt="">' +
        '<h2>' + esc(info.title) + '</h2>' +
        '<p>' + esc(sub || ' ') + '</p>' +
        '<div class="ubu-rows">' +
        '<div><span>文章</span><span>' + count + ' 篇</span></div>' +
        '<div><span>GitHub</span><span><a href="https://github.com/' + esc(info.owner) + '" target="_blank">@' + esc(info.owner) + '</a></span></div>' +
        '<div><span>主页</span><span><a href="' + esc(home) + '">' + esc(home.replace(/^https?:\/\//, '')) + '</a></span></div>' +
        '<div><span>订阅</span><span><a href="' + esc(BASE) + '/rss.xml" target="_blank">RSS</a></span></div>' +
        '<div><span>系统</span><span>Ubuntu 26.04 LTS（主题）· Gmeek</span></div>' +
        '</div>';
    }
    fill(info.sub, '…');
    loadPosts().then(function (d) { fill(info.sub, d.posts.length); });
    return openWindow({ id: 'about', title: '关于', w: 440, h: 560, content: box });
  }

  // ---------- 终端 ----------
  function openTerminal() {
    var user = (info.owner || 'user').toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';
    var term = el('div', { class: 'ubu-term', tabindex: '0' });
    var prompt = '<span class="p1">' + esc(user) + '@ubuntu</span>:<span class="p2">~</span>$ ';
    var history = [], hi = 0;
    function out(s) { term.insertBefore(el('div', { html: s }), line); term.scrollTop = term.scrollHeight; }
    var input = el('input', { 'aria-label': '终端输入', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    var line = el('div', { html: prompt }, [input]);
    term.appendChild(line);
    term.addEventListener('click', function () { input.focus(); });

    out('<span class="dim">欢迎使用 ' + esc(info.title) + ' (Ubuntu 26.04 LTS 主题)</span>');
    out('<span class="dim">输入 </span><span class="o">help</span><span class="dim"> 查看可用命令。</span>\n');

    function run(cmd) {
      var parts = cmd.trim().split(/\s+/), c = parts[0], arg = parts.slice(1).join(' ');
      if (!c) return;
      switch (c) {
        case 'help':
          out('ls              列出文章\ncat &lt;编号|标题&gt;  打开文章\ntags            列出标签\nsearch &lt;关键词&gt;  搜索文章\nwhoami          关于我\nneofetch        系统信息\ntheme           切换深浅色\ndate            当前时间\nclear           清屏\nexit            关闭终端');
          break;
        case 'ls':
          loadPosts().then(function (d) {
            out(d.posts.length ? d.posts.map(function (p, i) { return '<span class="o">' + (i + 1) + '</span>  ' + esc(p.date) + '  ' + esc(p.title); }).join('\n') : '（空）');
          });
          break;
        case 'cat': case 'open': case 'less':
          loadPosts().then(function (d) {
            var n = parseInt(arg, 10), p = (n > 0 && d.posts[n - 1]) || d.posts.filter(function (x) { return x.title === arg; })[0] ||
              d.posts.filter(function (x) { return arg && x.title.toLowerCase().indexOf(arg.toLowerCase()) >= 0; })[0];
            if (p) { out('正在打开 ' + esc(p.title) + ' …'); openPost(p); } else out(esc(c) + ': ' + esc(arg || '') + ': 没有那个文件');
          });
          break;
        case 'tags':
          loadPosts().then(function (d) { var t = Object.keys(d.labels); out(t.length ? t.map(esc).join('  ') : '（还没有标签）'); });
          break;
        case 'search': case 'grep':
          loadPosts().then(function (d) {
            var q = arg.toLowerCase(), r = d.posts.map(function (p, i) { return [p, i]; }).filter(function (x) { return q && x[0].title.toLowerCase().indexOf(q) >= 0; });
            out(r.length ? r.map(function (x) { return '<span class="o">' + (x[1] + 1) + '</span>  ' + esc(x[0].title); }).join('\n') : '没有结果');
          });
          break;
        case 'whoami': out(esc(info.title) + (info.sub ? ' — ' + esc(info.sub) : '')); openAbout(); break;
        case 'neofetch': case 'fastfetch':
          loadPosts().then(function (d) {
            var logo = ['            .-/+oossssoo+/-.', '        `:+ssssssssssssssssss+:`', '      -+ssssssssssssssssssyyssss+-', '    .ossssssssssssssssssdMMMNysssso.', '   /ssssssssssshdmmNNmmyNMMMMhssssss/', '  +ssssssssshmydMMMMMMMNddddyssssssss+', ' /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/', '.ssssssssdMMMNhsssssssssshNMMMdssssssss.', '+sssshhhyNMMNyssssssssssssyNMMMysssssss+', 'ossyNMMMNyMMhsssssssssssssshmmmhssssssso'];
            var infoLines = ['<span class="p1">' + esc(user) + '</span>@<span class="p1">ubuntu</span>', '-----------------', '<span class="o">OS</span>: Ubuntu 26.04 LTS (主题)', '<span class="o">Blog</span>: ' + esc(info.title), '<span class="o">Engine</span>: Gmeek', '<span class="o">Posts</span>: ' + d.posts.length, '<span class="o">Tags</span>: ' + Object.keys(d.labels).length, '<span class="o">Shell</span>: bash (网页版)', '<span class="o">Theme</span>: Yaru-' + (currentMode() === 'dark' ? 'dark' : 'light'), ''];
            out(logo.map(function (l, i) { return '<span class="o">' + esc((l + '                                        ').slice(0, 42)) + '</span>' + (infoLines[i] || ''); }).join('\n'));
          });
          break;
        case 'theme': setMode(currentMode() === 'dark' ? 'light' : 'dark'); out('已切换到' + (currentMode() === 'dark' ? '深色' : '浅色') + '模式'); break;
        case 'date': out(esc(new Date().toString())); break;
        case 'clear': Array.prototype.slice.call(term.children).forEach(function (n) { if (n !== line) n.remove(); }); break;
        case 'exit': closeWin(w); break;
        case 'sudo': out('无法以 root 身份运行：这只是一个博客 :)'); break;
        case 'echo': out(esc(arg)); break;
        case 'pwd': out('/home/' + esc(user)); break;
        case 'cd': break;
        default: out(esc(c) + ': 未找到命令，输入 help 查看帮助');
      }
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var v = input.value; input.value = '';
        out(prompt + esc(v));
        if (v.trim()) { history.push(v); hi = history.length; }
        run(v);
      } else if (e.key === 'ArrowUp') { if (hi > 0) input.value = history[--hi]; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { hi = Math.min(history.length, hi + 1); input.value = history[hi] || ''; e.preventDefault(); }
      else if (e.key === 'l' && e.ctrlKey) { run('clear'); e.preventDefault(); }
    });
    var w = openWindow({ id: 'terminal', title: user + '@ubuntu: ~', w: 760, h: 460, content: term });
    setTimeout(function () { input.focus(); }, 50);
    return w;
  }

  // ---------- Dock / 顶栏 / 概览 ----------
  var DOCK = ['files', 'cet4', 'code', 'tags', 'terminal', 'about', 'rss', 'github'];
  function refreshDock() {
    var running = {};
    Object.keys(wins).forEach(function (k) { running[wins[k].app] = true; });
    document.querySelectorAll('.ubu-dock-item').forEach(function (b) {
      b.classList.toggle('running', !!running[b.dataset.app]);
    });
  }
  function launch(id) {
    var ws = appWindows(id);
    if (ws.length) {
      var w = ws[ws.length - 1];
      if (w.node.classList.contains('focused') && !w.node.classList.contains('min')) minimize(w);
      else focusWin(w);
    } else app(id).run();
    hideOverview();
  }

  function buildShell() {
    html.classList.add('ubu-shell');

    var clock = el('div', { id: 'ubu-clock' });
    function tick() {
      var d = new Date();
      clock.textContent = (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    tick(); setInterval(tick, 10000);

    var themeBtn = el('button', { class: 'ubu-pill', id: 'ubu-tray', title: '切换深色/浅色', onclick: function () { setMode(currentMode() === 'dark' ? 'light' : 'dark'); } });
    themeBtn.innerHTML = SMALL.net + SMALL.vol + '<span id="ubu-theme"></span>' + SMALL.power;
    var top = el('header', { id: 'ubu-top' }, [
      el('button', { class: 'ubu-pill', id: 'ubu-activities', title: '活动', html: '<span class="dots"><i></i><i></i><i></i></span>', onclick: toggleOverview }),
      clock, themeBtn
    ]);

    var dock = el('nav', { id: 'ubu-dock', 'aria-label': 'Dock' });
    DOCK.forEach(function (id) {
      var a = app(id);
      var b = el('button', { class: 'ubu-dock-item', title: a.name, 'aria-label': a.name, onclick: function () { launch(id); } });
      b.dataset.app = id;
      b.innerHTML = ICON[a.icon] + '<span class="tip">' + esc(a.name) + '</span>';
      dock.appendChild(b);
    });
    var postBtn = el('button', { class: 'ubu-dock-item', title: '文本编辑器', 'aria-label': '已打开的文章', onclick: function () {
      var ws = appWindows('post'); if (ws.length) focusWin(ws[ws.length - 1]);
    } });
    postBtn.dataset.app = 'post';
    postBtn.innerHTML = ICON.doc + '<span class="tip">已打开的文章</span>';
    postBtn.style.display = 'none';
    dock.appendChild(postBtn);
    dock.appendChild(el('div', { class: 'sep' }));
    var appsBtn = el('button', { class: 'ubu-dock-item', title: '显示应用', 'aria-label': '显示应用', onclick: toggleOverview });
    appsBtn.innerHTML = ICON.apps + '<span class="tip">显示应用</span>';
    dock.appendChild(appsBtn);

    var desk = el('div', { id: 'ubu-desktop' });
    [['files', '文章', 'folderOrange'], ['cet4', '四级英语', 'english'], ['code', '编程学习', 'code'], ['tags', '标签', 'folder'], ['about', '关于我', 'about'], ['terminal', '终端', 'terminal']].forEach(function (d) {
      var b = el('button', { class: 'ubu-desk-icon', onclick: function () { if (isMobile()) launch(d[0]); }, ondblclick: function () { launch(d[0]); } });
      b.innerHTML = ICON[d[2]] + '<span>' + d[1] + '</span>';
      desk.appendChild(b);
    });

    document.body.appendChild(top);
    document.body.appendChild(dock);
    document.body.appendChild(desk);
    document.body.appendChild(el('div', { id: 'ubu-windows' }));
    document.body.appendChild(buildOverview());
    setMode(localStorage.getItem('meek_theme') === 'auto' ? 'auto' : currentMode());

    // 文章窗口出现时在 Dock 上显示一个图标
    var _refresh = refreshDock;
    refreshDock = function () { _refresh(); postBtn.style.display = appWindows('post').length ? '' : 'none'; };

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideOverview();
      if (e.key === 'Meta' || e.key === 'OS') toggleOverview();
    });
  }

  var overview;
  function buildOverview() {
    var search = el('input', { class: 'search', type: 'search', placeholder: '输入以搜索文章…', 'aria-label': '搜索' });
    var apps = el('div', { class: 'apps' });
    var results = el('div', { class: 'results' });
    APPS.filter(function (a) { return !a.hidden; }).forEach(function (a) {
      var b = el('button', { onclick: function () { launch(a.id); } });
      b.innerHTML = ICON[a.icon] + '<span>' + esc(a.name) + '</span>';
      apps.appendChild(b);
    });
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      apps.style.display = q ? 'none' : '';
      results.style.display = q ? 'block' : 'none';
      if (!q) return;
      loadPosts().then(function (d) {
        results.innerHTML = '';
        var hits = d.posts.filter(function (p) { return p.title.toLowerCase().indexOf(q) >= 0; }).slice(0, 12);
        hits.forEach(function (p) {
          var b = el('button', { onclick: function () { hideOverview(); openPost(p); } });
          b.innerHTML = ICON.doc + '<span>' + esc(p.title) + '<br><small style="opacity:.6">' + esc(p.date) + '</small></span>';
          results.appendChild(b);
        });
        if (!hits.length) results.appendChild(el('div', { style: 'text-align:center;opacity:.7;padding:16px', text: '没有找到匹配的文章' }));
      });
    });
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var f = results.querySelector('button'); if (f) f.click(); }
    });
    overview = el('div', { id: 'ubu-overview', onclick: function (e) { if (e.target === overview) hideOverview(); } }, [search, apps, results]);
    overview.search = search;
    return overview;
  }
  function toggleOverview() {
    if (overview.classList.contains('on')) return hideOverview();
    overview.classList.add('on');
    document.getElementById('ubu-activities').classList.add('on');
    overview.search.value = ''; overview.search.dispatchEvent(new Event('input'));
    setTimeout(function () { overview.search.focus(); }, 30);
  }
  function hideOverview() {
    if (!overview) return;
    overview.classList.remove('on');
    var a = document.getElementById('ubu-activities'); if (a) a.classList.remove('on');
  }

  function bootSplash(done) {
    var seen = false;
    try { seen = sessionStorage.getItem('ubu_booted'); sessionStorage.setItem('ubu_booted', '1'); } catch (e) {}
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
    var boot = el('div', { id: 'ubu-boot', html: (info.avatar ? '<img src="' + esc(info.avatar) + '" alt="">' : '') +
      '<div class="name">' + esc(info.title) + '</div><div class="spin"><i></i><i></i><i></i><i></i><i></i></div>' });
    document.body.appendChild(boot);
    setTimeout(function () { boot.classList.add('done'); done(); setTimeout(function () { boot.remove(); }, 500); }, 1500);
  }

  // ---------- 启动 ----------
  function start() {
    buildShell();

    if (isIndex) {
      bootSplash(function () {});
      openFiles();
    } else {
      // 直接打开的文章页 / 标签页：把原页面放进一个最大化的窗口
      var page = el('div', { class: 'ubu-page' });
      ['header', 'content', 'footer'].forEach(function (id) {
        var n = document.getElementById(id);
        if (n) page.appendChild(n);
      });
      var holder = el('div', { class: 'markdown-host' }, [page]);
      openWindow({
        id: isPost ? 'post:' + location.pathname : 'tags', app: isPost ? 'post' : 'tags',
        title: document.title, max: true, content: holder,
        headLeft: [el('button', { class: 'ubu-btn', title: '回到桌面', html: SMALL.home, onclick: function () { location.href = BASE + '/'; } })],
        onClose: function () { location.href = BASE + '/'; }
      });
    }
    html.classList.add('ubu-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
