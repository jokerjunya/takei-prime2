import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Team, Member } from './types';
import { createNewcomers, createTeams } from './data/dummyData';
import { assignNewcomers } from './utils/assignmentLogic';
import { NewcomerSection } from './components/NewcomerSection';
import { TeamSection } from './components/TeamSection';
import { AssignButton } from './components/AssignButton';
import { AssignmentInfo } from './components/AssignmentInfo';
import { MemberDetailModal } from './components/MemberDetailModal';

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
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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

  /**
   * メンバークリック時の処理
   */
  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
  };

  /**
   * モーダルを閉じる処理
   */
  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  useEffect(() => {
    // 初期表示時のアニメーション用
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
      <div className="container mx-auto max-w-[1600px] space-y-8">
        {/* タイトル */}
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-foreground"
          >
            チーム配置シミュレーター
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            新規加入者を既存チームに自動配置
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-1 w-32 mx-auto bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full"
          />
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8 mb-8">
          {/* 左: 新規加入者 */}
          <NewcomerSection
            newcomers={newcomers}
            isAssigned={isAssigned}
            onMemberClick={handleMemberClick}
          />

          {/* 中央: 自動配置ボタン */}
          <div className="flex items-center justify-center lg:py-12">
            <AssignButton
              isAssigned={isAssigned}
              onAssign={handleAssign}
              onReset={handleReset}
              isAnimating={isAnimating}
            />
          </div>

          {/* 右: 既存組織 */}
          <TeamSection
            teams={teams}
            highlightedMemberIds={highlightedMemberIds}
            onMemberClick={handleMemberClick}
          />
        </div>

        {/* 下部: 割当ルール情報 */}
        <div className="flex justify-center">
          <AssignmentInfo strategy="even" />
        </div>

        {/* メンバー詳細モーダル */}
        <MemberDetailModal
          member={selectedMember}
          isOpen={selectedMember !== null}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default App;
