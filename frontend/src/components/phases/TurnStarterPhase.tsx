import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function TurnStarterPhase() {
  const [showName, setShowName] = useState(false);
  const getTurnStarterPlayer = useGameState((state) => state.getTurnStarterPlayer);
  const moveToDiscussion = useGameState((state) => state.moveToDiscussion);

  const turnStarterPlayer = getTurnStarterPlayer();

  useEffect(() => {
    // Show the player name after a short delay
    const timer = setTimeout(() => setShowName(true), 500);
    return () => clearTimeout(timer);
  }, [turnStarterPlayer?.id]);

  const handleContinue = () => {
    moveToDiscussion();
  };

return (
     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
       <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
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
  );
}
