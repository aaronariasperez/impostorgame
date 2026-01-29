import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { wordPackService } from '@/services/wordPackService';
import { logGameEvent } from '@/services/telemetryService';
import LoadingScreen from '@/components/LoadingScreen';
import { WordPack } from '@/types/game';

export default function GameSetup() {
  const [playerCount, setPlayerCount] = useState(3);
  const [impostorCount, setImpostorCount] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: 3 }, (_, i) => `Jugador ${i + 1}`)
  );
  const [wordPacks, setWordPacks] = useState<WordPack[]>([]);
  const [selectedPackIds, setSelectedPackIds] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<WordPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeGame = useGameState((state) => state.initializeGame);
  const startGame = useGameState((state) => state.startGame);
  const setPlayerName = useGameState((state) => state.setPlayerName);

  // Load saved player names from localStorage
  const loadSavedPlayerNames = (count: number): string[] => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`);
      }
      const saved = localStorage.getItem('impostor_player_names');
      if (saved) {
        const savedNames = JSON.parse(saved);
        return Array.from({ length: count }, (_, i) =>
          savedNames[`player-${i}`] || `Jugador ${i + 1}`
        );
      }
    } catch (err) {
      console.error('Error loading player names:', err);
    }
    return Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`);
  };

  // Load saved game configuration from localStorage
  const loadSavedGameConfig = () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return { playerCount: 3, impostorCount: 1 };
      }
      const saved = localStorage.getItem('impostor_game_config');
      if (saved) {
        const config = JSON.parse(saved);
        return {
          playerCount: config.playerCount || 3,
          impostorCount: config.impostorCount || 1,
        };
      }
    } catch (err) {
      console.error('Error loading game config:', err);
    }
    return { playerCount: 3, impostorCount: 1 };
  };

  // Save game configuration to localStorage
  const saveGameConfig = (players: number, impostors: number) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.setItem(
        'impostor_game_config',
        JSON.stringify({ playerCount: players, impostorCount: impostors })
      );
    } catch (err) {
      console.error('Error saving game config:', err);
    }
  };

  // Load word packs and initial configuration on mount
  useEffect(() => {
    const loadWordPacks = async () => {
      try {
        const packs = await wordPackService.getAllPacks();
        
        // Sort packs: Pack facil first, then Pack dificil
        const sortedPacks = packs.sort((a, b) => {
          const order = ['pack facil', 'pack dificil'];
          const aIndex = order.indexOf(a.id.toLowerCase());
          const bIndex = order.indexOf(b.id.toLowerCase());
          
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        
        setWordPacks(sortedPacks);
        setSelectedPackIds([]);
        setSelectedPack(null);
      } catch (err) {
        setError('Error al cargar los paquetes de palabras');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWordPacks();
    
    // Load saved configuration on mount
    if (!isInitialized) {
      const savedConfig = loadSavedGameConfig();
      setPlayerCount(savedConfig.playerCount);
      setImpostorCount(savedConfig.impostorCount);
      setPlayerNames(loadSavedPlayerNames(savedConfig.playerCount));
      setIsInitialized(true);
    }
  }, []);

  // Update player names when player count changes
  useEffect(() => {
    if (isInitialized) {
      setPlayerNames(loadSavedPlayerNames(playerCount));
    }
  }, [playerCount, isInitialized]);

  // Adjust impostor count when player count changes
  useEffect(() => {
    if (isInitialized) {
      const maxImpostors = Math.floor(playerCount / 2);
      if (impostorCount > maxImpostors) {
        setImpostorCount(maxImpostors);
      }
    }
  }, [playerCount, isInitialized]);

  // Save game configuration when it changes
  useEffect(() => {
    if (isInitialized) {
      saveGameConfig(playerCount, impostorCount);
    }
  }, [playerCount, impostorCount, isInitialized]);

  const handleTogglePack = (packId: string) => {
    const newSelectedIds = selectedPackIds.includes(packId)
      ? selectedPackIds.filter((id) => id !== packId)
      : [...selectedPackIds, packId];

    setSelectedPackIds(newSelectedIds);

    if (newSelectedIds.length === 0) {
      setSelectedPack(null);
      return;
    }

    const selectedPacks = wordPacks.filter((pack) =>
      newSelectedIds.includes(pack.id)
    );

    if (selectedPacks.length > 0) {
      const packNames = selectedPacks.map((p) => p.name).join(' + ');
      const packDescription =
        selectedPacks.length === 1
          ? selectedPacks[0].description
          : `Combinación de: ${selectedPacks.map((p) => p.name).join(', ')}`;

      setSelectedPack({
        id: newSelectedIds.join(','),
        name: packNames,
        description: packDescription,
        language: selectedPacks[0].language || 'es',
        words: [],
      });
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    
    // Save to localStorage immediately
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const saved = localStorage.getItem('impostor_player_names');
      const savedNames = saved ? JSON.parse(saved) : {};
      savedNames[`player-${index}`] = name;
      localStorage.setItem('impostor_player_names', JSON.stringify(savedNames));
    } catch (err) {
      console.error('Error saving player name:', err);
    }
  };

  const handleStartGame = async () => {
    if (!selectedPackIds || selectedPackIds.length === 0) {
      setError('Debes seleccionar al menos un paquete');
      return;
    }

    try {
      setLoading(true);
      const { civilianWord, impostorHint } = await wordPackService.getSelection(
        selectedPackIds
      );

      initializeGame(playerCount, impostorCount, civilianWord, impostorHint);

      for (let i = 0; i < playerCount; i++) {
        setPlayerName(`player-${i}`, playerNames[i]);
      }

      logGameEvent('game_start', {
        playerCount,
        impostorCount,
        wordPackIds: selectedPackIds,
      });

      startGame();
    } catch (err) {
      setError('Error al iniciar la partida. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Cargando paquetes de palabras..."
        subMessage="Conectando con la base de datos..."
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="flex justify-center mb-8">
          <img 
            src="/imagen_portada.png" 
            alt="Impostor Game" 
            className="w-full max-w-sm h-auto rounded-lg shadow-lg"
          />
        </div>

{error && (
           <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
             {error}
           </div>
         )}

        <div className="space-y-6">
          {/* Player Count */}
          <div>
<label className="block text-sm font-semibold text-gray-300 mb-2">
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
<label className="block text-sm font-semibold text-gray-300 mb-2">
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
<label className="block text-sm font-semibold text-gray-300 mb-2">
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
className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              ))}
            </div>
          </div>

           {/* Word Pack Selection */}
           <div>
<label className="block text-sm font-semibold text-gray-300 mb-2">
                Paquetes de Palabras (selecciona uno o más)
             </label>
<div className="space-y-2 border border-gray-600 rounded-lg p-3 bg-gray-700">
               {wordPacks.map((pack) => (
<label key={pack.id} className="flex items-center cursor-pointer hover:bg-gray-600 p-2 rounded">
                   <input
                     type="checkbox"
                     checked={selectedPackIds.includes(pack.id)}
                     onChange={() => handleTogglePack(pack.id)}
className="w-4 h-4 text-gray-500 rounded focus:ring-2 focus:ring-gray-400"
                   />
<span className="ml-3 text-gray-300">{pack.name}</span>
                 </label>
               ))}
             </div>
             {selectedPack && (
<p className="text-sm text-gray-400 mt-2">{selectedPack.description}</p>
             )}
           </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            disabled={!selectedPack}
className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Comenzar Juego
          </button>

          {/* Legal Links Footer */}
<div className="flex justify-center gap-4 text-xs text-gray-400 mt-6 pt-4 border-t border-gray-700">
            <a
              href="https://raw.githubusercontent.com/aaronariasperez/impostorgame/feature/mobile/PRIVACY_POLICY.md"
              target="_blank"
              rel="noopener noreferrer"
className="hover:text-gray-300 underline"
            >
              Política de Privacidad
            </a>
            <span>•</span>
            <a
              href="https://raw.githubusercontent.com/aaronariasperez/impostorgame/feature/mobile/TERMS_OF_SERVICE.md"
              target="_blank"
              rel="noopener noreferrer"
className="hover:text-gray-300 underline"
            >
              Términos de Servicio
            </a>
          </div>

          {/* Buy Me a Coffee Link */}
          <div className="text-center mt-4">
            <a
              href="https://buymeacoffee.com/aaronarias"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              ☕ ¿Me invitas a un café? (sin presión)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
