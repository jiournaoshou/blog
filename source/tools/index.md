---
title: 工具
layout: page
permalink: tools/index.html
description: 几个在浏览器里就能跑完的小工具，纯本地处理，不联网、不登录。
---

```
$ ls ~/tools
```

都是单文件 HTML，打开就能用。没有账号，没有广告，不加任何统计脚本——你把网线拔了它们照样工作。

<div class="tool-grid">

  <div class="tool-item">
    <p class="tool-item-title"><a href="/blog/tools/word-number/">Word 数字查找与修改</a></p>
    <p class="tool-item-desc">把 .docx 拖进浏览器，点黄色底数字就能就地改，导出的文档除了数字之外一个字节都不动。</p>
    <p class="tool-item-meta"><span class="ps1">~$</span> open /tools/word-number-tool/</p>
  </div>

  <div class="tool-item">
    <p class="tool-item-title"><a href="/blog/tools/kemu1/">科目一刷题练习器</a></p>
    <p class="tool-item-desc">4858 道科目一真题内嵌在一个 HTML 里，点选项立即判对错，带解析、错题本和 45 分钟模拟考。</p>
    <p class="tool-item-meta"><span class="ps1">~$</span> open /tools/kemu1-tool/</p>
  </div>

</div>

<div class="tool-back">
  <a href="/blog/">← 返回首页</a>
</div>

<style>
.tool-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin: 1.8em 0;
}
.tool-item {
  border: 1px solid var(--c-line);
  border-radius: var(--r);
  padding: 16px 18px;
  background: var(--c-bg-soft);
  transition: border-color .12s;
}
.tool-item:hover { border-color: var(--c-accent-dk); }
.tool-item-title { margin: 0 0 8px; font-size: 15.5px; font-weight: 600; }
.tool-item-title a { color: var(--c-accent); border-bottom: none; }
.tool-item-title a:hover { border-bottom: 1px solid var(--c-accent); }
.tool-item-desc { margin: 0 0 10px; font-size: 13.5px; color: var(--c-text-dim); line-height: 1.7; }
.tool-item-meta { margin: 0; font-size: 12.5px; color: var(--c-text-mute); }
.tool-item-meta .ps1 { color: var(--c-accent-dk); }
.tool-back { margin-top: 3em; font-size: 13px; }
.tool-back a { color: var(--c-text-mute); }
.tool-back a:hover { color: var(--c-accent); }
</style>
