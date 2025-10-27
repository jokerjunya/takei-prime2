import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import type { Member } from '../types';
import { FaUserTie, FaUser, FaUserPlus } from 'react-icons/fa';

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * メンバー詳細モーダルコンポーネント
 * 性格特性（MBTI・Big Five）を表示
 */
export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  if (!member) return null;

  const getRoleIcon = () => {
    switch (member.role) {
      case 'leader':
        return <FaUserTie className="text-white" size={24} />;
      case 'newcomer':
        return <FaUserPlus className="text-white" size={20} />;
      default:
        return <FaUser className="text-white" size={18} />;
    }
  };

  const getRoleLabel = () => {
    switch (member.role) {
      case 'leader':
        return 'リーダー';
      case 'newcomer':
        return '新規加入者';
      default:
        return 'メンバー';
    }
  };

  const { personality } = member;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>メンバー詳細情報</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                member.color || 'bg-gray-400'
              }`}
            >
              {getRoleIcon()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getRoleLabel()}
              </p>
            </div>
          </div>

          {/* 性格特性が存在しない場合 */}
          {!personality && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              性格特性データがありません
            </div>
          )}

          {/* MBTI セクション */}
          {personality?.mbti && (
            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                MBTI タイプ
              </h4>
              
              {/* MBTIタイプ表示 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-center shadow-md">
                <p className="text-5xl font-bold text-white tracking-wider">
                  {personality.mbti.type}
                </p>
              </div>

              {/* 4軸のスコア表示 */}
              <div className="space-y-3 mt-4">
                <MBTIAxisBar
                  leftLabel="I (内向)"
                  rightLabel="E (外向)"
                  score={personality.mbti.scores.EI}
                />
                <MBTIAxisBar
                  leftLabel="S (感覚)"
                  rightLabel="N (直感)"
                  score={personality.mbti.scores.SN}
                />
                <MBTIAxisBar
                  leftLabel="T (思考)"
                  rightLabel="F (感情)"
                  score={personality.mbti.scores.TF}
                />
                <MBTIAxisBar
                  leftLabel="J (判断)"
                  rightLabel="P (知覚)"
                  score={personality.mbti.scores.JP}
                />
              </div>
            </div>
          )}

          {/* Big Five セクション */}
          {personality?.bigFive && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Big Five 特性
              </h4>
              
              <div className="space-y-3">
                <BigFiveBar
                  label="開放性 (Openness)"
                  score={personality.bigFive.openness}
                  color="bg-purple-500"
                />
                <BigFiveBar
                  label="誠実性 (Conscientiousness)"
                  score={personality.bigFive.conscientiousness}
                  color="bg-blue-500"
                />
                <BigFiveBar
                  label="外向性 (Extraversion)"
                  score={personality.bigFive.extraversion}
                  color="bg-green-500"
                />
                <BigFiveBar
                  label="協調性 (Agreeableness)"
                  score={personality.bigFive.agreeableness}
                  color="bg-yellow-500"
                />
                <BigFiveBar
                  label="神経症傾向 (Neuroticism)"
                  score={personality.bigFive.neuroticism}
                  color="bg-red-500"
                />
              </div>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

/**
 * MBTIの軸表示用コンポーネント
 */
interface MBTIAxisBarProps {
  leftLabel: string;
  rightLabel: string;
  score: number; // -100～100
}

const MBTIAxisBar: React.FC<MBTIAxisBarProps> = ({
  leftLabel,
  rightLabel,
  score,
}) => {
  // スコアを0～100の範囲に変換（表示用）
  const percentage = ((score + 100) / 200) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{leftLabel}</span>
        <span className="text-gray-500 dark:text-gray-400">{score}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* 中央線 */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400 dark:bg-gray-500 z-10"></div>
        
        {/* スコアバー */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Big Five表示用コンポーネント
 */
interface BigFiveBarProps {
  label: string;
  score: number; // 0～100
  color: string;
}

const BigFiveBar: React.FC<BigFiveBarProps> = ({ label, score, color }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{score}</span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

