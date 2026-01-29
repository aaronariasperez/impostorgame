import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import Timer from '@/components/Timer';

export default function DiscussionPhase() {
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
  const resetGame = useGameState((state) => state.resetGame);

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

  const handleExitGame = () => {
    resetGame();
  };
  return(
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
       <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
            <button
              onClick={handleExitGame}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Salir de la partida"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
           <h2 className="text-3xl font-bold text-center text-white mb-6">
             💬 Fase de Discusión
           </h2>

           <Timer timeLeft={timeLeft} />

            <div className="bg-blue-900 border-l-4 border-blue-700 p-4 mb-6">
              <p className="text-gray-300">
                Discutan sobre quién creen que es el impostor.
              </p>
            </div>

           <button
             onClick={handleMoveToVoting}
             className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
           >
             Pasar a Votación
           </button>
         </div>
       </div>
  );
}
