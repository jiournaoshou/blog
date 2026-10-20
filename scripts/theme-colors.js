'use strict';

// 生成主题配色变量表。
// 放在站点层（而不是主题层）：站点脚本在 Hexo 初始化阶段就会加载，
// 这样 generator 能稳定地先于生成阶段注册好。
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

function hex2rgb(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  var n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgb2hex(a) {
  function s(v) {
    var h = Math.max(0, Math.min(255, Math.round(v))).toString(16);
    return h.length < 2 ? '0' + h : h;
  }
  return '#' + s(a[0]) + s(a[1]) + s(a[2]);
}

function mix(hex, toward, k) {
  var a = hex2rgb(hex);
  var b = hex2rgb(toward);
  if (!a || !b) return hex;
  return rgb2hex([
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k
  ]);
}

// 极简 YAML 读取：只认 key: "value" 这种扁平行，足够读主题 _config.yml 的配色项
function readThemeConfig(hexo) {
  var file = path.join(hexo.theme_dir, '_config.yml');
  var cfg = {};
  try {
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach(function (line) {
      var m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
      if (!m) return;
      var v = m[2].trim().replace(/\s+#.*$/, '');
      v = v.replace(/^["']|["']$/g, '');
      if (v !== '') cfg[m[1]] = v;
    });
  } catch (e) {
    hexo.log.warn('[tty] 读取主题配置失败：' + e.message);
  }
  return cfg;
}

hexo.extend.generator.register('tty_theme_css', function () {
  var t = readThemeConfig(this);
  var accent = t.theme_color || '#3ddc84';
  var bg = t.bg_color || '#0b0d0c';
  var text = t.text_color || '#c8ccc9';

  var vars = {
    '--c-accent': accent,
    '--c-accent-dk': mix(accent, bg, 0.45),
    '--c-bg': bg,
    '--c-bg-soft': mix(bg, text, 0.04),
    '--c-bg-raise': mix(bg, text, 0.08),
    '--c-line': mix(bg, text, 0.14),
    '--c-line-soft': mix(bg, text, 0.08),
    '--c-text': text,
    '--c-text-dim': mix(text, bg, 0.33),
    '--c-text-mute': mix(text, bg, 0.6),
    '--fs': t.font_size || '15px',
    '--lh': String(t.line_height || 1.75),
    '--w': t.container_width || '760px',
    '--r': t.radius || '2px'
  };

  var body = ':root{\n' + Object.keys(vars).map(function (k) {
    return '  ' + k + ': ' + vars[k] + ';';
  }).join('\n') + '\n}\n';

  var sig = crypto.createHash('md5').update(body).digest('hex').slice(0, 8);

  var themeCssRel = 'css/theme-' + sig + '.css';
  hexo.locals.set('tty_theme_css', themeCssRel);
  hexo.theme.config.__css = themeCssRel;

  return [{
    path: themeCssRel,
    data: body,
    layout: false
  }];
});
