import { useState, useEffect } from 'react';
import type { Team, Member } from './types';
import { createNewcomers, createTeams } from './data/dummyData';
import { assignNewcomers } from './utils/assignmentLogic';
import { NewcomerSection } from './components/NewcomerSection';
import { TeamSection } from './components/TeamSection';
import { AssignButton } from './components/AssignButton';
import { AssignmentInfo } from './components/AssignmentInfo';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  // 初期データ
  const [initialNewcomers] = useState<Member[]>(() => createNewcomers());
  const [initialTeams] = useState<Team[]>(() => createTeams());

  // 状態管理
  const [newcomers, setNewcomers] = useState<Member[]>(initialNewcomers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedMemberIds, setHighlightedMemberIds] = useState<Set<string>>(
    new Set()
  );

  /**
   * 自動配置処理
   */
  const handleAssign = () => {
    setIsAnimating(true);

    // アニメーション開始（新規加入者がフェードアウト）
    setTimeout(() => {
      // 配置ロジック実行
      const result = assignNewcomers(initialTeams, initialNewcomers, 'even');
      
      setTeams(result.teams);
      setIsAssigned(true);

      // 新規加入者のIDをハイライト用に保存
      const newcomerIds = new Set(initialNewcomers.map(n => n.id));
      setHighlightedMemberIds(newcomerIds);

      // アニメーション完了後、ハイライトを解除
      setTimeout(() => {
        setHighlightedMemberIds(new Set());
        setIsAnimating(false);
      }, 1500);
    }, 500);
  };

  /**
   * リセット処理
   */
  const handleReset = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setNewcomers(initialNewcomers);
      setTeams(initialTeams);
      setIsAssigned(false);
      setHighlightedMemberIds(new Set());
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    // 初期表示時のアニメーション用
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* タイトル */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            チーム配置シミュレーター
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            新規加入者を既存チームに自動配置
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 mb-4">
          {/* 左: 新規加入者 */}
          <NewcomerSection newcomers={newcomers} isAssigned={isAssigned} />

          {/* 中央: 自動配置ボタン */}
          <AssignButton
            isAssigned={isAssigned}
            onAssign={handleAssign}
            onReset={handleReset}
            isAnimating={isAnimating}
          />

          {/* 右: 既存組織 */}
          <TeamSection
            teams={teams}
            highlightedMemberIds={highlightedMemberIds}
          />
        </div>

        {/* 下部: 割当ルール情報 */}
        <div className="flex justify-center">
          <AssignmentInfo strategy="even" />
        </div>
      </div>
    </div>
  );
}

export default App;
