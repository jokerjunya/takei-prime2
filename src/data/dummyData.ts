import type { Member, Team } from '../types';

/**
 * カラーパレット（シンプル＆プロフェッショナル）
 */
const MEMBER_COLORS = [
  'bg-gray-400',
  'bg-gray-500',
  'bg-slate-400',
  'bg-slate-500',
  'bg-zinc-400',
  'bg-zinc-500',
];

const NEWCOMER_COLORS = [
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
];

const LEADER_COLOR = 'bg-blue-600';

/**
 * メンバーのイニシャルを生成
 */
const getInitials = (name: string): string => {
  return name.substring(0, 1).toUpperCase();
};

/**
 * メンバー用カラーを取得
 */
const getMemberColor = (index: number): string => {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
};

/**
 * 新規加入者用カラーを取得
 */
const getNewcomerColor = (index: number): string => {
  return NEWCOMER_COLORS[index % NEWCOMER_COLORS.length];
};

/**
 * 新規加入者のダミーデータ
 */
export const createNewcomers = (): Member[] => {
  return ['A', 'B', 'C'].map((name, index) => ({
    id: `newcomer-${name.toLowerCase()}`,
    name,
    role: 'newcomer',
    initials: getInitials(name),
    color: getNewcomerColor(index),
  }));
};

/**
 * チームメンバーを生成
 */
const createTeamMembers = (teamIndex: number, count: number = 6): Member[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${teamIndex}-member-${i}`,
    name: `メンバー${i + 1}`,
    role: 'member' as const,
    initials: `M${i + 1}`,
    color: getMemberColor(teamIndex * 10 + i),
  }));
};

/**
 * 既存チームのダミーデータ
 */
export const createTeams = (): Team[] => {
  return [
    {
      id: 'team-1',
      name: 'チーム1',
      leader: {
        id: 'leader-1',
        name: 'リーダー1',
        role: 'leader',
        initials: 'L1',
        color: LEADER_COLOR,
      },
      members: createTeamMembers(1, 6),
    },
    {
      id: 'team-2',
      name: 'チーム2',
      leader: {
        id: 'leader-2',
        name: 'リーダー2',
        role: 'leader',
        initials: 'L2',
        color: LEADER_COLOR,
      },
      members: createTeamMembers(2, 6),
    },
    {
      id: 'team-3',
      name: 'チーム3',
      leader: {
        id: 'leader-3',
        name: 'リーダー3',
        role: 'leader',
        initials: 'L3',
        color: LEADER_COLOR,
      },
      members: createTeamMembers(3, 6),
    },
  ];
};

