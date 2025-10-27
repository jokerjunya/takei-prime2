import type { Member, Team, MBTIScore, BigFiveScore, MBTIType, Personality } from '../types';

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
 * ランダムな数値を生成（min～max）
 */
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * MBTIスコアを生成
 * スコアからMBTIタイプを判定
 */
const generateMBTIScore = (): MBTIScore => {
  const EI = randomInRange(-100, 100);
  const SN = randomInRange(-100, 100);
  const TF = randomInRange(-100, 100);
  const JP = randomInRange(-100, 100);

  // スコアからタイプを判定
  const e_i = EI >= 0 ? 'E' : 'I';
  const s_n = SN >= 0 ? 'N' : 'S';
  const t_f = TF >= 0 ? 'F' : 'T';
  const j_p = JP >= 0 ? 'P' : 'J';
  const type = `${e_i}${s_n}${t_f}${j_p}` as MBTIType;

  return {
    type,
    scores: { EI, SN, TF, JP },
  };
};

/**
 * Big Fiveスコアを生成
 */
const generateBigFiveScore = (): BigFiveScore => {
  return {
    openness: randomInRange(0, 100),
    conscientiousness: randomInRange(0, 100),
    extraversion: randomInRange(0, 100),
    agreeableness: randomInRange(0, 100),
    neuroticism: randomInRange(0, 100),
  };
};

/**
 * 性格特性を生成
 */
const generatePersonality = (): Personality => {
  return {
    mbti: generateMBTIScore(),
    bigFive: generateBigFiveScore(),
  };
};

/**
 * 新規加入者のダミーデータ
 */
export const createNewcomers = (): Member[] => {
  const newcomerNames = ['田中 太郎', '佐藤 花子', '鈴木 一郎'];
  return newcomerNames.map((name, index) => ({
    id: `newcomer-${index}`,
    name,
    role: 'newcomer',
    initials: name.split(' ')[0].substring(0, 1),
    color: getNewcomerColor(index),
    personality: generatePersonality(),
  }));
};

/**
 * チームメンバーを生成
 */
const createTeamMembers = (teamIndex: number, count: number = 6): Member[] => {
  const memberNames = [
    ['山田 次郎', '伊藤 美咲', '渡辺 健太', '高橋 由美', '中村 翔太', '小林 さくら'],
    ['加藤 大輔', '吉田 愛', '山本 誠', '松本 香織', '井上 優', '木村 恵子'],
    ['林 拓也', '斎藤 麻衣', '清水 雄介', '山崎 奈々', '森 大樹', '池田 結衣'],
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const name = memberNames[teamIndex - 1][i];
    return {
      id: `team-${teamIndex}-member-${i}`,
      name,
      role: 'member' as const,
      initials: name.split(' ')[0].substring(0, 1),
      color: getMemberColor(teamIndex * 10 + i),
      personality: generatePersonality(),
    };
  });
};

/**
 * 既存チームのダミーデータ
 */
export const createTeams = (): Team[] => {
  const leaderNames = ['山田 太郎', '佐々木 健', '田村 優子'];
  
  return [
    {
      id: 'team-1',
      name: 'チーム1',
      leader: {
        id: 'leader-1',
        name: leaderNames[0],
        role: 'leader',
        initials: leaderNames[0].split(' ')[0].substring(0, 1),
        color: LEADER_COLOR,
        personality: generatePersonality(),
      },
      members: createTeamMembers(1, 6),
    },
    {
      id: 'team-2',
      name: 'チーム2',
      leader: {
        id: 'leader-2',
        name: leaderNames[1],
        role: 'leader',
        initials: leaderNames[1].split(' ')[0].substring(0, 1),
        color: LEADER_COLOR,
        personality: generatePersonality(),
      },
      members: createTeamMembers(2, 6),
    },
    {
      id: 'team-3',
      name: 'チーム3',
      leader: {
        id: 'leader-3',
        name: leaderNames[2],
        role: 'leader',
        initials: leaderNames[2].split(' ')[0].substring(0, 1),
        color: LEADER_COLOR,
        personality: generatePersonality(),
      },
      members: createTeamMembers(3, 6),
    },
  ];
};

