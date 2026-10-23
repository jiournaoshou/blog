---
title: Word 数字查找与修改
layout: page
permalink: tools/word-number/index.html
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

## 原字体不变

这是最容易出问题的地方，也最容易验证。

docx 里每个 run 都带一段 `<w:rPr>`，写着它的字体、字号、颜色、加粗、倾斜、下划线。工具改数字时**只替换 `<w:t>` 里的文字内容，完全不碰 `<w:rPr>`**——所以那个数字原来是什么样式，改完还是什么样式。

拿一份带复杂格式的文档实测：正文里一个**红色、倾斜的宋体 12pt** 的 `41`，改成 `88` 之后——

| 属性 | 改动前 | 改动后 |
| --- | --- | --- |
| 字体 | 宋体 | 宋体 |
| 字号 | 12pt | 12pt |
| 颜色 | `#C00000` | `#C00000` |
| 倾斜 | 是 | 是 |

整个文档解压后 17 个条目，除了 `word/document.xml` 之外**没有任何文件发生变化**；`document.xml` 内部也只有两处不同：`41` 变成 `88`，以及 XML 声明引号的写法（单引号 → 双引号，等价写法，Word 照常打开）。

标题的黑体 22pt、正文的仿宋、加粗加下划线的那一行，全部原样保留。

## 适用场景

改论文的页码、批量订正编号、修正日期……任何「格式已经调好、只有数字写错了」的场合，用它比在 Word 里小心翼翼地替换安全得多。

<div class="tool-back">
  <a href="/blog/tools/">← 返回工具列表</a> · <a href="/blog/">返回首页</a>
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
