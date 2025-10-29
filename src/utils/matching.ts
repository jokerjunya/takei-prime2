import type { BigFiveScore, MBTIScore } from '../types';

/**
 * MBTI気質タイプ
 */
export type Temperament = 'NF' | 'NT' | 'SJ' | 'SP';

/**
 * MBTIパース結果
 */
export interface ParsedMBTI {
  E: boolean; // true: Extraversion, false: Introversion
  N: boolean; // true: Intuition, false: Sensing
  T: boolean; // true: Thinking, false: Feeling
  J: boolean; // true: Judging, false: Perceiving
  temperament: Temperament;
}

/**
 * MBTIタイプ文字列をパースして各軸と気質を抽出
 * 
 * @param mbtiScore - MBTIスコア
 * @returns パース結果
 */
export const parseMbti = (mbtiScore: MBTIScore): ParsedMBTI => {
  const { type } = mbtiScore;
  
  const E = type[0] === 'E';
  const N = type[1] === 'N';
  const T = type[2] === 'T';
  const J = type[3] === 'J';
  
  // 気質を判定（NF, NT, SJ, SP）
  let temperament: Temperament;
  if (N && !T) {
    temperament = 'NF';
  } else if (N && T) {
    temperament = 'NT';
  } else if (!N && J) {
    temperament = 'SJ';
  } else {
    temperament = 'SP';
  }
  
  return { E, N, T, J, temperament };
};

/**
 * 相性スコアA案の計算
 * 
 * Big Five類似度 + MBTIボーナス
 * 
 * @param leaderBF - リーダーのBig Five
 * @param candBF - 候補者のBig Five
 * @param leaderMBTI - リーダーのMBTI
 * @param candMBTI - 候補者のMBTI
 * @returns 相性スコア（0-1）
 */
export const pairScoreA = (
  leaderBF: BigFiveScore,
  candBF: BigFiveScore,
  leaderMBTI: MBTIScore,
  candMBTI: MBTIScore
): number => {
  // Big Five類似度計算
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;
  const deltas = traits.map(trait => Math.abs(candBF[trait] - leaderBF[trait]) / 100);
  const meanDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
  
  const alpha = 3;
  const similarity = Math.exp(-alpha * meanDelta);
  
  // MBTIボーナス計算
  const leaderParsed = parseMbti(leaderMBTI);
  const candParsed = parseMbti(candMBTI);
  
  let bonus = 0;
  
  // 同気質（最大の影響）
  if (leaderParsed.temperament === candParsed.temperament) {
    bonus += 0.04;
  }
  
  // E/I一致
  if (leaderParsed.E === candParsed.E) {
    bonus += 0.02;
  }
  
  // J/P一致
  if (leaderParsed.J === candParsed.J) {
    bonus += 0.02;
  }
  
  // N/S一致
  if (leaderParsed.N === candParsed.N) {
    bonus += 0.015;
  }
  
  // T/F一致
  if (leaderParsed.T === candParsed.T) {
    bonus += 0.015;
  }
  
  // ボーナスの上限（0.08）
  bonus = Math.min(bonus, 0.08);
  
  // 最終スコア（0-1の範囲にクランプ）
  const finalScore = Math.max(0, Math.min(1, similarity + bonus));
  
  return finalScore;
};

/**
 * 相性スコアの理由を説明する文字列を生成
 * 
 * @param leaderBF - リーダーのBig Five
 * @param candBF - 候補者のBig Five
 * @param leaderMBTI - リーダーのMBTI
 * @param candMBTI - 候補者のMBTI
 * @returns 説明文の配列
 */
