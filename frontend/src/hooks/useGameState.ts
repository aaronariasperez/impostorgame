import { create } from 'zustand';
import { GameState, Player, PlayerRole } from '@/types/game';

interface GameStore extends GameState {
  // Setup actions
  initializeGame: (playerCount: number, impostorCount: number, civilianWord: string, impostorWord: string) => void;
  setPlayerName: (playerId: string, name: string) => void;
  
  // Game flow actions
  startGame: () => void;
  submitClue: (playerId: string, clue: string) => void;
  moveToDiscussion: () => void;
  submitVote: (playerId: string, votedForId: string) => void;
  moveToResults: () => void;
  resetGame: () => void;
  
  // Utility
  getCurrentCluePlayer: () => Player | null;
  getActivePlayers: () => Player[];
  getImpostors: () => Player[];
  getCivilians: () => Player[];
}

const initialState: GameState = {
  phase: 'setup',
  players: [],
  civilianWord: '',
  impostorWord: '',
  currentCluePlayerIndex: 0,
  round: 1,
  votingResults: {},
};

export const useGameState = create<GameStore>((set, get) => ({
  ...initialState,

  initializeGame: (playerCount, impostorCount, civilianWord, impostorWord) => {
    const players: Player[] = [];
    const roles: PlayerRole[] = [];

    // Create roles array
    for (let i = 0; i < impostorCount; i++) {
      roles.push('impostor');
    }
    for (let i = 0; i < playerCount - impostorCount; i++) {
      roles.push('civilian');
    }

    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // Create players
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: `player-${i}`,
        name: `Jugador ${i + 1}`,
        role: roles[i],
        word: roles[i] === 'civilian' ? civilianWord : impostorWord,
        isEliminated: false,
      });
    }

    set({
      players,
      civilianWord,
      impostorWord,
      phase: 'setup',
      currentCluePlayerIndex: 0,
      round: 1,
      votingResults: {},
    });
  },

  setPlayerName: (playerId, name) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, name } : p
      ),
    }));
  },

  startGame: () => {
    set({ phase: 'clue', currentCluePlayerIndex: 0 });
  },

  submitClue: (playerId, clue) => {
    const state = get();
    const activePlayers = state.getActivePlayers();
    const currentPlayerIndex = activePlayers.findIndex((p) => p.id === playerId);

    // Move to next player or to discussion
    if (currentPlayerIndex === activePlayers.length - 1) {
      // All players have seen their role, move to discussion
      set({ phase: 'discussion' });
    } else {
      // Move to next player
      set({ currentCluePlayerIndex: currentPlayerIndex + 1 });
    }
  },

  moveToDiscussion: () => {
    set({ phase: 'discussion' });
  },

  submitVote: (playerId, votedForId) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, vote: votedForId } : p
      ),
    }));
  },

  moveToResults: () => {
    const state = get();
    const votingResults = state.votingResults;
    
    // Find player with most votes
    const eliminatedPlayerId = Object.entries(votingResults).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];

    const eliminatedPlayer = state.players.find((p) => p.id === eliminatedPlayerId);

    if (eliminatedPlayer) {
      set((state) => ({
        eliminatedPlayer,
        players: state.players.map((p) =>
          p.id === eliminatedPlayerId ? { ...p, isEliminated: true } : p
        ),
        phase: 'results',
      }));
    }
  },

  resetGame: () => {
    set(initialState);
  },

  getCurrentCluePlayer: () => {
    const state = get();
    const activePlayers = state.getActivePlayers();
    return activePlayers[state.currentCluePlayerIndex] || null;
  },

  getActivePlayers: () => {
    return get().players.filter((p) => !p.isEliminated);
  },

  getImpostors: () => {
    return get().players.filter((p) => p.role === 'impostor' && !p.isEliminated);
  },

  getCivilians: () => {
    return get().players.filter((p) => p.role === 'civilian' && !p.isEliminated);
  },
}));
