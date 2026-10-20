'use strict';

// hexo-generator-feed 把 generator 写死成 'Hexo'，不支持配置项。
// 做法：包装 site 的 after_generate 时机——直接在生成器输出上做替换，
// 用 generator 的 after 钩子把 atom.xml 的 generator 标签抹掉。
var fs = require('fs');
var path = require('path');

hexo.extend.filter.register('before_exit', function () {
  var file = path.join(hexo.public_dir, 'atom.xml');
  if (!fs.existsSync(file)) return;

  var xml = fs.readFileSync(file, 'utf8');
  var cleaned = xml.replace(/<generator[^>]*>[\s\S]*?<\/generator>\s*/g, '');

  if (cleaned !== xml) {
    fs.writeFileSync(file, cleaned, 'utf8');
    hexo.log.info('[strip-feed-generator] 已移除 RSS 中的 generator 标签');
  }
}, 100);
