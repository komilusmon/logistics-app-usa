import { US_STATES, STATES_BY_ID } from '../data/states';
import { StateData, SearchResult } from '../types/state';

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Common typo mappings and dispatcher shorthands
 */
const COMMON_TYPOS: Record<string, string> = {
  'CAL': 'CA',
  'CALIF': 'CA',
  'TEX': 'TX',
  'TEHAS': 'TX',
  'FLO': 'FL',
  'FLA': 'FL',
  'ILL': 'IL',
  'MASS': 'MA',
  'MICH': 'MI',
  'MINN': 'MN',
  'MISS': 'MS',
  'PENN': 'PA',
  'WASH': 'WA',
  'WISC': 'WI',
  'ARIZ': 'AZ',
  'COLO': 'CO',
  'CONN': 'CT',
  'TENN': 'TN',
  'KANS': 'KS',
  'NEBR': 'NE',
  'NEB': 'NE',
  'NEV': 'NV',
  'OKLA': 'OK',
  'ORE': 'OR',
  'WYO': 'WY',
  'W': 'WY', // specifically user note: Wyoming-W
  'VIRG': 'VA',
  'WVA': 'WV',
  'W.VA': 'WV',
  'N.Y.': 'NY',
  'N.J.': 'NJ',
  'N.C.': 'NC',
  'S.C.': 'SC',
  'N.D.': 'ND',
  'S.D.': 'SD',
  'D.C.': 'DC',
  'WASHDC': 'DC',
};

/**
 * Searches and identifies the state by abbreviation, name, or typo
 */
export function searchState(rawQuery: string): SearchResult {
  const query = (rawQuery || '').trim();
  if (!query) {
    return {
      state: null,
      matchType: 'none',
      query: '',
    };
  }

  const upperQuery = query.toUpperCase();
  const lowerQuery = query.toLowerCase();

  // 1. Direct Abbreviation match
  const directState = STATES_BY_ID.get(upperQuery);
  if (directState) {
    const isAlias = directState.aliases && directState.aliases.map(a => a.toUpperCase()).includes(upperQuery);
    return {
      state: directState,
      matchType: isAlias ? 'alias' : 'exact_code',
      query,
      explanationUz: isAlias
        ? `"${query}" qisqartmasi ${directState.name} (${directState.id}) shtatiga mos keladi.`
        : `To'g'ri topildi! ${directState.id} qisqartmasi ${directState.name} shtatiga tegishli.`,
    };
  }

  // 2. Direct State Name match (case-insensitive)
  const nameMatch = US_STATES.find(s => s.name.toLowerCase() === lowerQuery);
  if (nameMatch) {
    return {
      state: nameMatch,
      matchType: 'exact_name',
      query,
      explanationUz: `Shtat nomi to'g'ri kiritildi: ${nameMatch.name}. Rasmiy qisqartmasi: ${nameMatch.id}.`,
    };
  }

  // 3. Known common abbreviation typos & shorthands
  const cleanTypoKey = upperQuery.replace(/[^A-Z]/g, '');
  if (COMMON_TYPOS[upperQuery] || COMMON_TYPOS[cleanTypoKey]) {
    const targetId = COMMON_TYPOS[upperQuery] || COMMON_TYPOS[cleanTypoKey];
    const targetState = STATES_BY_ID.get(targetId);
    if (targetState) {
      return {
        state: targetState,
        matchType: 'fuzzy',
        query,
        suggestedState: targetState,
        explanationUz: `Siz "${query}" deb yozdingiz. Bu ${targetState.name} (${targetState.id}) ning keng tarqalgan xato/norasmiy shaklidir. To'g'ri qisqartma: ${targetState.id}.`,
      };
    }
  }

  // 4. Starts-with or partial state name match
  const partialName = US_STATES.filter(s =>
    s.name.toLowerCase().startsWith(lowerQuery) ||
    lowerQuery.startsWith(s.name.toLowerCase()) ||
    s.name.toLowerCase().includes(lowerQuery)
  );
  if (partialName.length === 1) {
    const targetState = partialName[0];
    return {
      state: targetState,
      matchType: 'fuzzy',
      query,
      suggestedState: targetState,
      explanationUz: `"${query}" so'rovi bo'yicha ${targetState.name} (${targetState.id}) aniqlandi.`,
    };
  }

  // 5. Fuzzy match against 2-letter codes and state names using Levenshtein distance
  interface ScoredState {
    state: StateData;
    score: number;
    reason: string;
  }

  const candidates: ScoredState[] = [];

  for (const st of US_STATES) {
    const codeDist = levenshteinDistance(upperQuery, st.id);
    const nameDist = levenshteinDistance(lowerQuery, st.name.toLowerCase());
    
    // Check if query is 2 letters (abbreviation typo)
    if (upperQuery.length === 2) {
      if (codeDist === 1) {
        candidates.push({
          state: st,
          score: 1,
          reason: `1 harf farq qiladi: ${st.id} (${st.name})`,
        });
      }
    } else if (upperQuery.length <= 4) {
      // Short query
      if (codeDist <= 1) {
        candidates.push({ state: st, score: codeDist, reason: `Qisqartmaga yaqin: ${st.id}` });
      } else if (st.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes(st.name.toLowerCase().slice(0, 3))) {
        candidates.push({ state: st, score: 2, reason: `Nomi bo'yicha o'xshash: ${st.name}` });
      }
    }

    if (nameDist <= 3) {
      candidates.push({
        state: st,
        score: nameDist + 2,
        reason: `Nomiga juda yaqin: ${st.name} (${st.id})`,
      });
    }
  }

  // Sort candidates by lowest distance/score
  candidates.sort((a, b) => a.score - b.score);

  if (candidates.length > 0) {
    const bestMatch = candidates[0].state;
    const alternatives = Array.from(new Set(candidates.slice(1, 4).map(c => c.state)));
    return {
      state: bestMatch,
      matchType: 'fuzzy',
      query,
      suggestedState: bestMatch,
      alternativeMatches: alternatives,
      explanationUz: `Diqqat: "${query}" rasmiy qisqartma emas, xatolik bor! Eng yaqin to'g'ri javob: ${bestMatch.name} (${bestMatch.id}).`,
    };
  }

  // 6. Fallback if completely unrecognizable
  return {
    state: null,
    matchType: 'none',
    query,
    explanationUz: `"${query}" qisqartmasi yoki shtati topilmadi. Iltimos, 2 xonali shtat kodi (masalan: TX, CA, IL, NY) yoki shtat nomini kiriting.`,
  };
}