export const explainPairA = (
  leaderBF: BigFiveScore,
  candBF: BigFiveScore,
  leaderMBTI: MBTIScore,
  candMBTI: MBTIScore
): string[] => {
  const explanations: string[] = [];
  
  // Big Five類似度の説明
  const traits = [
    { key: 'openness', label: '開放性' },
    { key: 'conscientiousness', label: '誠実性' },
    { key: 'extraversion', label: '外向性' },
    { key: 'agreeableness', label: '協調性' },
    { key: 'neuroticism', label: '情緒安定性' },
  ] as const;
  
  const similarTraits = traits.filter(
    trait => Math.abs(candBF[trait.key] - leaderBF[trait.key]) < 20
  );
  
  if (similarTraits.length > 0) {
    const traitNames = similarTraits.map(t => t.label).join('、');
    explanations.push(`${traitNames}が近い`);
  }
  
  // MBTIの説明
  const leaderParsed = parseMbti(leaderMBTI);
  const candParsed = parseMbti(candMBTI);
  
  if (leaderParsed.temperament === candParsed.temperament) {
    const tempNames: Record<Temperament, string> = {
      'NF': '理想主義者',
      'NT': '合理主義者',
      'SJ': '保護者',
      'SP': '職人',
    };
    explanations.push(`同じ${tempNames[leaderParsed.temperament]}気質`);
  }
  
  const mbtiMatches: string[] = [];
  if (leaderParsed.E === candParsed.E) {
    mbtiMatches.push(leaderParsed.E ? '外向型' : '内向型');
  }
  if (leaderParsed.N === candParsed.N) {
    mbtiMatches.push(leaderParsed.N ? '直感型' : '感覚型');
  }
  if (leaderParsed.T === candParsed.T) {
    mbtiMatches.push(leaderParsed.T ? '思考型' : '感情型');
  }
  if (leaderParsed.J === candParsed.J) {
    mbtiMatches.push(leaderParsed.J ? '判断型' : '知覚型');
  }
  
  if (mbtiMatches.length > 0) {
    explanations.push(`MBTI: ${mbtiMatches.join('・')}`);
  }
  
  // 説明がない場合のフォールバック
  if (explanations.length === 0) {
    explanations.push('バランスの取れた組み合わせ');
  }
  
  return explanations;
};

/**
 * 思考の近さを計算（Big Fiveの開放性に基づく）
 * 
 * @param leaderBF - リーダーのBig Five
 * @param candBF - 候補者のBig Five
 * @returns 思考の近さスコア（0-1）
 */
export const calculateThinkingSimilarity = (
  leaderBF: BigFiveScore,
  candBF: BigFiveScore
): number => {
  return 1 - Math.abs(leaderBF.openness - candBF.openness) / 100;
};

/**
 * 価値観の親和性を計算（Big Fiveの協調性に基づく）
 * 
 * @param leaderBF - リーダーのBig Five
 * @param candBF - 候補者のBig Five
 * @returns 価値観の親和性スコア（0-1）
 */
export const calculateValueAlignment = (
  leaderBF: BigFiveScore,
  candBF: BigFiveScore
): number => {
  return 1 - Math.abs(leaderBF.agreeableness - candBF.agreeableness) / 100;
};

/**
 * コミュニケーション傾向を計算（Big Fiveの外向性に基づく）
 * 
 * @param leaderBF - リーダーのBig Five
 * @param candBF - 候補者のBig Five
 * @returns コミュニケーション傾向スコア（0-1、高いほど活発）
 */
export const calculateCommunicationTendency = (
  leaderBF: BigFiveScore,
  candBF: BigFiveScore
): number => {
  return (leaderBF.extraversion + candBF.extraversion) / 200;
};

/**
 * スコアに応じたラベルを返す
 * 
 * @param score - スコア（0-1）
 * @returns ラベル文字列
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 0.8) return '非常に高い';
  if (score >= 0.6) return '高い';
  if (score >= 0.4) return 'やや高い';
  if (score >= 0.2) return '普通';
  return '低い';
};

/**
 * 総合スコアに応じた説明文を返す
 * 
 * @param score - 総合スコア（0-1）
 * @returns 説明文
 */
export const getCompatibilityDescription = (score: number): string => {
  if (score >= 0.8) {
    return '二人は非常に相性が良く、価値観や考え方が似ています。スムーズに協力し合える理想的な組み合わせです。';
  }
  if (score >= 0.6) {
    return '二人は良好な相性を持っています。共通点が多く、お互いを理解しやすいでしょう。';
  }
  if (score >= 0.4) {
    return '二人はバランスの取れた組み合わせです。違いを活かして補完し合えるでしょう。';
  }
  if (score >= 0.2) {
    return '二人の特性にはやや違いがあります。お互いの違いを尊重することが大切です。';
  }
  return '二人の特性は大きく異なります。コミュニケーションを重視して相互理解を深めましょう。';
};



