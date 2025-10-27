import { motion } from 'framer-motion';
import type { Team } from '../types';
import { MemberCard } from './MemberCard';
import { Card } from 'flowbite-react';

interface TeamSectionProps {
  teams: Team[];
  highlightedMemberIds?: Set<string>;
}

/**
 * チームセクションコンポーネント
 * 既存組織（リーダー＋メンバー）を表示
 */
export const TeamSection: React.FC<TeamSectionProps> = ({
  teams,
  highlightedMemberIds = new Set(),
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:max-w-3xl"
    >
      <Card className="shadow-md bg-white dark:bg-gray-800">
        <div className="space-y-3">
          {/* ヘッダー */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              既存組織
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {teams.length}チーム
            </p>
          </div>

          {/* チームリスト */}
          <div className="space-y-3">
            {teams.map((team, teamIndex) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: teamIndex * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
              >
                {/* チーム名 */}
                <div className="mb-2">
                  <h3 className="text-base font-bold text-gray-700 dark:text-gray-200">
                    {team.name}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  {/* リーダー */}
                  <div className="flex-shrink-0">
                    <MemberCard member={team.leader} />
                  </div>

                  {/* セパレーター */}
                  <div className="hidden sm:flex items-center h-full py-4">
                    <div className="w-px h-full bg-gray-300 dark:bg-gray-600"></div>
                  </div>

                  {/* メンバー */}
                  <div className="flex-1">
                    <motion.div
                      layout
                      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1"
                    >
                      {team.members.map((member, index) => (
                        <motion.div
                          key={member.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: highlightedMemberIds.has(member.id) ? 0.5 : 0,
                            duration: 0.4,
                          }}
                        >
                          <MemberCard
                            member={member}
                            isHighlighted={highlightedMemberIds.has(member.id)}
                            delay={index * 0.05}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

