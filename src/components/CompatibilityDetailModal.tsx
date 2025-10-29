import { motion } from 'framer-motion';
import type { Member } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Brain, MessageCircle, ArrowRightLeft, X } from 'lucide-react';
import {
  calculateThinkingSimilarity,
  calculateValueAlignment,
  calculateCommunicationTendency,
  getScoreLabel,
  getCompatibilityDescription,
} from '../utils/matching';

export interface PairInfo {
  leader: Member;
  newcomer: Member;
  score: number;
  explanation: string[];
}

interface CompatibilityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairs: PairInfo[];
}

/**
 * マッチ度詳細表示モーダル
 * 複数ペアの総合スコアと個別指標を視覚的に表示
 */
export const CompatibilityDetailModal: React.FC<CompatibilityDetailModalProps> = ({
  isOpen,
  onClose,
  pairs,
}) => {
  if (pairs.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">閉じる</span>
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            組み合わせ状況
          </DialogTitle>
        </DialogHeader>

        {/* 全ペアを縦にスクロール表示 */}
        <div className="space-y-8 pb-4">
          {pairs.map((pair, index) => (
            <PairDetailSection key={`${pair.leader.id}-${pair.newcomer.id}`} pair={pair} index={index} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * 1ペアの詳細セクション
 */
const PairDetailSection: React.FC<{ pair: PairInfo; index: number }> = ({ pair, index }) => {
  const { leader, newcomer, score, explanation } = pair;

  // 個別指標の計算
  const leaderBF = leader.personality?.bigFive;
  const newcomerBF = newcomer.personality?.bigFive;

  const thinkingSimilarity = leaderBF && newcomerBF 
    ? calculateThinkingSimilarity(leaderBF, newcomerBF)
    : 0;
  const valueAlignment = leaderBF && newcomerBF
    ? calculateValueAlignment(leaderBF, newcomerBF)
    : 0;
  const communicationTendency = leaderBF && newcomerBF
    ? calculateCommunicationTendency(leaderBF, newcomerBF)
    : 0;

  const overallLabel = getScoreLabel(score);
  const description = getCompatibilityDescription(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-border rounded-lg p-6 bg-card shadow-sm"
    >
      {/* ヘッダー部分：メンバー情報とスコア */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* リーダー情報 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar
            className="h-16 w-16 border-2"
            style={{ backgroundColor: leader.color || '#9CA3AF' }}
          >
            {leader.avatar && (
              <AvatarImage src={leader.avatar} alt={leader.name} />
            )}
            <AvatarFallback className="bg-transparent text-white font-semibold text-lg">
              {leader.initials || leader.name.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold text-base">{leader.name}</p>
            <Badge variant="default" className="text-xs">
              リーダー
            </Badge>
          </div>
        </div>

        {/* 中央：総合マッチ度 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">マッチ度</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 + 0.2 }}
            className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            {score.toFixed(2)}
          </motion.div>
        </div>

        {/* 新規加入者情報 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar
            className="h-16 w-16 border-2"
            style={{ backgroundColor: newcomer.color || '#9CA3AF' }}
          >
            {newcomer.avatar && (
              <AvatarImage src={newcomer.avatar} alt={newcomer.name} />
            )}
            <AvatarFallback className="bg-transparent text-white font-semibold text-lg">
              {newcomer.initials || newcomer.name.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold text-base">{newcomer.name}</p>
            <Badge variant="secondary" className="text-xs">
              新規
            </Badge>
          </div>
        </div>
      </div>

      {/* カラフルなグラデーションプログレスバー */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">総合評価</span>
          <span className="text-sm font-bold text-foreground">{overallLabel}</span>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-yellow-500 via-orange-500 to-green-500 rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            }}
          />
        </div>
      </div>

      {/* 個別指標セクション */}
      <div className="space-y-4 bg-muted/30 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">詳細指標</h3>

        {/* 思考の近さ */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">思考の近さ</span>
            <span className="ml-auto text-sm font-bold text-blue-600">
              {getScoreLabel(thinkingSimilarity)}
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${thinkingSimilarity * 100}%` }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
            />
          </div>
        </div>

        {/* 価値観の親和性 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">価値観の親和性</span>
            <span className="ml-auto text-sm font-bold text-blue-600">
              {getScoreLabel(valueAlignment)}
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${valueAlignment * 100}%` }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
            />
          </div>
        </div>

        {/* コミュニケーション傾向 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">コミュニケーション傾向</span>
            <span className="ml-auto text-sm font-bold text-gray-600">
              {getScoreLabel(communicationTendency)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <motion.div
                initial={{ left: 0 }}
                animate={{ left: `${communicationTendency * 100}%` }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.6, ease: 'easeOut' }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 説明文セクション */}
      <div className="space-y-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4">
        <p className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
        {explanation.length > 0 && (
          <ul className="space-y-1.5 mt-3">
            {explanation.map((exp, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.7 + idx * 0.05 }}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-purple-500 mt-0.5 font-bold">•</span>
                <span>{exp}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};
