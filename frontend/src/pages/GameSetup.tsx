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
    // Load saved player names on mount
    setPlayerNames(loadSavedPlayerNames(3));
  }, []);

  // Update player names when player count changes
  useEffect(() => {
    setPlayerNames(loadSavedPlayerNames(playerCount));
  }, [playerCount]);

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
      const saved = localStorage.getItem('impostor_player_names');
      const savedNames = saved ? JSON.parse(saved) : {};
      savedNames[`player-${index}`] = name;
      localStorage.setItem('impostor_player_names', JSON.stringify(savedNames));
    } catch {
      // Silently fail if localStorage is not available
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
        subMessage="Servidor durmiendo, despertando... (puede tardar maximo 2 minutos)"
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img 
            src="/imagen_portada.png" 
            alt="Impostor Game" 
            className="w-full max-w-sm h-auto rounded-lg shadow-lg"
          />
        </div>

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
               Paquetes de Palabras (selecciona uno o más)
             </label>
             <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-gray-50">
               {wordPacks.map((pack) => (
                 <label key={pack.id} className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                   <input
                     type="checkbox"
                     checked={selectedPackIds.includes(pack.id)}
                     onChange={() => handleTogglePack(pack.id)}
                     className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                   />
                   <span className="ml-3 text-gray-700">{pack.name}</span>
                 </label>
               ))}
             </div>
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

          {/* Legal Links Footer */}
          <div className="flex justify-center gap-4 text-xs text-gray-600 mt-6 pt-4 border-t border-gray-200">
            <a
              href="https://raw.githubusercontent.com/aaronariasperez/impostorgame/feature/mobile/PRIVACY_POLICY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 underline"
            >
              Política de Privacidad
            </a>
            <span>•</span>
            <a
              href="https://raw.githubusercontent.com/aaronariasperez/impostorgame/feature/mobile/TERMS_OF_SERVICE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 underline"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
