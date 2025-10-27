# コードスタイルと規則

## 命名規則
- **ファイル名**: PascalCase for React components (e.g., `MemberCard.tsx`), camelCase for utilities (e.g., `assignmentLogic.ts`)
- **関数・変数**: camelCase（例：`getUserData`）
- **定数**: UPPER_SNAKE_CASE（例：`API_BASE_URL`）
- **クラス**: PascalCase（例：`UserService`）
- **インターフェース**: PascalCase（例：`Member`、`Team`）

## TypeScript
- 型安全性を重視し、型定義を明確にする
- `interface`を使用して型を定義（`src/types.ts`に集約）
- `export`を適切に使用して型を共有

## React
- 関数コンポーネントを使用
- `useState`、`useEffect`などのHooksを活用
- propsの型定義を明確にする

## スタイリング
- Tailwind CSSのユーティリティクラスを使用
- レスポンシブデザイン対応（`lg:`、`md:`などのブレークポイント）
- ダークモード対応（`dark:`プレフィックス）

## コンポーネント設計
- 単一責任の原則に従う
- 再利用可能なコンポーネントを作成
- propsを通じてデータとコールバックを渡す

## 関数型プログラミング
- 可能な限り純粋関数を使用
- イミューダブルなデータ構造を優先
- 副作用を最小限に抑える
