export type PlayerRole = 'civilian' | 'impostor';
export type GamePhase = 'setup' | 'clue' | 'turn-starter' | 'discussion' | 'voting' | 'results' | 'game-over';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  word?: string;
  isEliminated: boolean;
  vote?: string; // id of player they voted for
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  civilianWord: string;
  impostorWord: string;
  impostorHint: string;
  currentCluePlayerIndex: number;
  round: number;
  votingResults: Record<string, number>;
  eliminatedPlayer?: Player;
  gameWinner?: 'civilians' | 'impostors';
  turnStarterId?: string;
}

export interface WordItem {
  word: string;
  attributes: string[];
}

export interface WordPack {
  id: string;
  name: string;
  description: string;
  language: string;
  words?: string[];
  wordItems?: WordItem[];
}
