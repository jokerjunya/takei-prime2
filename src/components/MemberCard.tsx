import { motion } from 'framer-motion';
import type { Member } from '../types';
import { Badge } from 'flowbite-react';
import { FaUserTie, FaUser, FaUserPlus } from 'react-icons/fa';

interface MemberCardProps {
  member: Member;
  isHighlighted?: boolean;
  delay?: number;
}

/**
 * メンバーカードコンポーネント
 * アバターとロールバッジを表示
 */
export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isHighlighted = false,
  delay = 0,
}) => {
  const getRoleIcon = () => {
    switch (member.role) {
      case 'leader':
        return <FaUserTie className="text-white" size={16} />;
      case 'newcomer':
        return <FaUserPlus className="text-white" size={14} />;
      default:
        return <FaUser className="text-white" size={12} />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (member.role) {
      case 'leader':
        return 'warning';
      case 'newcomer':
        return 'warning'; // オレンジ系で目立たせる
      default:
        return 'gray';
    }
  };

  const getRoleLabel = () => {
    switch (member.role) {
      case 'leader':
        return 'リーダー';
      case 'newcomer':
        return '新規';
      default:
        return 'メンバー';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isHighlighted ? 1.1 : 1,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className="flex flex-col items-center gap-1 p-2"
    >
      {/* アバター */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          shadow-md ${member.color || 'bg-gray-400'}
          ${isHighlighted ? 'ring-4 ring-orange-400 shadow-xl' : ''}
        `}
      >
        {getRoleIcon()}
        
        {/* 役割バッジ（アバター上部） */}
        {member.role === 'leader' && (
          <div className="absolute -top-1 -right-1">
            <Badge color={getRoleBadgeColor()} size="xs">
              {getRoleLabel()}
            </Badge>
          </div>
        )}
      </motion.div>

      {/* 名前 */}
      <div className="text-center">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
          {member.name}
        </p>
        {member.role !== 'leader' && (
          <Badge color={getRoleBadgeColor()} size="xs" className="mt-0.5">
            {getRoleLabel()}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

