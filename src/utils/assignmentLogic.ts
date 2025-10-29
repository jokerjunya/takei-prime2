import type { Team, Member } from '../types';
import { pairScoreA, explainPairA } from './matching';

/**
 * 配置戦略のタイプ
 */
export type AssignmentStrategy = 'even' | 'weighted' | 'compatibility';

/**
 * 相性情報
 */
export interface CompatibilityInfo {
  score: number;
  explanation: string[];
}

/**
 * 配置結果
 */
export interface AssignmentResult {
  teams: Team[];
  assignments: Map<string, string>; // newcomerId -> teamId
  scores?: Map<string, CompatibilityInfo>; // newcomerId -> compatibility info
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
    // 新メンバーは左端（リーダーの直後）に追加
    const targetTeam = sortedTeams[0];
    targetTeam.members.unshift(newcomer);
    assignments.set(newcomer.id, targetTeam.id);
  });

  return {
    teams: updatedTeams,
    assignments,
  };
};

/**
 * 相性ベース配置ロジック
 * Big Five類似度 + MBTIボーナスで最適な組み合わせを決定
 * 均等配置を前提に、相性スコアが最大になるように割り当てる
 * 
 * @param teams - 既存チーム
 * @param newcomers - 新規加入者
 * @returns 配置結果（スコア情報付き）
 */
export const assignNewcomersCompatibility = (
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
  const scores = new Map<string, CompatibilityInfo>();

  // リーダー × 新規加入者の全組み合わせでスコア計算
  const pairs: Array<{
    newcomer: Member;
    team: Team;
    leader: Member;
    score: number;
    explanation: string[];
  }> = [];

  for (const newcomer of newcomers) {
    for (const team of updatedTeams) {
      const leader = team.leader;
      
      // 性格特性が存在する場合のみスコア計算
      if (
        newcomer.personality?.bigFive &&
        newcomer.personality?.mbti &&
        leader.personality?.bigFive &&
        leader.personality?.mbti
      ) {
        const score = pairScoreA(
          leader.personality.bigFive,
          newcomer.personality.bigFive,
          leader.personality.mbti,
          newcomer.personality.mbti
        );
        const explanation = explainPairA(
          leader.personality.bigFive,
          newcomer.personality.bigFive,
          leader.personality.mbti,
          newcomer.personality.mbti
        );
        
        pairs.push({
          newcomer,
          team,
          leader,
          score,
          explanation,
        });
      }
    }
  }

  // スコアの高い順にソート
  pairs.sort((a, b) => b.score - a.score);

  // 貪欲法で割り当て（各リーダー・新規加入者は1回だけ使用）
  const usedNewcomers = new Set<string>();
  const usedTeams = new Set<string>();

  for (const pair of pairs) {
    if (
      !usedNewcomers.has(pair.newcomer.id) &&
      !usedTeams.has(pair.team.id)
    ) {
      // チームに新規加入者を追加（左端）
      pair.team.members.unshift(pair.newcomer);
      assignments.set(pair.newcomer.id, pair.team.id);
      scores.set(pair.newcomer.id, {
        score: pair.score,
        explanation: pair.explanation,
      });
      
      usedNewcomers.add(pair.newcomer.id);
      usedTeams.add(pair.team.id);
    }
  }

  return {
    teams: updatedTeams,
    assignments,
    scores,
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
    case 'compatibility':
      return assignNewcomersCompatibility(teams, newcomers);
    case 'weighted':
      return assignNewcomersWeighted(teams, newcomers);
    case 'even':
    default:
      return assignNewcomersEvenly(teams, newcomers);
  }
};

