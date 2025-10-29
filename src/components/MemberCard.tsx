import { motion } from 'framer-motion';
import type { Member } from '../types';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Crown, UserPlus, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface MemberCardProps {
  member: Member;
  isHighlighted?: boolean;
  delay?: number;
  onClick?: (member: Member) => void;
  compatibilityScore?: number;
  compatibilityExplanation?: string[];
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
  compatibilityScore,
  compatibilityExplanation,
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

  // 円形プログレスゲージのパラメータ（統計的に妥当な閾値）
  const getProgressRingColor = (score: number) => {
    if (score >= 0.40) return 'stroke-emerald-500'; // 上位10%：非常に良好
    if (score >= 0.30) return 'stroke-blue-500';    // 上位25%：良好
    if (score >= 0.20) return 'stroke-amber-500';   // 中央値付近：普通
    return 'stroke-orange-500';                     // 下位25%：要注意
  };

  const calculateStrokeDashoffset = (score: number, circumference: number) => {
    return circumference - (score * circumference);
  };

  // バッジの色設定（柔らかく控えめなデザイン）
  const getCompatibilityBadgeStyle = (score: number) => {
    if (score >= 0.40) {
      return 'bg-emerald-500/90 hover:bg-emerald-600/90 text-white';
    }
    if (score >= 0.30) {
      return 'bg-blue-500/90 hover:bg-blue-600/90 text-white';
    }
    if (score >= 0.20) {
      return 'bg-amber-500/90 hover:bg-amber-600/90 text-white';
    }
    return 'bg-orange-500/90 hover:bg-orange-600/90 text-white';
  };

  // ツールチップのアクセントカラー
  const getTooltipAccentColor = (score: number) => {
    if (score >= 0.40) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 0.30) return 'text-blue-600 dark:text-blue-400';
    if (score >= 0.20) return 'text-amber-600 dark:text-amber-400';
    return 'text-orange-600 dark:text-orange-400';
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
      className="flex flex-col items-center gap-1.5 sm:gap-1.5 p-1 group"
    >
      {/* アバター */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => onClick?.(member)}
        className="relative"
      >
        {/* 円形プログレスゲージ（相性スコアがある場合） */}
        {compatibilityScore !== undefined ? (() => {
          // アバターサイズに応じた設定（h-14 = 56px）
          const size = 56;
          const strokeWidth = 3;
          const radius = (size - strokeWidth) / 2;
          const circumference = 2 * Math.PI * radius;
          const offset = calculateStrokeDashoffset(compatibilityScore, circumference);
          
          return (
            <div className="relative inline-block">
              {/* SVG円形ゲージ - アバターと完全に重なる */}
              <svg
                className="absolute inset-0 -rotate-90 w-full h-full"
                viewBox={`0 0 ${size} ${size}`}
                style={{ 
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                <defs>
                  {/* アンチエイリアシング用のフィルター */}
                  <filter id="smooth" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.1" />
                  </filter>
                </defs>
                {/* 背景円（グレー） */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-gray-300 dark:text-gray-600"
                  style={{ shapeRendering: 'geometricPrecision' }}
                />
                {/* プログレス円（スコアに応じた色） */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  className={cn(
                    'transition-all duration-700 ease-out',
                    getProgressRingColor(compatibilityScore)
                  )}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{
                    filter: 'drop-shadow(0 0 3px currentColor)',
                    shapeRendering: 'geometricPrecision',
                  }}
                />
              </svg>
              
              {/* アバター（枠線なし） */}
              <Avatar
                className={cn(
                  'h-14 w-14 sm:h-12 sm:w-12 lg:h-11 lg:w-11 transition-all duration-200',
                  isHighlighted && 'ring-4 ring-orange-400 ring-offset-2 shadow-xl',
                  onClick && 'cursor-pointer hover:shadow-lg'
                )}
                style={{
                  backgroundColor: member.color || '#9CA3AF',
                }}
              >
                {member.avatar && (
                  <AvatarImage src={member.avatar} alt={member.name} />
                )}
                <AvatarFallback className="bg-transparent text-white font-semibold text-base sm:text-sm">
                  {member.initials || member.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })() : (
          // 相性スコアがない場合は通常の枠線
          <Avatar
            className={cn(
              'h-14 w-14 sm:h-12 sm:w-12 lg:h-11 lg:w-11 border-2 transition-all duration-200',
              isHighlighted && 'ring-4 ring-orange-400 ring-offset-2 shadow-xl',
              onClick && 'cursor-pointer hover:shadow-lg hover:border-primary'
            )}
            style={{
              backgroundColor: member.color || '#9CA3AF',
            }}
          >
            {member.avatar && (
              <AvatarImage src={member.avatar} alt={member.name} />
            )}
            <AvatarFallback className="bg-transparent text-white font-semibold text-base sm:text-sm">
              {member.initials || member.name.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* 相性スコアバッジ（アバター左上） */}
        {compatibilityScore !== undefined && (
          <div className="absolute -top-1 -left-1 group/score z-10">
            <Badge
              variant="default"
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md cursor-help transition-all duration-200",
                getCompatibilityBadgeStyle(compatibilityScore)
              )}
            >
              {compatibilityScore.toFixed(2)}
            </Badge>
            {/* ツールチップ（上部に表示） */}
            {compatibilityExplanation && compatibilityExplanation.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/score:block z-[100] min-w-[180px] animate-in fade-in-0 zoom-in-95">
                <div className="bg-popover text-popover-foreground border rounded-lg shadow-xl p-3 text-xs">
                  <div className={cn("font-semibold mb-1.5 text-center", getTooltipAccentColor(compatibilityScore))}>
                    相性の理由
                  </div>
                  <ul className="space-y-1">
                    {compatibilityExplanation.map((exp, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-1">
                        <span className={cn("mt-0.5", getTooltipAccentColor(compatibilityScore))}>•</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 矢印 */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
              </div>
            )}
          </div>
        )}

        {/* 役割アイコン（アバター右下） */}
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 p-1 rounded-full border-2 border-background shadow-md transition-transform group-hover:scale-110 z-10',
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
        <p className="text-sm sm:text-xs font-medium text-foreground leading-tight max-w-[90px] sm:max-w-[75px] truncate">
          {member.name}
        </p>
        <Badge variant={getRoleBadgeVariant()} className="text-[10px] sm:text-[9px] px-1.5 sm:px-1 py-0">
          {getRoleLabel()}
        </Badge>
      </div>
    </motion.div>
  );
};

