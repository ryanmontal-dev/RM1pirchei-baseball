const STORAGE_KEY = 'shkoyach-sluggers-save-v1';

const DEFAULT_SAVE = {
  selectedTeamId: null,
  selectedCharacterId: null,
  highScore: 0,
  longestHomeRun: 0,
  totalHomeRuns: 0,
  championshipWins: 0,
  unlockedCharacters: ['mendy', 'tzippy', 'ari', 'shayna', 'yossi', 'ruti'],
  lastPlayedMode: 'practice'
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function saveProgress(update) {
  const next = { ...loadSave(), ...update };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function recordDerbyResult({ score, longestHomeRun, homeRuns, mode, wonChampionship }) {
  const current = loadSave();
  return saveProgress({
    highScore: Math.max(current.highScore, score),
    longestHomeRun: Math.max(current.longestHomeRun, longestHomeRun),
    totalHomeRuns: current.totalHomeRuns + homeRuns,
    championshipWins: current.championshipWins + (wonChampionship ? 1 : 0),
    lastPlayedMode: mode
  });
}
