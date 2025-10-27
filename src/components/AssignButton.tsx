import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RotateCcw, Zap, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

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
      className="flex flex-col items-center justify-center gap-4 px-4 lg:px-8 my-4"
    >
      <Card className="p-6 shadow-xl border-2 bg-gradient-to-br from-card to-muted/20">
        <div className="flex flex-col items-center gap-4">
          {/* アイコン表示 */}
          <div className="relative">
            <motion.div
              animate={{
                scale: isAnimating ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isAnimating ? Infinity : 0,
              }}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "bg-gradient-to-br shadow-lg",
                !isAssigned 
                  ? "from-blue-500 to-blue-600 text-white" 
                  : "from-gray-400 to-gray-500 text-white"
              )}
            >
              {isAnimating ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : !isAssigned ? (
                <Zap className="w-8 h-8" />
              ) : (
                <RotateCcw className="w-8 h-8" />
              )}
            </motion.div>
            
            {/* パルスエフェクト */}
            {!isAssigned && !isAnimating && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
          </div>

          {/* メインボタン */}
          {!isAssigned ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={onAssign}
                disabled={isAnimating}
                className="shadow-lg text-base font-bold px-8 py-6 gap-2"
              >
                <Zap className="w-5 h-5" />
                自動配置を実行
                <ArrowRight className="w-4 h-4" />
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
                variant="secondary"
                onClick={onReset}
                disabled={isAnimating}
                className="shadow-lg text-base font-bold px-8 py-6 gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                リセット
              </Button>
            </motion.div>
          )}

          {/* 説明テキスト */}
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {!isAssigned 
              ? "ボタンをクリックして新規加入者をチームに配置" 
              : "初期状態に戻して再度配置を試せます"
            }
          </p>

          {/* アニメーション中のインジケーター */}
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-primary font-medium"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">配置処理中...</span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

