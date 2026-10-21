---
title: Word 数字查找与修改
layout: page
description: 把 .docx 拖进浏览器，点黄色底数字就能就地改，导出的文档除了数字之外一个字节都不动。
---

```
$ ./word-number --help
```

改 Word 里的数字，听起来像三分钟的事。但真上手会发现：Word 自带的查找替换会把数字顺带改掉格式，或者不动声色地动到别的样式；用脚本批量改，改到后面往往发现字体、表格边框、图片全都挪了位。

这个工具只做一件事：**只动数字，别的都不碰。**

<div class="tool-card">
  <p class="tool-card-line"><span class="ps1">~$</span> open /tools/word-number-tool/</p>
  <p><a class="tool-open" href="/blog/tools/word-number-tool/">打开工具 →</a></p>
  <p class="tool-card-note">单文件 HTML，纯本地运行，文档不上传任何服务器。</p>
</div>

## 它能做什么

- **点数字改**：文档里的数字全部用黄色底标出，点一下就能就地修改，回车确认、Esc 取消。
- **批量替换**：默认按「完整数字」匹配，改 `41` 不会误伤 `411` 或 `2024`。勾选「包含匹配」才按片段匹配。
- **可撤销**：改错了随时撤回来，有完整的修改记录。
- **无损导出**：导出时只改动数字本身，原文档的字体、字号、表格边框、图片全部保持原样。

## 它怎么做到的

Word 的 `.docx` 本质上是个 zip，里面是一堆 XML。这个工具在浏览器里直接解压、定位到文本节点、只替换数字部分，再把 zip 重新打回去。

所以：

- 不需要安装任何软件，双击 HTML 就能用
- 不需要联网，断网也能跑
- 文件不出你的电脑

## 适用场景

改论文的页码、批量订正编号、修正日期……任何「格式已经调好、只有数字写错了」的场合，用它比在 Word 里小心翼翼地替换安全得多。

<div class="tool-back">
  <a href="/blog/">← 返回首页</a>
</div>

<style>
.tool-card {
  border: 1px solid var(--c-line);
  border-radius: var(--r);
  padding: 18px 20px;
  margin: 1.8em 0;
  background: var(--c-bg-soft);
}
.tool-card-line { font-size: 13.5px; color: var(--c-text-dim); margin: 0 0 12px; }
.tool-card-note { font-size: 12.5px; color: var(--c-text-mute); margin: 10px 0 0; }
.tool-open {
  display: inline-block;
  padding: 7px 16px;
  border: 1px solid var(--c-accent-dk);
  border-radius: var(--r);
  color: var(--c-accent);
  font-size: 14px;
  transition: border-color .12s, background .12s;
}
.tool-open:hover { border-color: var(--c-accent); background: rgba(61, 220, 132, .07); }
.tool-back { margin-top: 3em; font-size: 13px; }
.tool-back a { color: var(--c-text-mute); }
.tool-back a:hover { color: var(--c-accent); }
</style>
