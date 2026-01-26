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
     <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
       <div className="max-w-2xl mx-auto">
         <div className="bg-gray-800 rounded-lg shadow-2xl p-8 mb-6 border border-gray-700">
<h2 className="text-3xl font-bold text-center text-white mb-6">
             🗳️ Votación
           </h2>

<div className="bg-blue-900 border-l-4 border-blue-700 p-4 mb-6">
             <p className="text-gray-300">
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
                     ? 'bg-blue-600 text-white border-2 border-blue-400'
                     : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
                 }`}
              >
                {player.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleRevealRole}
            disabled={!selectedPlayer}
className="w-full bg-red-900 hover:bg-red-800 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Revelar Rol
          </button>
        </div>
      </div>
    </div>
  );
}
