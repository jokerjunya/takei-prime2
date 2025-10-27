import { motion, AnimatePresence } from 'framer-motion';
import type { Member } from '../types';
import { MemberCard } from './MemberCard';
import { Card } from 'flowbite-react';

interface NewcomerSectionProps {
  newcomers: Member[];
  isAssigned: boolean;
}

/**
 * 新規加入者セクションコンポーネント
 */
export const NewcomerSection: React.FC<NewcomerSectionProps> = ({
  newcomers,
  isAssigned,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:max-w-xs"
    >
      <Card className="shadow-md bg-white dark:bg-gray-800">
        <div className="space-y-3">
          {/* ヘッダー */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              新規加入者
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isAssigned ? '配置完了' : '配置待ち'}
            </p>
          </div>

          {/* メンバーリスト */}
          <div className="flex flex-col items-center gap-2 min-h-[180px] justify-center">
            <AnimatePresence mode="wait">
              {!isAssigned ? (
                newcomers.map((newcomer, index) => (
                  <motion.div
                    key={newcomer.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: 200,
                      scale: 0.8,
                      transition: { duration: 0.5, delay: index * 0.1 },
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MemberCard member={newcomer} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    全員配置済み
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

