/* tty.js — 主题里那一点点必要的 JS
 * 原则：没有它页面也能正常阅读；不用框架；不请求任何外部资源。
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. 代码块复制按钮 ------------------------------------------------ */
  function addCopyButtons() {
    var blocks = document.querySelectorAll('figure.highlight');
    Array.prototype.forEach.call(blocks, function (fig) {
      if (fig.querySelector('.copy-btn')) return;
      var codeEl = fig.querySelector('.code pre') || fig.querySelector('pre');
      if (!codeEl) return;

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', '复制代码');

      btn.addEventListener('click', function () {
        var text = codeEl.innerText.replace(/\n$/, '');
        var done = function () {
          btn.textContent = 'copied';
          btn.classList.add('done');
          setTimeout(function () {
            btn.textContent = 'copy';
            btn.classList.remove('done');
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = '失败'; }
          document.body.removeChild(ta);
        }
      });

      fig.appendChild(btn);
    });
  }

  /* 2. 首页标题打字机（需在主题配置里显式打开） ----------------------- */
  function typewriter() {
    var el = document.querySelector('[data-typing]');
    if (!el || reduceMotion) return;
    var full = el.getAttribute('data-typing');
    var i = 0;
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '█';

    el.textContent = '';
    el.appendChild(cursor);

    function tick() {
      if (i >= full.length) { return; }
      cursor.insertAdjacentText('beforebegin', full.charAt(i));
      i += 1;
      setTimeout(tick, 55 + Math.random() * 70);
    }
    setTimeout(tick, 260);
  }

  /* 3. 正文标题锚点（悬停出现 #，方便引用） --------------------------- */
  function headingAnchors() {
    var heads = document.querySelectorAll('.prose h2[id], .prose h3[id]');
    Array.prototype.forEach.call(heads, function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'anchor';
      a.setAttribute('aria-label', '本节链接');
      a.textContent = '#';
      a.style.cssText = 'opacity:0;margin-left:.6em;font-weight:400;color:var(--c-text-mute);border:0';
      h.appendChild(a);
      h.addEventListener('mouseenter', function () { a.style.opacity = '1'; });
      h.addEventListener('mouseleave', function () { a.style.opacity = '0'; });
    });
  }

  /* 4. 键盘快捷键：g h 回首页 --------------------- */
  function keys() {
    var buf = '';
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;
      buf = (buf + e.key.toLowerCase()).slice(-2);
      if (buf === 'gh') {
        var brand = document.querySelector('.brand');
        if (brand) location.href = brand.href;
      }
    });
  }

  /* 5. 终端风格的“代码块标题栏” -------------------------------------- */
  /* Hexo 的 figure.highlight 里是 <table>，原生不支持 ::before，
     所以补一个真实的 .term-bar 元素，用 flex 换掉 table 的垂直对齐。 */
  function terminalBars() {
    var blocks = document.querySelectorAll('figure.highlight');
    Array.prototype.forEach.call(blocks, function (fig) {
      if (fig.querySelector('.term-bar')) return;
      var bar = document.createElement('div');
      bar.className = 'term-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = '<i></i><i></i><i></i>';
      fig.insertBefore(bar, fig.firstChild);
      fig.classList.add('has-term-bar');
    });
  }

  function init() {
    terminalBars();
    addCopyButtons();
    typewriter();
    headingAnchors();
    keys();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
