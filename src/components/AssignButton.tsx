import { motion } from 'framer-motion';
import { Button } from 'flowbite-react';
import { HiRefresh, HiLightningBolt } from 'react-icons/hi';

interface AssignButtonProps {
  isAssigned: boolean;
  onAssign: () => void;
  onReset: () => void;
  isAnimating?: boolean;
}

/**
 * 自動配置ボタンコンポーネント
 */
export const AssignButton: React.FC<AssignButtonProps> = ({
  isAssigned,
  onAssign,
  onReset,
  isAnimating = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 px-4 lg:px-8"
    >
      {/* メインボタン */}
      {!isAssigned ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            color="blue"
            onClick={onAssign}
            disabled={isAnimating}
            className="shadow-lg"
          >
            <HiLightningBolt className="mr-2 h-5 w-5" />
            <span className="text-base font-semibold">自動配置</span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            color="gray"
            onClick={onReset}
            disabled={isAnimating}
            className="shadow-lg"
          >
            <HiRefresh className="mr-2 h-5 w-5" />
            <span className="text-base font-semibold">リセット</span>
          </Button>
        </motion.div>
      )}

      {/* アニメーション中のインジケーター */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <HiRefresh className="h-5 w-5" />
          </motion.div>
          <span className="text-sm font-medium">配置中...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

