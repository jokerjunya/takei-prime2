/**
 * メンバーの役割
 */
export type MemberRole = 'leader' | 'member' | 'newcomer';

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

