import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function VotingPhase() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const getActivePlayers = useGameState((state) => state.getActivePlayers);

  const activePlayers = getActivePlayers();

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handleRevealRole = () => {
    if (selectedPlayer) {
      useGameState.setState({
        eliminatedPlayer: activePlayers.find((p) => p.id === selectedPlayer),
        players: useGameState.getState().players.map((p) =>
          p.id === selectedPlayer ? { ...p, isEliminated: true } : p
        ),
        phase: 'results',
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🗳️ Votación
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-gray-700">
              Selecciona al jugador que crees que es el impostor
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {activePlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => handleSelectPlayer(player.id)}
                className={`w-full p-4 rounded-lg font-semibold transition duration-200 ${
                  selectedPlayer === player.id
                    ? 'bg-gray-700 text-white border-2 border-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300'
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleRevealRole}
            disabled={!selectedPlayer}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Revelar Rol
          </button>
        </div>
      </div>
    </div>
  );
}
