# geek-blog

Hexo 8 + 自写主题 `tty` 的个人博客。

设计上的取舍就一句话：**能不用就不加**。不用前端框架、不引 CDN、不加载网络字体、不加载任何分析或追踪脚本，关掉 JavaScript 也基本能正常阅读。

---

## 一、先跑起来

本机需要 Node.js 18+（当前用的是 v24）和 pnpm（或 npm）。

```bash
# 进入项目目录
cd geek-blog

# 安装依赖
pnpm install

# 本地预览：http://localhost:4000
pnpm run server
```

改文章时 `hexo server` 会热更新，保存立刻可见。
生成静态文件：

```bash
pnpm run build        # 输出到 public/
```

> 备注：用 `npm install` 在这个项目上会报 `Cannot read properties of null (reading 'children')`，
> 那是 npm 11 自己的 arborist bug，不是项目问题。用 `pnpm install` 或 `npm install --legacy-peer-deps` 都可以。

---

## 二、第一件要做的事：改成你自己

### 1. 站点信息 `_config.yml`

```yaml
title: 你的名字              # 首页字标就是这个标题生成的
subtitle: 写代码，也写点别的
description: 一个人的技术笔记与生活记录。
author: 你的名字
url: https://你的域名        # 部署后一定要改，RSS 和 SEO 都依赖它
```

### 2. 主题信息 `themes/tty/_config.yml`

```yaml
bio: "一句话介绍自己"        # 显示在首页 whoami 下面
menu:                       # 导航，想加就加
  文章: /archives/
  标签: /tags/
  关于: /about/
since: 2024                 # 页脚版权起始年份
icp: ""                     # 国内服务器备案号，没有就留空
```

### 3. 关于页 `source/about/index.md`

里面有个占位邮箱 `you@example.com`，记得改成你自己的。

### 4. 示例文章

`source/_posts/` 里有三篇示例文章，读完可以直接删：

```bash
rm source/_posts/2026-08-14-rsync-backup.md source/_posts/2026-09-02-hexo-static-blog.md source/_posts/2026-09-27-tcpdump-timeout.md
```

---

## 三、写文章

```bash
pnpm run new "文章标题"
```

会在 `source/_posts/` 生成 `YYYY-MM-DD-文章标题.md`，front matter 长这样：

```yaml
---
title: 文章标题
date: 2026-10-20 13:40:00
categories:
  - 折腾
tags:
  - hexo
  - css
description: 一句话摘要，会显示在列表页和搜索引擎结果里
---
```

几个可选项（都可省略）：

| 字段 | 作用 |
| --- | --- |
| `pin: true` | 列表页标题后加一个 `*` 标记（仅视觉，不改变排序） |
| `toc: false` | 关闭文章顶部的可折叠目录 |
| `updated: 2026-10-21` | 显示"更新于" |

写作时用到的 Markdown 语法：标准语法都支持，代码块用三反引号加语言名（`bash` / `js` / `go` / `yaml` ...），表格、引用、脚注、任务列表都正常。

> 新的图片引用方式是 `post_asset_folder: true`：`pnpm run new "标题"` 时会自动建同名目录，图片放进去，文章里用 `![](图片名.png)` 引用即可。

---

## 四、改外观

全部集中在 `themes/tty/_config.yml`：

```yaml
theme_color: "#3ddc84"   # 主色。想换就改这一行，整站跟着变
bg_color:   "#0b0d0c"    # 背景
text_color: "#c8ccc9"    # 正文
font_size:  15px
container_width: 760px
radius: 2px              # 0 = 完全直角，更硬核

banner: true             # 首屏 ASCII 字标
banner_font: block       # block | slim | mini
scanline: false          # CRT 扫描线，慎开
grain: false             # 噪点
typewriter: false        # 首页 whoami 打字机效果
```

改完执行 `pnpm run build` 即可，配色变量是构建时从配置里算出来的，不需要动 CSS。

