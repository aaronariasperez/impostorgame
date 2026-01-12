import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { wordPackService } from '@/services/wordPackService';
import { WordPack } from '@/types/game';

export default function GameSetup() {
  const [playerCount, setPlayerCount] = useState(3);
  const [impostorCount, setImpostorCount] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: 3 }, (_, i) => `Jugador ${i + 1}`)
  );
  const [wordPacks, setWordPacks] = useState<WordPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<WordPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useGameState((state) => state.initializeGame);
  const startGame = useGameState((state) => state.startGame);
  const setPlayerName = useGameState((state) => state.setPlayerName);

  // Load saved player names from localStorage
  const loadSavedPlayerNames = (count: number): string[] => {
    try {
      const saved = localStorage.getItem('impostor_player_names');
      if (saved) {
        const savedNames = JSON.parse(saved);
        return Array.from({ length: count }, (_, i) => 
          savedNames[`player-${i}`] || `Jugador ${i + 1}`
        );
      }
    } catch {
      // Silently fail
    }
    return Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`);
  };

  useEffect(() => {
    const loadWordPacks = async () => {
      try {
        const packs = await wordPackService.getAllPacks();
        setWordPacks(packs);
        setSelectedPack(null);
      } catch (err) {
        setError('Error al cargar los paquetes de palabras');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWordPacks();
    // Load saved player names on mount
    setPlayerNames(loadSavedPlayerNames(3));
  }, []);

  // Update player names when player count changes
  useEffect(() => {
    setPlayerNames(
      loadSavedPlayerNames(playerCount)
    );
  }, [playerCount]);

  const handleSelectPack = async (packId: string) => {
    try {
      const pack = await wordPackService.getPackById(packId);
      setSelectedPack(pack);
    } catch (err) {
      setError('Error al cargar el paquete de palabras');
      console.error(err);
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    if (!selectedPack?.words || selectedPack.words.length < 1) {
      setError('Paquete de palabras inválido');
      return;
    }

    const shuffledWords = [...selectedPack.words].sort(() => Math.random() - 0.5);
    const civilianWord = shuffledWords[0];

    initializeGame(playerCount, impostorCount, civilianWord, '', selectedPack.wordItems);

    // Set player names
    for (let i = 0; i < playerCount; i++) {
      setPlayerName(`player-${i}`, playerNames[i]);
    }

    startGame();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Cargando paquetes de palabras...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🎭 Impostor
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Player Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Jugadores: {playerCount}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>12</span>
            </div>
          </div>

          {/* Impostor Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Impostores: {impostorCount}
            </label>
            <input
              type="range"
              min="1"
              max={Math.floor(playerCount / 2)}
              value={impostorCount}
              onChange={(e) => setImpostorCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>{Math.floor(playerCount / 2)}</span>
            </div>
          </div>

          {/* Player Names */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombres de Jugadores
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Jugador ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
            </div>
          </div>

          {/* Word Pack Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paquete de Palabras
            </label>
            <select
              value={selectedPack?.id || ''}
              onChange={(e) => handleSelectPack(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecciona un paquete de palabras</option>
              {wordPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
            {selectedPack && (
              <p className="text-sm text-gray-600 mt-2">{selectedPack.description}</p>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            disabled={!selectedPack}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Comenzar Juego
          </button>
        </div>
      </div>
    </div>
  );
}
