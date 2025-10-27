# プロジェクト概要

## プロジェクト名
team-assignment-demo (takei-prime2)

## 目的
新規加入者を既存チームに自動配置するビジュアルデモアプリケーション。配置体験の"見え方"を素早く確認し、後のロジック実装（MBTI/Big Five対応）に繋げる。

## 主な機能
- **新規加入者の可視化**: 左側に新規加入者（A/B/C）を表示
- **既存組織の管理**: 右側に既存チーム（リーダー＋メンバー）を3チーム表示
- **自動配置**: ボタン押下で新規加入者を各チーム末尾へ自動配置
- **リセット機能**: 配置後に初期状態へ戻して再実行可能
- **滑らかなアニメーション**: フェード＋スライドでカードが移動

## 技術スタック
- **ビルドツール**: Vite 7.1.7
- **フロントエンド**: React 19.1.1 + TypeScript 5.9.3
- **スタイリング**: Tailwind CSS 4.1.16
- **UIコンポーネント**: Flowbite React 0.12.10
- **アニメーション**: Framer Motion 12.23.24
- **アイコン**: React Icons 5.5.0
- **リンター**: ESLint 9.36.0 + typescript-eslint 8.45.0

## プロジェクト構造
```
src/
├── components/          # UIコンポーネント
│   ├── MemberCard.tsx       # メンバーカード
│   ├── NewcomerSection.tsx  # 新規加入者セクション
│   ├── TeamSection.tsx      # チームセクション
│   ├── AssignButton.tsx     # 自動配置ボタン
│   └── AssignmentInfo.tsx   # 割当ルール表示
├── data/                # ダミーデータ
│   └── dummyData.ts         # 初期データ生成
├── utils/               # ユーティリティ
│   └── assignmentLogic.ts   # 配置ロジック
├── types.ts             # TypeScript型定義
├── App.tsx              # メインアプリ
└── main.tsx             # エントリーポイント
```

## 型定義
### Member
- id: string
- name: string
- role: MemberRole (leader | member | newcomer)
- avatar?: string
- initials?: string
- color?: string

### Team
- id: string
- name: string
- members: Member[]

### AssignmentState
- 'even' | 'weighted' | 'random'
