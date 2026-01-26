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
     <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
       <div className="max-w-2xl mx-auto">
         <div className="bg-gray-800 rounded-lg shadow-2xl p-8 mb-6 border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            💬 Fase de Discusión
          </h2>

          <Timer timeLeft={timeLeft} />

<div className="bg-blue-900 border-l-4 border-blue-700 p-4 mb-6">
             <p className="text-gray-300">
               Discutan sobre quién creen que es el impostor.
             </p>
           </div>

           <div className="space-y-3 mb-6">
             <h3 className="font-semibold text-white">Jugadores activos:</h3>
             {activePlayers.map((player) => (
               <div key={player.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                 <p className="font-semibold text-gray-300">{player.name}</p>
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
