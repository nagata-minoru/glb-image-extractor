# GLB Image Extractor

GLB Image Extractor は、GLB（GL Transmission Format Binary）ファイルからテクスチャ画像を抽出するシンプルな Web アプリケーションです。このアプリケーションは React、TypeScript、Vite を使用して構築されています。

## 特徴

- GLBファイルのアップロードと処理
- 抽出されたテクスチャ画像の表示
- 軽量で使いやすいインターフェース
- 淡い黄色を基調とした柔らかいデザイン

## 使用技術

- React
- TypeScript
- Vite
- [GLTF/GLB Utility](https://github.com/code4fukui/GLTF) by code4fukui

## セットアップ

1. リポジトリをクローンします：

```bash
git clone https://github.com/nagata-minoru/glb-image-extractor.git
cd glb-image-extractor
```

2. 依存関係をインストールします：

```bash
npm install
```

3. 開発サーバーを起動します：

```bash
npm run dev
```

4. ブラウザで `http://localhost:5173` を開きます。

## 使用方法

1. アプリケーションのメイン画面で「ファイルを選択」ボタンをクリックします。
2. GLBファイルを選択してアップロードします。
3. アプリケーションがファイルを処理し、抽出されたテクスチャ画像を表示します。

## 注意事項

- このアプリケーションは、GLBファイル内の最初のテクスチャ画像のみを抽出します。
- 大きなファイルの処理には時間がかかる場合があります。
- すべてのGLBファイルにテクスチャ画像が含まれているわけではありません。

## 今後の改善点

- 複数のテクスチャ画像の抽出と表示
- 抽出した画像のダウンロード機能
- ドラッグアンドドロップでのファイルアップロード
- エラーハンドリングの改善

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。

## 謝辞

このプロジェクトは [code4fukui](https://github.com/code4fukui) の GLTF/GLB ユーティリティを使用しています。
