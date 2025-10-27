import type { Team, Member } from '../types';

/**
 * 配置戦略のタイプ
 */
export type AssignmentStrategy = 'even' | 'weighted';

/**
 * 配置結果
 */
export interface AssignmentResult {
  teams: Team[];
  assignments: Map<string, string>; // newcomerId -> teamId
}

/**
 * 均等割り当てロジック（ダミー版）
 * チームメンバー数が少ない順に新規加入者を割り当てる
 * 
 * @param teams - 既存チーム
 * @param newcomers - 新規加入者
 * @returns 配置結果
 */
export const assignNewcomersEvenly = (
  teams: Team[],
  newcomers: Member[]
): AssignmentResult => {
  // チームをコピー（イミュータブル）
  const updatedTeams = teams.map(team => ({
    ...team,
    members: [...team.members],
  }));

  // 新規加入者とチームのマッピング
  const assignments = new Map<string, string>();

  // 新規加入者を順番に配置
  newcomers.forEach((newcomer) => {
    // メンバー数が最小のチームを見つける（毎回再計算）
    const sortedTeams = [...updatedTeams].sort(
      (a, b) => a.members.length - b.members.length
    );
    
    // 最小チームに追加（均等割り当て）
    const targetTeam = sortedTeams[0];
    targetTeam.members.push(newcomer);
    assignments.set(newcomer.id, targetTeam.id);
  });

  return {
    teams: updatedTeams,
    assignments,
  };
};

/**
 * 重み付き配置ロジック（将来の拡張用プレースホルダー）
 * MBTI/Big Fiveなどの性格特性を考慮した配置
 * 
 * @param teams - 既存チーム
 * @param newcomers - 新規加入者
 * @returns 配置結果
 */
export const assignNewcomersWeighted = (
  teams: Team[],
  newcomers: Member[]
): AssignmentResult => {
  // 現時点では均等割り当てと同じ
  // TODO: 性格特性、スキル、経験値などを考慮したロジックを実装
  return assignNewcomersEvenly(teams, newcomers);
};

/**
 * 配置戦略に応じた割り当て処理
 * 
 * @param teams - 既存チーム
 * @param newcomers - 新規加入者
 * @param strategy - 配置戦略
 * @returns 配置結果
 */
export const assignNewcomers = (
  teams: Team[],
  newcomers: Member[],
  strategy: AssignmentStrategy = 'even'
): AssignmentResult => {
  switch (strategy) {
    case 'weighted':
      return assignNewcomersWeighted(teams, newcomers);
    case 'even':
    default:
      return assignNewcomersEvenly(teams, newcomers);
  }
};

