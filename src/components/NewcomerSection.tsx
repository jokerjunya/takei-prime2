import { motion, AnimatePresence } from 'framer-motion';
import type { Member } from '../types';
import { MemberCard } from './MemberCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Users } from 'lucide-react';

interface NewcomerSectionProps {
  newcomers: Member[];
  isAssigned: boolean;
  onMemberClick?: (member: Member) => void;
}

/**
 * 新規加入者セクションコンポーネント
 */
export const NewcomerSection: React.FC<NewcomerSectionProps> = ({
  newcomers,
  isAssigned,
  onMemberClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:max-w-sm"
    >
      <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">新規加入者</CardTitle>
            </div>
            <Badge variant={isAssigned ? "default" : "secondary"} className="ml-2">
              {isAssigned ? '配置完了' : '配置待ち'}
            </Badge>
          </div>
          <CardDescription>
            {isAssigned 
              ? '全員チームに配置されました' 
              : `${newcomers.length}名の配置を待っています`
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* メンバーリスト */}
          <div className="flex flex-col items-center gap-3 min-h-[220px] justify-center py-6">
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
                    className="w-full flex justify-center"
                  >
                    <div className="bg-muted/30 rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                      <MemberCard member={newcomer} onClick={onMemberClick} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground mb-1">
                    配置完了！
                  </p>
                  <p className="text-sm text-muted-foreground">
                    全員のチーム配置が完了しました
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

