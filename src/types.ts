/**
 * メンバーの役割
 */
export type MemberRole = 'leader' | 'member' | 'newcomer';

/**
 * MBTIの16タイプ
 */
export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

/**
 * MBTIスコア
 * 各軸は-100～100の範囲（負：左側特性、正：右側特性）
 */
export interface MBTIScore {
  type: MBTIType;
  scores: {
    EI: number; // Extraversion(正) vs Introversion(負)
    SN: number; // Intuition(正) vs Sensing(負)
    TF: number; // Feeling(正) vs Thinking(負)
    JP: number; // Perceiving(正) vs Judging(負)
  };
}

/**
 * Big Fiveスコア
 * 各次元は0～100の範囲
 */
export interface BigFiveScore {
  openness: number;        // 開放性
  conscientiousness: number; // 誠実性
  extraversion: number;     // 外向性
  agreeableness: number;    // 協調性
  neuroticism: number;      // 神経症傾向
}

/**
 * 性格特性
 */
export interface Personality {
  mbti?: MBTIScore;
  bigFive?: BigFiveScore;
}

/**
 * メンバー情報
 */
export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  avatar?: string; // 後で画像対応可能
  initials?: string; // アバターに表示するイニシャル
  color?: string; // アバターの背景色
  personality?: Personality; // 性格特性
}

/**
 * チーム情報
 */
export interface Team {
  id: string;
  name: string;
  leader: Member;
  members: Member[];
}

/**
 * 配置状態
 */
export interface AssignmentState {
  isAssigned: boolean;
  targetTeamId?: string;
}

