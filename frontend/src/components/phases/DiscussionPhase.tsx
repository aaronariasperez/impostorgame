import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import Timer from '@/components/Timer';

export default function DiscussionPhase() {
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes

  const getActivePlayers = useGameState((state) => state.getActivePlayers);

  const activePlayers = getActivePlayers();

  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto move to voting
      useGameState.setState({ phase: 'voting' });
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleMoveToVoting = () => {
    useGameState.setState({ phase: 'voting' });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            💬 Fase de Discusión
          </h2>

          <Timer timeLeft={timeLeft} />

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-gray-700">
              Discutan sobre quién creen que es el impostor.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-800">Jugadores activos:</h3>
            {activePlayers.map((player) => (
              <div key={player.id} className="bg-gray-100 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">{player.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleMoveToVoting}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Pasar a Votación
          </button>
        </div>
      </div>
    </div>
  );
}
