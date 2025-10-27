import { motion } from 'framer-motion';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

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
        return '均等割り当て（デモ）';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-4xl"
    >
      <Alert color="info" icon={HiInformationCircle} className="py-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="font-semibold text-sm">
            配置ルール: {getStrategyLabel()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {getStrategyDescription()}
          </div>
        </div>
      </Alert>
    </motion.div>
  );
};

