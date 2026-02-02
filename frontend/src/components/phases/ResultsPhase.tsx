import { useGameState } from '@/hooks/useGameState';

export default function ResultsPhase() {
  const eliminatedPlayer = useGameState((state) => state.eliminatedPlayer);
  const getImpostors = useGameState((state) => state.getImpostors);
  const getCivilians = useGameState((state) => state.getCivilians);
  const round = useGameState((state) => state.round);
  const resetGame = useGameState((state) => state.resetGame);

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
         <div className="bg-gray-800 rounded-lg shadow-2xl p-8 min-w-96 max-w-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          📊 Resultados
        </h2>

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
