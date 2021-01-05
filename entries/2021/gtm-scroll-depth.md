---
title: Google Tag Managerでスクロールされた量をトラッキングしたい
created_at: 2021-01-05
categories: 技術
tags: Google Tag Manager
---

Google Tag Manager (以下 GTM) の Scroll depth trigger (日本語だとスクロール距離トリガー) は、GTM 側で「トリガーの有効化条件」や「タグの呼び出しオプション」を変えてもクライアント側で DOM を書き換えたときに実行されません。

たとえばトリガーの設定を以下のように変えても、各ページで Container Loaded が実行されたあと Scroll depth trigger は実行されません。

| 条件                             | 値                         |
| -------------------------------- | -------------------------- |
| 次の時にこのトリガーを有効化する | コンテナの読み取り(gtm.js) |
| このトリガーの発生場所           | すべてのページ             |

これは Scroll depth trigger が DOM の変更検知に対応していないためだと思われます。

対応方法としては以下が挙げられます。

- [robflaherty/scroll-depth](https://github.com/robflaherty/scroll-depth/tree/next) といったライブラリを使う
- 元あるライブラリを参考に自力で実装する（そこまで苦ではなさそう）
- Element visibility trigger (日本語だと要素の表示トリガー) を使う
  - [Google タグマネージャへ新たに「スクロール距離」トリガーと「要素の表示」トリガーが登場](https://ayudante.jp/column/2017-10-24/13-04/)で書かれている方法
