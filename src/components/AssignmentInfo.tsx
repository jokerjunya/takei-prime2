import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Info, Sparkles, GitBranch } from 'lucide-react';

interface AssignmentInfoProps {
  strategy: string;
}

/**
 * 割当ルール表示コンポーネント
 */
export const AssignmentInfo: React.FC<AssignmentInfoProps> = ({ strategy }) => {
  const getStrategyLabel = () => {
    switch (strategy) {
      case 'even':
        return '均等割り当て（デモ版）';
      case 'weighted':
        return '重み付き割り当て（開発中）';
      default:
        return '不明な戦略';
    }
  };

  const getStrategyDescription = () => {
    switch (strategy) {
      case 'even':
        return 'チームメンバー数が少ない順に新規加入者を配置します。実際のロジックは今後MBTI/Big Fiveなどの性格特性を考慮した配置に拡張予定です。';
      case 'weighted':
        return '性格特性、スキル、経験値などを考慮した配置ロジックを実装予定です。';
      default:
        return '';
    }
  };

  const getStrategyIcon = () => {
    switch (strategy) {
      case 'even':
        return <GitBranch className="w-5 h-5 text-blue-500" />;
      case 'weighted':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-4xl"
    >
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            {/* アイコン */}
            <div className="flex-shrink-0 mt-1">
              {getStrategyIcon()}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">
                  配置ルール:
                </span>
                <Badge variant="secondary" className="text-xs">
                  {getStrategyLabel()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getStrategyDescription()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

