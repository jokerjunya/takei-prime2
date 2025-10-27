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
        return <Crown className="w-4 h-4" />;
      case 'newcomer':
        return <UserPlus className="w-3.5 h-3.5" />;
      default:
        return <User className="w-3 h-3" />;
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
      className="flex flex-col items-center gap-2 p-2 group"
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
            'h-14 w-14 border-2 transition-all duration-200',
            isHighlighted && 'ring-4 ring-orange-400 ring-offset-2 shadow-xl',
            onClick && 'cursor-pointer hover:shadow-lg hover:border-primary'
          )}
          style={{
            backgroundColor: member.color || '#9CA3AF',
          }}
        >
          <AvatarFallback className="bg-transparent text-white font-semibold">
            {member.initials || member.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        {/* 役割アイコン（アバター右下） */}
        <div className={cn(
          'absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-background shadow-md transition-transform group-hover:scale-110',
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
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {member.name}
        </p>
        <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0">
          {getRoleLabel()}
        </Badge>
      </div>
    </motion.div>
  );
};

