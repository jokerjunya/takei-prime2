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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">メンバー詳細情報</DialogTitle>
          <DialogDescription>
            性格特性とチーム内での役割について
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* 基本情報 */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar 
                  className="w-24 h-24 border-4 shadow-lg"
                  style={{ backgroundColor: member.color || '#9CA3AF' }}
                >
                  {member.avatar && (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  )}
                  <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                    {member.initials || member.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <div className={cn(
                      "p-2 rounded-lg",
                      member.role === 'leader' && 'bg-yellow-100 dark:bg-yellow-900/30',
                      member.role === 'newcomer' && 'bg-blue-100 dark:bg-blue-900/30',
                      member.role === 'member' && 'bg-gray-100 dark:bg-gray-900/30'
                    )}>
                      {getRoleIcon()}
                    </div>
                  </div>
                  <Badge variant={getRoleBadgeVariant()} className="text-sm">
                    {getRoleLabel()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 性格特性が存在しない場合 */}
          {!personality && (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  性格特性データがありません
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  MBTI/Big Fiveデータが登録されていません
                </p>
              </CardContent>
            </Card>
          )}

          {/* MBTI セクション */}
          {personality?.mbti && (
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">
                    MBTI タイプ
                  </h4>
                </div>
                
                {/* MBTIタイプ表示 */}
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-xl p-8 text-center shadow-lg">
                  <p className="text-6xl font-black text-white tracking-widest mb-2">
                    {personality.mbti.type}
                  </p>
                  <p className="text-white/80 text-sm font-medium">
                    Myers-Briggs Type Indicator
                  </p>
                </div>

                {/* 4軸のスコア表示 */}
                <div className="space-y-4 mt-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    各軸のスコア分布
                  </p>
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
              </CardContent>
            </Card>
          )}

          {/* Big Five セクション */}
          {personality?.bigFive && (
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">
                    Big Five 特性
                  </h4>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  5つの主要な性格特性（0-100スケール）
                </p>
                
                <div className="space-y-4 mt-4">
                  <BigFiveBar
                    label="開放性 (Openness)"
                    score={personality.bigFive.openness}
                    color="from-purple-400 to-purple-600"
                  />
                  <BigFiveBar
                    label="誠実性 (Conscientiousness)"
                    score={personality.bigFive.conscientiousness}
                    color="from-blue-400 to-blue-600"
                  />
                  <BigFiveBar
                    label="外向性 (Extraversion)"
                    score={personality.bigFive.extraversion}
                    color="from-green-400 to-green-600"
                  />
                  <BigFiveBar
                    label="協調性 (Agreeableness)"
                    score={personality.bigFive.agreeableness}
                    color="from-yellow-400 to-yellow-600"
                  />
                  <BigFiveBar
                    label="神経症傾向 (Neuroticism)"
                    score={personality.bigFive.neuroticism}
                    color="from-red-400 to-red-600"
                  />
                </div>
              </CardContent>
            </Card>
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

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-semibold">
        <span className="text-foreground">{leftLabel}</span>
        <Badge variant="outline" className="text-xs">
          {score > 0 ? '+' : ''}{score}
        </Badge>
        <span className="text-foreground">{rightLabel}</span>
      </div>
      <div className="relative w-full h-8 bg-muted rounded-full overflow-hidden border shadow-inner">
        {/* 中央線 */}
        <div className="absolute left-1/2 top-0 w-1 h-full bg-border z-10"></div>
        
        {/* スコアバー */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
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
  score: number; // 0～100
  color: string;
}

const BigFiveBar: React.FC<BigFiveBarProps> = ({ label, score, color }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <Badge variant="secondary" className="text-xs font-bold">
          {score}/100
        </Badge>
      </div>
      <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden border shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out relative`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
        </div>
      </div>
    </div>
  );
};

