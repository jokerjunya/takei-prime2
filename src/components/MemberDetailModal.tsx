import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import type { Member } from '../types';
import { Crown, User, UserPlus, Brain, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

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
        return <Crown className="w-6 h-6" />;
      case 'newcomer':
        return <UserPlus className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
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

  const { personality } = member;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar 
              className="w-16 h-16 border-2 shadow-md"
              style={{ backgroundColor: member.color || '#9CA3AF' }}
            >
              {member.avatar && (
                <AvatarImage src={member.avatar} alt={member.name} />
              )}
              <AvatarFallback className="bg-transparent text-white text-lg font-bold">
                {member.initials || member.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                <div className={cn(
                  "p-1.5 rounded-lg",
                  member.role === 'leader' && 'bg-yellow-100 dark:bg-yellow-900/30',
                  member.role === 'newcomer' && 'bg-blue-100 dark:bg-blue-900/30',
                  member.role === 'member' && 'bg-muted/50'
                )}>
                  {getRoleIcon()}
                </div>
                <Badge variant={getRoleBadgeVariant()}>
                  {getRoleLabel()}
                </Badge>
              </div>
              <DialogDescription className="mt-1">
                性格特性とチーム内での役割
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-2">

          {/* 性格特性が存在しない場合 */}
          {!personality && (
            <Card className="border-2 shadow-lg">
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-medium text-muted-foreground">
                  性格特性データがありません
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  MBTI/Big Fiveデータが登録されていません
                </p>
              </CardContent>
            </Card>
          )}

          {/* 性格特性：2カラムレイアウト */}
          {(personality?.mbti || personality?.bigFive) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MBTI セクション */}
              {personality?.mbti && (
                <Card className="border-2 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">
                        MBTI タイプ
                      </h4>
                    </div>
                    
                    {/* MBTIタイプ表示 */}
                    <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl py-8 text-center border-2">
                      <p className="text-5xl font-black text-foreground tracking-wider mb-1">
                        {personality.mbti.type}
                      </p>
                      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                        Myers-Briggs
                      </p>
                    </div>

                    {/* 4軸のスコア表示 */}
                    <div className="space-y-3 pt-2">
                      <MBTIAxisBar
                        leftLabel="内向"
                        rightLabel="外向"
                        score={personality.mbti.scores.EI}
                      />
                      <MBTIAxisBar
                        leftLabel="感覚"
                        rightLabel="直感"
                        score={personality.mbti.scores.SN}
                      />
                      <MBTIAxisBar
                        leftLabel="思考"
                        rightLabel="感情"
                        score={personality.mbti.scores.TF}
                      />
                      <MBTIAxisBar
                        leftLabel="判断"
                        rightLabel="知覚"
                        score={personality.mbti.scores.JP}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Big Five セクション */}
              {personality?.bigFive && (
                <Card className="border-2 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">
                        Big Five 特性
                      </h4>
                    </div>
                    
                    <p className="text-xs text-muted-foreground pb-2">
                      5つの主要な性格特性（0-100スケール）
                    </p>
                    
                    <div className="space-y-4">
                      <BigFiveBar
                        label="開放性"
                        sublabel="Openness"
                        score={personality.bigFive.openness}
                      />
                      <BigFiveBar
                        label="誠実性"
                        sublabel="Conscientiousness"
                        score={personality.bigFive.conscientiousness}
                      />
                      <BigFiveBar
                        label="外向性"
                        sublabel="Extraversion"
                        score={personality.bigFive.extraversion}
                      />
                      <BigFiveBar
                        label="協調性"
                        sublabel="Agreeableness"
                        score={personality.bigFive.agreeableness}
                      />
                      <BigFiveBar
                        label="神経症傾向"
                        sublabel="Neuroticism"
                        score={personality.bigFive.neuroticism}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
  const isLeft = score < 0;
  const absScore = Math.abs(score);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className={cn(
          "font-medium",
          isLeft ? "text-foreground font-bold" : "text-foreground/60"
        )}>{leftLabel}</span>
        <Badge variant="outline" className="text-[10px] px-2 py-0.5">
          {score > 0 ? '+' : ''}{score}
        </Badge>
        <span className={cn(
          "font-medium",
          !isLeft ? "text-foreground font-bold" : "text-foreground/60"
        )}>{rightLabel}</span>
      </div>
      <div className="relative w-full h-8 bg-muted rounded-lg overflow-hidden border-2">
        {/* 中央線 */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-foreground/20 z-10"></div>
        
        {/* スコアバー */}
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        
        {/* スコア表示 */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-xs font-bold text-foreground drop-shadow-sm">
            {absScore}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Big Five表示用コンポーネント
 */
interface BigFiveBarProps {
  label: string;
  sublabel: string;
  score: number; // 0～100
}

const BigFiveBar: React.FC<BigFiveBarProps> = ({ label, sublabel, score }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-bold text-foreground">{label}</span>
          <span className="text-[10px] text-foreground/60 ml-2">{sublabel}</span>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-bold">
          {score}
        </Badge>
      </div>
      <div className="relative w-full h-7 bg-muted rounded-lg overflow-hidden border-2">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

