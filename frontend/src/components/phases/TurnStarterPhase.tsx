import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function TurnStarterPhase() {
  const [showName, setShowName] = useState(false);
  const getTurnStarterPlayer = useGameState((state) => state.getTurnStarterPlayer);
  const moveToDiscussion = useGameState((state) => state.moveToDiscussion);
  const resetGame = useGameState((state) => state.resetGame);

  const turnStarterPlayer = getTurnStarterPlayer();

  useEffect(() => {
    // Show the player name after a short delay
    const timer = setTimeout(() => setShowName(true), 500);
    return () => clearTimeout(timer);
  }, [turnStarterPlayer?.id]);

  const handleContinue = () => {
    moveToDiscussion();
  };
  const handleExitGame = () => {
    resetGame();
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white transition-colors rounded-lg p-2"
          onClick={handleExitGame}
          aria-label="Salir de la partida"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
         <div className="bg-gray-800 rounded-lg shadow-2xl p-8 min-w-96 max-w-2xl text-center border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-8">
            🎤 ¿Quién Empieza?
          </h2>

          {showName && turnStarterPlayer && (
            <div className="animate-bounce">
              <p className="text-5xl font-bold text-gray-300 mb-4">
                {turnStarterPlayer.name}
              </p>
              <p className="text-gray-400 text-lg mb-8">
                ¡Comienza la discusión!
              </p>
            </div>
          )}

          {!showName && (
            <div className="py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Continuar
          </button>
        </div>
      </div>
      </>
    );
  }
