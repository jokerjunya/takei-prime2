import { motion } from 'framer-motion';
import type { Team, Member } from '../types';
import { MemberCard } from './MemberCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Users, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface TeamSectionProps {
  teams: Team[];
  highlightedMemberIds?: Set<string>;
  onMemberClick?: (member: Member) => void;
}

/**
 * チームセクションコンポーネント
 * 既存組織（リーダー＋メンバー）を表示
 */
export const TeamSection: React.FC<TeamSectionProps> = ({
  teams,
  highlightedMemberIds = new Set(),
  onMemberClick,
}) => {
  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:max-w-5xl"
    >
      <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">既存組織</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Users className="w-3 h-3" />
                {teams.length}チーム
              </Badge>
              <Badge variant="secondary" className="gap-1">
                {totalMembers}名
              </Badge>
            </div>
          </div>
          <CardDescription>
            リーダーとメンバーで構成されたチーム
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* チームリスト */}
          <div className="space-y-4">
            {teams.map((team, teamIndex) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: teamIndex * 0.1 }}
                className={cn(
                  "relative border-2 rounded-xl p-5 transition-all duration-300",
                  "bg-gradient-to-br from-muted/30 to-muted/10",
                  "hover:shadow-md hover:border-primary/50"
                )}
              >
                {/* チーム名とメンバー数 */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {team.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {team.members.length}名
                  </Badge>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-5">
                  {/* リーダー */}
                  <div className="flex-shrink-0">
                    <div className="bg-primary/5 rounded-xl p-2.5 border border-primary/20">
                      <MemberCard member={team.leader} onClick={onMemberClick} />
                    </div>
                  </div>

                  {/* セパレーター */}
                  <div className="hidden lg:flex items-center justify-center px-1">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* メンバー */}
                  <div className="flex-1 w-full">
                    <motion.div
                      layout
                      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
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
                          className={cn(
                            "rounded-lg p-1.5 transition-colors",
                            highlightedMemberIds.has(member.id) 
                              ? "bg-orange-50 dark:bg-orange-950/20" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          <MemberCard
                            member={member}
                            isHighlighted={highlightedMemberIds.has(member.id)}
                            delay={index * 0.05}
                            onClick={onMemberClick}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