**几套配色备选**（把 `theme_color` / `bg_color` 换成下面任意一组）：

| 风格 | theme_color | bg_color |
| --- | --- | --- |
| 终端绿（默认） | `#3ddc84` | `#0b0d0c` |
| Amber 琥珀 | `#f0a52c` | `#0d0b08` |
| 冰蓝 | `#6cb6ff` | `#0a0d11` |
| 纸白（浅色） | `#1a7f4b` | `#f4f4f0`（同时把 text_color 改成 `#1c1f1d`） |

**换字体**：编辑 `themes/tty/source/css/style.css` 里的 `--f-mono`，把想用的字体名放到最前面。注意不要用 CDN 引网络字体——那是这个主题故意不做的事。

---

## 五、评论

默认关闭，不内置任何第三方评论（这是"去 AI 感 / 去模板感"的一部分：不留一堆没用到的社交组件）。

想开的话，用 giscus（基于 GitHub Discussions，无广告、无追踪）：

1. 建一个 public 仓库，在 Settings → General → Features 里打开 **Discussions**
2. 装 [giscus App](https://github.com/apps/giscus)，授权给这个仓库
3. 打开 <https://giscus.app/zh-CN>，填仓库名，复制生成的 `data-repo-id` / `data-category-id`
4. 填到 `themes/tty/_config.yml`：

```yaml
comments:
  provider: giscus
  giscus:
    repo: "你的用户名/仓库名"
    repo_id: "R_xxxx"
    category: "Announcements"
    category_id: "DIC_xxxx"
```

---

## 六、部署

生成出来的 `public/` 是纯静态文件，扔哪都能跑。国内访问为主的话，**EdgeOne Pages 是首选**。

### 方案 A：EdgeOne Pages（腾讯云，国内访问最稳，推荐）

免费版长期开放，静态加速流量和请求额度不限量，平台级 HTTPS 自动配，用的是腾讯的边缘节点。

> **先明确一个坑**：EdgeOne Pages 的**项目域名（平台送的二级域名）不能当长期站点用**。
> 官方文档写得很清楚——加速区域选「中国大陆」或「全球（含大陆）」时，项目域名只能拿到一个
> **有效期 3 小时**的预览链接，过期返回 401；选「全球（不含大陆）」时大陆网络直接返回 401。
> 也就是说：**想国内访问，就必须绑自己的域名并完成工信部备案**。这条没有捷径。
> （来源：[EdgeOne Pages 域名管理文档](https://edgeone.cloud.tencent.com/pages/document/162936836982489088)）

所以路线要按你的实际情况二选一：

**路线 1：有备案域名 → EdgeOne Pages 国内加速（最佳体验）**

1. 打开 <https://console.cloud.tencent.com/edgeone/pages>，用微信/QQ 登录，按提示开通免费版
2. 「导入 Git 仓库」→ 授权 GitHub → 选你的博客仓库
3. 加速区域选「中国大陆可用区」，构建设置按下表（根目录的 `edgeone.json` 会自动读取并覆盖）：

   | 项 | 值 |
   | --- | --- |
   | 构建命令 | `pnpm run clean-build` |
   | 输出目录 | `public` |
   | 安装命令 | `pnpm install --frozen-lockfile` |
   | Node 版本 | `22.11.0`（平台预装版本） |

4. 部署完成后到「域名管理」→ 添加自定义域名 → 到注册商加 CNAME 记录（备案号要在腾讯云控制台填）
5. 把 `_config.yml` 的 `url` 改成你的域名

**路线 2：暂时没有域名 → GitHub Pages 当主力（免费、能长期用）**

直接用下面的方案 B。GitHub Pages 的 `<用户名>.github.io` 在国内大多数网络能打开，只是速度一般。
等以后有了域名，再迁到 EdgeOne 也不迟——两边都是同一套静态文件，迁正是「改个 url + 绑个域名」的事。

> 如果构建机没有 pnpm，安装命令换成 `npx pnpm@11 install --frozen-lockfile`，构建命令换成 `npx pnpm@11 run clean-build`。

**上线后一定要做**：把 `_config.yml` 的 `url` 改成平台给的域名（或你的自定义域名），否则 RSS 里的链接和分享出去的卡片地址会指向 localhost。

```yaml
url: https://xxx.edgeone.app
```

**以后加自己的域名**：EdgeOne Pages 项目 → 域名管理 → 添加自定义域名 → 按提示到域名注册商加一条 CNAME 记录。平台会自动签发 HTTPS 证书。国内域名备案与否，平台会在设置里提示。

### 方案 B：GitHub Pages（海外访问，免费）

项目里的 `.github/workflows/deploy.yml` 已经写好了，推代码就自动构建发布，不用装 `hexo-deployer-git`。

1. 仓库 → Settings → Pages → Source 选 **GitHub Actions**
2. 把 `_config.yml` 的 `url` 改成 `https://你的用户名.github.io/博客仓库名/`（如果是 `<用户名>.github.io` 仓库则不带路径）
3. `git push` 到 `main` 分支

> 限制：只有公开仓库免费，带宽软上限 100 GB/月，国内访问速度一般但通常可达。

### 方案 C：Cloudflare Pages（海外，无限带宽）

连上 GitHub 仓库，构建设置：

- 构建命令：`pnpm run clean-build`
- 输出目录：`public`
- 环境变量：`NODE_VERSION=24`

免费版静态带宽不限量、100 个项目、每月 500 次构建。国内访问看运气，适合当海外镜像。

> **Vercel 不太推荐**：Hobby 免费版只允许非商用个人用途，而且条款里默认允许用它家的数据分析页面内容——对一个强调零追踪的博客来说有点讽刺。国内访问本身也不稳。

### 方案 D：自己的服务器

```bash
pnpm run clean-build
rsync -avz --delete public/ 用户名@服务器:/var/www/blog/
```

Nginx 配置要点：

```nginx
server {
    listen 443 ssl http2;
    server_name blog.example.com;
    root /var/www/blog;
    index index.html;

    location / { try_files $uri $uri/ $uri.html =404; }

    error_page 404 /404.html;
}
```

`try_files` 里带 `$uri.html` 是为了让 `pretty_urls` 关掉 `.html` 后缀后仍能正确匹配。

### 托管选型对照（2026-10 核对）

| 平台 | 国内速度 | 免费额度 | 送你域名的可用性 | 适合 |
| --- | --- | --- | --- | --- |
| **EdgeOne Pages** | 好（腾讯节点） | 静态流量/请求不限量，构建次数限额 | 送的项目域名只给 3 小时预览链接，长期用**要绑已备案域名** | 有域名时的主力站 |
| **GitHub Pages** | 一般但通常可达 | 100 GB/月，仅公开仓库 | `<用户名>.github.io` 可直接长期用 | **没域名时的主力站** |
| Cloudflare Pages | 看运气 | 静态带宽无限，500 构建/月 | `xxx.pages.dev` 可长期用 | 海外镜像 |
| Vercel Hobby | 不稳 | 100 GB/月 | 可长期用 | 仅个人非商用 |
| Netlify | 一般 | 300 积分/月（约 15 GB 流量） | 可长期用 | 已经不划算 |
| 阿里云 / 腾讯云 OSS | 好 | 按量付费，很便宜 | 需备案域名 | 想完全自控 |

数据来源：[免费额度对比（2026-09 核对）](https://agentdeals.dev/hosting-free-tier-comparison-2026)、[Cloudflare Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)、[EdgeOne 域名管理](https://edgeone.cloud.tencent.com/pages/document/162936836982489088)。用自己的顶级域名指向境内服务器必须备案，这条绕不过去。

---

## 七、目录结构

```
geek-blog/
├── _config.yml              # 站点配置（标题、作者、URL、部署）
├── _config.example.yml      # 站点配置备份
├── edgeone.json             # EdgeOne Pages 构建配置
├── package.json
├── scaffolds/post.md        # hexo new 用到的文章模板
├── scripts/
│   └── theme-colors.js      # 构建时把主题配色转成 CSS 变量表
├── .github/workflows/
│   └── deploy.yml           # 推 main 自动发布到 GitHub Pages
├── source/
│   ├── _posts/              # 文章
│   ├── about/index.md       # 关于页
│   ├── 404.md               # 404 页（permalink: /404.html）
│   ├── tags/index.md        # 标签聚合页（layout: tags）
│   └── categories/index.md  # 分类聚合页（layout: category）
└── themes/tty/
    ├── _config.yml          # 主题配置
    ├── _config.example.yml
    ├── layout/              # EJS 模板
    │   ├── layout.ejs       # 外壳（head / 导航 / 页脚）
    │   ├── index.ejs        # 首页：终端首屏 + 文章列表
    │   ├── post.ejs         # 文章页
    │   ├── page.ejs         # 普通页面
    │   ├── archive.ejs      # 归档
    │   ├── tags.ejs         # 标签云
    │   ├── tag.ejs          # 单个标签
    │   ├── category.ejs     # 单个分类
    │   ├── 404.ejs
    │   └── _partial/
    │       ├── post-row.ejs # 列表行
    │       ├── pager.ejs    # 分页
    │       └── comments.ejs # giscus 挂载点
    └── source/
        ├── css/style.css    # 全部样式（约 600 行，无预处理器）
        ├── css/hljs.css     # 代码高亮配色
        └── js/tty.js        # 复制按钮 / 目录锚点 / 打字机
```

---

## 八、主题设计说明（为什么长这样）

- **只有一个强调色**，其余全是灰阶。主色只用在光标、提示符、链接下划线上，不铺大面积色块。
- **等宽字体贯穿全站**，包括正文。这是"极客感"的来源，也意味着中文要用支持等宽中文的字体（`Sarasa Mono SC` 优先级较高），没有就回退到系统字体。
- **零圆角、零阴影、零渐变**。分隔靠 1px 细线，层级靠文字明度（`#c8ccc9` / `#8a8d8b` / `#575958`）。
- **动效只在状态变化上出现**：链接下划线展开、光标闪烁。系统开启"减少动态"时全部关闭。
- **首屏是终端行为而不是广告牌**：`~$ whoami` 加真实身份，下面直接就是文章列表，没有大图、没有口号、没有"精选"。
- **代码块有 26px 高的标题栏**，上面只有三个小圆点，复制按钮默认透明，鼠标移上去才出现。
- **打印样式**是单独调的：去掉导航和动效，转成白底黑字，外部链接后面自动附上 URL。

---

## 九、常见问题

**改了主题配置但页面没变化？**
配色是构建时生成的，`hexo server` 下改主题配置需要重启服务。布局模板改动一般会热更新。

**想开关 CRT 扫描线 / 噪点**
`themes/tty/_config.yml` 里 `scanline: true` / `grain: true`。默认都是关的——它们很吃眼睛，开会投影时也很容易翻车。

**中文标点看着挤？**
把 `--f-mono` 里 `"Sarasa Mono SC"`（更纱黑体）放第一位，或者装一份 [更纱黑体](https://github.com/be5invis/Sarasa-Gothic) 到系统里。它的中英文宽度是严格 2:1 的，等宽排版会整齐很多。

**怎么彻底换成自己的字标？**
`layout/index.ejs` 顶部的 `GLYPHS` 表会把站点标题逐字转成方块字符；遇到中文会自动退回到纯色大字标。改 `_config.yml` 的 `title` 就行。

**推送后 EdgeOne 构建失败？**
先看构建日志里的 Node 版本。本项目用的是 pnpm，锁文件是 `pnpm-lock.yaml`，如果平台默认跑 `npm install` 会报 arborist 的 `Cannot read properties of null` —— 把安装命令改成 `pnpm install --frozen-lockfile` 即可。
