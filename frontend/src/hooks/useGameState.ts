import { create } from 'zustand';
import { GameState, Player, PlayerRole } from '@/types/game';

interface GameStore extends GameState {
  // Setup actions
  initializeGame: (playerCount: number, impostorCount: number, civilianWord: string, impostorWord: string, wordItems?: any[]) => void;
  setPlayerName: (playerId: string, name: string) => void;

  // Game flow actions
  startGame: () => void;
  submitClue: (playerId: string, clue: string) => void;
  moveToTurnStarter: () => void;
  moveToDiscussion: () => void;
  submitVote: (playerId: string, votedForId: string) => void;
  moveToResults: () => void;
  resetGame: () => void;

  // Utility
  getCurrentCluePlayer: () => Player | null;
  getTurnStarterPlayer: () => Player | null;
  getActivePlayers: () => Player[];
  getImpostors: () => Player[];
  getCivilians: () => Player[];
}

const initialState: GameState = {
  phase: 'setup',
  players: [],
  civilianWord: '',
  impostorWord: '',
  impostorHint: '',
  currentCluePlayerIndex: 0,
  round: 1,
  votingResults: {},
  turnStarterId: undefined,
};

// Load saved player names from localStorage
const loadSavedPlayerNames = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem('impostor_player_names');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Save player names to localStorage
const savePlayerNames = (players: Player[]) => {
  try {
    const names: Record<string, string> = {};
    players.forEach((p) => {
      names[p.id] = p.name;
    });
    localStorage.setItem('impostor_player_names', JSON.stringify(names));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const useGameState = create<GameStore>((set, get) => ({
  ...initialState,
  initializeGame: (playerCount, impostorCount, civilianWord, _impostorWord, wordItems) => {
    const players: Player[] = [];
    const roles: PlayerRole[] = [];
    const savedNames = loadSavedPlayerNames();

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

    // Generate random hint for impostor from the CIVILIAN word's attributes
    let impostorHint = '';
    if (wordItems && wordItems.length > 0) {
      // Find the word item that matches the civilian word
      const civilianWordItem = wordItems.find((item: any) => item.word === civilianWord);
      if (civilianWordItem && civilianWordItem.attributes && civilianWordItem.attributes.length > 0) {
        // Select a random attribute from the civilian word
        const randomAttribute = civilianWordItem.attributes[Math.floor(Math.random() * civilianWordItem.attributes.length)];
        impostorHint = randomAttribute;
      }
    }

    // Create players with saved names if available
    for (let i = 0; i < playerCount; i++) {
      const playerId = `player-${i}`;
      const savedName = savedNames[playerId];
      players.push({
        id: playerId,
        name: savedName || `Jugador ${i + 1}`,
        role: roles[i],
        word: roles[i] === 'civilian' ? civilianWord : impostorHint,
        isEliminated: false,
      });
    }

    set({
      players,
      civilianWord,
      impostorWord: impostorHint,
      impostorHint,
      phase: 'setup',
      currentCluePlayerIndex: 0,
      round: 1,
      votingResults: {},
    });
  },

  setPlayerName: (playerId, name) => {
    set((state) => {
      const updatedPlayers = state.players.map((p) =>
        p.id === playerId ? { ...p, name } : p
      );
      savePlayerNames(updatedPlayers);
      return { players: updatedPlayers };
    });
  },

  startGame: () => {
    set({ phase: 'clue', currentCluePlayerIndex: 0 });
  },

   submitClue: (playerId, _clue) => {
    const state = get();
    const activePlayers = state.getActivePlayers();
    const currentPlayerIndex = activePlayers.findIndex((p) => p.id === playerId);

    // Move to next player or to turn starter
    if (currentPlayerIndex === activePlayers.length - 1) {
      // All players have seen their role, move to turn starter
      const randomIndex = Math.floor(Math.random() * activePlayers.length);
      const turnStarterId = activePlayers[randomIndex].id;
      set({ phase: 'turn-starter', turnStarterId });
    } else {
      // Move to next player
      set({ currentCluePlayerIndex: currentPlayerIndex + 1 });
    }
  },

  moveToTurnStarter: () => {
    const state = get();
    const activePlayers = state.getActivePlayers();
    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const turnStarterId = activePlayers[randomIndex].id;
    set({ phase: 'turn-starter', turnStarterId });
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

  getTurnStarterPlayer: () => {
    const state = get();
    return state.players.find((p) => p.id === state.turnStarterId) || null;
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
