import { useGameState } from '@/hooks/useGameState';

export default function ResultsPhase() {
  const eliminatedPlayer = useGameState((state) => state.eliminatedPlayer);
  const getImpostors = useGameState((state) => state.getImpostors);
  const getCivilians = useGameState((state) => state.getCivilians);
  const round = useGameState((state) => state.round);

  const impostors = getImpostors();
  const civilians = getCivilians();
  

  const handleContinue = () => {
    // Check win conditions
    if (impostors.length === 0) {
      // All impostors have been eliminated, civilians win
      useGameState.setState({ gameWinner: 'civilians', phase: 'game-over' });
      return;
    }

    if (civilians.length === 1) {
      // Only 1 civilian left, impostors win
      useGameState.setState({ gameWinner: 'impostors', phase: 'game-over' });
      return;
    }

    // Continue to next round - go directly to discussion (clue phase only in round 1)
    useGameState.setState({
      phase: 'discussion',
      currentCluePlayerIndex: 0,
      votingResults: {},
      round: round + 1,
    });
  };

  return (
<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
       <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📊 Resultados
        </h2>

        {eliminatedPlayer && (
{eliminatedPlayer && (
           <div className={`p-6 rounded-lg mb-6 text-center ${
             eliminatedPlayer.role === 'impostor'
               ? 'bg-red-900 border-2 border-red-700'
               : 'bg-blue-900 border-2 border-blue-700'
           }`}>
             <p className="text-gray-300 font-semibold mb-2">Jugador Eliminado:</p>
             <p className="text-2xl font-bold text-white mb-2">
               {eliminatedPlayer.name}
             </p>
             <p className={`text-lg font-semibold ${
               eliminatedPlayer.role === 'impostor'
                 ? 'text-red-300'
                 : 'text-blue-300'
             }`}>
               {eliminatedPlayer.role === 'impostor' ? '🎭 Impostor' : '👤 Civil'}
             </p>
           </div>
         )}
        )}

        <div className="space-y-4 mb-6">
          <div>
<div className="space-y-4 mb-6">
           <div>
             <h3 className="font-semibold text-white mb-2">Impostores Restantes: {impostors.length}</h3>
             {impostors.map((p) => (
               <p key={p.id} className="text-gray-300">• {p.name}</p>
             ))}
           </div>

           <div>
             <h3 className="font-semibold text-white mb-2">Civiles Restantes: {civilians.length}</h3>
             {civilians.map((p) => (
               <p key={p.id} className="text-gray-300">• {p.name}</p>
             ))}
           </div>
         </div>
        </div>

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
