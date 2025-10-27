import { motion } from 'framer-motion';
import type { Member } from '../types';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Crown, UserPlus, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface MemberCardProps {
  member: Member;
  isHighlighted?: boolean;
  delay?: number;
  onClick?: (member: Member) => void;
}

/**
 * メンバーカードコンポーネント
 * アバターとロールバッジを表示
 */
export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isHighlighted = false,
  delay = 0,
  onClick,
}) => {
  const getRoleIcon = () => {
    switch (member.role) {
      case 'leader':
        return <Crown className="w-3 h-3" />;
      case 'newcomer':
        return <UserPlus className="w-2.5 h-2.5" />;
      default:
        return <User className="w-2.5 h-2.5" />;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (member.role) {
      case 'leader':
        return 'default' as const;
      case 'newcomer':
        return 'secondary' as const;
      default:
        return 'outline' as const;
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
        scale: isHighlighted ? 1.08 : 1,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className="flex flex-col items-center gap-1.5 p-1 group"
    >
      {/* アバター */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => onClick?.(member)}
        className="relative"
      >
        <Avatar
          className={cn(
            'h-11 w-11 border-2 transition-all duration-200',
            isHighlighted && 'ring-4 ring-orange-400 ring-offset-2 shadow-xl',
            onClick && 'cursor-pointer hover:shadow-lg hover:border-primary'
          )}
          style={{
            backgroundColor: member.color || '#9CA3AF',
          }}
        >
          <AvatarFallback className="bg-transparent text-white font-semibold text-sm">
            {member.initials || member.name.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        
        {/* 役割アイコン（アバター右下） */}
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 p-1 rounded-full border-2 border-background shadow-md transition-transform group-hover:scale-110',
          member.role === 'leader' && 'bg-yellow-500',
          member.role === 'newcomer' && 'bg-blue-500',
          member.role === 'member' && 'bg-gray-500'
        )}>
          <div className="text-white">
            {getRoleIcon()}
          </div>
        </div>
      </motion.div>

      {/* 名前とバッジ */}
      <div className="text-center space-y-0.5">
        <p className="text-xs font-medium text-foreground leading-tight max-w-[70px] truncate">
          {member.name}
        </p>
        <Badge variant={getRoleBadgeVariant()} className="text-[9px] px-1 py-0">
          {getRoleLabel()}
        </Badge>
      </div>
    </motion.div>
  );
};

