---
title: 用 rsync 给自己做一份可恢复的备份
date: 2026-08-14 22:10:00
updated: 2026-08-15 09:02:00
categories:
  - 运维
tags:
  - rsync
  - 备份
  - 折腾
description: 不买网盘、不装客户端，用一条 rsync 命令把重要文件同步到另一块盘，并用硬链接保留历史版本。
---

家里那台旧笔记本被我拿来当 NAS 用，上面挂了一块 4T 的移动硬盘。真正需要备份的数据其实不多：照片、代码、一些还没扔掉的文档，加起来不到 200G。之前用的是某个网盘客户端，后来因为同步冲突弹窗太多，索性卸载了。

现在的方案很土：一条 `rsync`，加一个 cron。

## 为什么不直接 rsync 到同一个目录

直接 `rsync -a src/ dst/` 的问题在于，它会顺手删掉源目录里已经删掉的东西。如果源目录被误删（比如一次 `rm -rf` 手滑），下一次同步就会把备份也删掉。备份变成了实时镜像，那不是备份，是镜像。

所以真正的做法是：每天同步到一个以日期命名的目录里，再用一个 `current` 软链接指向最新的那一份。这里有个细节——**相邻两天之间有 99% 的文件是完全一样的**，如果每天都复制一份，硬盘一个月就满了。

解决办法是 `--link-dest`：对于内容没变的文件，rsync 直接创建硬链接而不是复制。在文件系统看来，每个日期目录都是完整的一份，但实际占用的总空间只比单份多一点。

## 那条命令

```bash
#!/usr/bin/env bash
set -euo pipefail

SRC=/home/chen/data
DST=/mnt/backup/snapshots
STAMP=$(date +%Y-%m-%d_%H%M)
CUR="$DST/current"

mkdir -p "$DST/$STAMP"

rsync -aHAX --delete --numeric-ids \
      --info=progress2 \
      --link-dest="$CUR" \
      "$SRC/" "$DST/$STAMP/" | tee -a "$DST/last-run.log"

# 全部成功后才切换指针，中间失败不会污染 current
ln -sfn "$STAMP" "$DST/.current.tmp"
mv -Tf "$DST/.current.tmp" "$CUR"
```

几个参数值得单独说：

- `-a` 归档模式，等于 `-rlptgoD`，保留权限、时间戳、软链接。
- `-H` 保留硬链接。不加的话，源目录里的硬链接会在备份里变成两份独立文件。
- `-A -X` 保留 ACL 和扩展属性。不关心可以去掉，能快一些。
- `--numeric-ids` 跨机器同步时很重要，否则用户名和 UID 的映射可能对不上。
- `--link-dest` 必须使用绝对路径。相对路径是相对**目标**目录解析的，写错方向的话所有文件都会被重新复制一遍，而且不报错。

## 旧快照怎么清理

保留最近 7 天 + 每周一的那一份，其余删掉。用 `find` 就够了，没必要引入专门的备份工具：

```bash
# 删 7 天前的每日快照，但周一的保留
find "$DST" -mindepth 1 -maxdepth 1 -type d -name '20*' -mtime +7 | while read -r d; do
  day=$(basename "$d" | cut -d_ -f1)
  dow=$(date -d "$day" +%u)
  [ "$dow" != "1" ] && rm -rf -- "$d"
done
```

更短的是 GNU 的 `-delete`：

```bash
find "$DST" -mindepth 1 -maxdepth 1 -type d -name '20*' -mtime +7 -delete
```

前提是目录里没有软链接指向外部。如果有，`-delete` 会拒绝删除——这反倒像个安全网。

## 恢复

这是备份方案里最容易被忽略的部分。**没有演练过的备份等于没有备份。**

恢复某个快照里的单个文件：

```bash
ls /mnt/backup/snapshots/2026-08-01_0300/photos/2025/
rsync -av /mnt/backup/snapshots/2026-08-01_0300/photos/2025/ ~/data/photos/2025/
```

因为历史快照都在，任何一个时间点都能取回来。硬链接的结构意味着就算误删了某个快照目录，其他快照里的相同文件也不会受影响。

## 几个踩过的坑

1. **移动硬盘休眠**。USB 硬盘 10 分钟不活动就转停，cron 一启动 rsync，硬盘唤醒要 5 秒，偶尔会因为超时导致第一次失败的连接。在脚本开头加一句 `hdparm -B 254` 或者干脆让硬盘不休眠更省事。
2. **时区**。cron 默认用系统时区，如果你的 VPS 是 UTC，凌晨 3 点的任务实际上是北京时间 11 点。检查一下 `timedatectl`。
3. **没有日志就等于没法排查**。我在脚本最后加了一行把 rsync 的输出追加到 `$DST/last-run.log`，出问题时第一眼能看出卡在哪一步。

整套东西跑了大半年，最慢的一次是首次全量，200G 大概花了四个小时（USB 3.0 的实际速度比标称差很多）。之后每天的增量通常在两分钟以内。

下一步想换成 [restic](https://restic.net/)，主要是想要加密和去重。但 restic 的仓库格式是它自己的，不透明，出问题时用 `rsync` 总能捞点东西出来，这个心理安慰暂时还不舍得放弃。
