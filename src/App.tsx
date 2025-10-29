import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Team, Member } from './types';
import { createNewcomers, createTeams } from './data/dummyData';
import { assignNewcomers, type CompatibilityInfo } from './utils/assignmentLogic';
import { NewcomerSection } from './components/NewcomerSection';
import { TeamSection } from './components/TeamSection';
import { AssignButton } from './components/AssignButton';
import { AssignmentInfo } from './components/AssignmentInfo';
import { MemberDetailModal } from './components/MemberDetailModal';
import { CompatibilityDetailModal, type PairInfo } from './components/CompatibilityDetailModal';

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
  const [scores, setScores] = useState<Map<string, CompatibilityInfo>>(new Map());
  
  // マッチ度詳細モーダルの状態（複数ペア対応）
  const [compatibilityModalPairs, setCompatibilityModalPairs] = useState<PairInfo[]>([]);

  /**
   * 自動配置処理
   */
  const handleAssign = () => {
    setIsAnimating(true);

    // アニメーション開始（新規加入者がフェードアウト）
    setTimeout(() => {
      // 配置ロジック実行（相性ベース）
      const result = assignNewcomers(initialTeams, initialNewcomers, 'compatibility');
      
      setTeams(result.teams);
      setIsAssigned(true);
      
      // スコア情報を保存
      if (result.scores) {
        setScores(result.scores);
      }

      // 新規加入者のIDをハイライト用に保存
      const newcomerIds = new Set(initialNewcomers.map(n => n.id));
      setHighlightedMemberIds(newcomerIds);

      // アニメーション完了後、ハイライトを解除（600msに調整）
      setTimeout(() => {
        setHighlightedMemberIds(new Set());
        setIsAnimating(false);
      }, 1800);
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
      setScores(new Map());
      setCompatibilityModalPairs([]);
      setIsAnimating(false);
    }, 500);
  };

  /**
   * メンバークリック時の処理
   * 常に本人の性格特性モーダルを表示
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

  /**
   * マッチ度詳細モーダルを閉じる処理
   */
  const handleCloseCompatibilityModal = () => {
    setCompatibilityModalPairs([]);
  };

  /**
   * 全ペアのマッチ度詳細を表示
   */
  const handleShowAllCompatibility = () => {
    const allPairs: PairInfo[] = [];
    
    // 全ての新規加入者について、配置されたチームのリーダーとのペア情報を作成
    for (const newcomer of initialNewcomers) {
      const scoreInfo = scores.get(newcomer.id);
      if (!scoreInfo) continue;
      
      // このnewcomerが配置されたチームのリーダーを探す
      for (const team of teams) {
        const found = team.members.find(m => m.id === newcomer.id);
        if (found) {
          allPairs.push({
            leader: team.leader,
            newcomer: found,
            score: scoreInfo.score,
            explanation: scoreInfo.explanation,
          });
          break;
        }
      }
    }
    
    setCompatibilityModalPairs(allPairs);
  };

  useEffect(() => {
    // 初期表示時のアニメーション用
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-4 px-3 sm:py-6 sm:px-4 lg:py-8">
      <div className="container mx-auto max-w-[1600px] space-y-4 sm:space-y-6 lg:space-y-8">
        {/* タイトル */}
        <div className="text-center space-y-2 sm:space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight"
          >
            チーム配置シミュレーター
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2"
          >
            新規加入者を既存チームに自動配置
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-0.5 sm:h-1 w-24 sm:w-32 mx-auto bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full"
          />
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          {/* 左: 新規加入者 */}
          <NewcomerSection
            newcomers={newcomers}
            isAssigned={isAssigned}
            onMemberClick={handleMemberClick}
          />

          {/* 中央: 自動配置ボタン */}
          <div className="flex flex-col items-center justify-center lg:py-12 gap-4">
            <AssignButton
              isAssigned={isAssigned}
              onAssign={handleAssign}
              onReset={handleReset}
              isAnimating={isAnimating}
            />
            
            {/* 組み合わせ状況を見るボタン（配置後のみ表示） */}
            {isAssigned && scores.size > 0 && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleShowAllCompatibility}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
                組み合わせ状況を見る
              </motion.button>
            )}
          </div>

          {/* 右: 既存組織 */}
          <TeamSection
            teams={teams}
            highlightedMemberIds={highlightedMemberIds}
            onMemberClick={handleMemberClick}
            scores={scores}
          />
        </div>

        {/* 下部: 割当ルール情報 */}
        <div className="flex justify-center">
          <AssignmentInfo strategy="compatibility" />
        </div>

        {/* メンバー詳細モーダル */}
        <MemberDetailModal
          member={selectedMember}
          isOpen={selectedMember !== null}
          onClose={handleCloseModal}
        />

        {/* マッチ度詳細モーダル */}
        <CompatibilityDetailModal
          isOpen={compatibilityModalPairs.length > 0}
          onClose={handleCloseCompatibilityModal}
          pairs={compatibilityModalPairs}
        />
      </div>
    </div>
  );
}

export default App;
