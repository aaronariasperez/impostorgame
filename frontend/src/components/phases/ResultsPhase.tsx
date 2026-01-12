import { useGameState } from '@/hooks/useGameState';

export default function ResultsPhase() {
  const eliminatedPlayer = useGameState((state) => state.eliminatedPlayer);
  const getImpostors = useGameState((state) => state.getImpostors);
  const getCivilians = useGameState((state) => state.getCivilians);
  const round = useGameState((state) => state.round);
  const players = useGameState((state) => state.players);

  const impostors = getImpostors();
  const civilians = getCivilians();
  
  // Count total impostors at game start (including eliminated ones)
  const totalImpostors = players.filter((p) => p.role === 'impostor').length;

  const handleContinue = () => {
    if (eliminatedPlayer?.role === 'impostor') {
      // Impostor was eliminated
      if (round >= totalImpostors) {
        // All rounds completed and impostor revealed, civilians win
        useGameState.setState({ gameWinner: 'civilians', phase: 'game-over' });
      } else {
        // Continue to next round - go directly to discussion (clue phase only in round 1)
        useGameState.setState({
          phase: 'discussion',
          currentCluePlayerIndex: 0,
          votingResults: {},
          round: round + 1,
        });
      }
    } else if (round >= totalImpostors) {
      // All rounds completed without revealing impostor, impostors win
      useGameState.setState({ gameWinner: 'impostors', phase: 'game-over' });
    } else {
      // Civil was eliminated, continue to next round
      // Go directly to discussion phase (skip clue phase)
      useGameState.setState({
        phase: 'discussion',
        currentCluePlayerIndex: 0,
        votingResults: {},
        round: round + 1,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📊 Resultados
        </h2>

        {eliminatedPlayer && (
          <div className={`p-6 rounded-lg mb-6 text-center ${
            eliminatedPlayer.role === 'impostor'
              ? 'bg-red-100 border-2 border-red-400'
              : 'bg-blue-100 border-2 border-blue-400'
          }`}>
            <p className="text-gray-700 font-semibold mb-2">Jugador Eliminado:</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {eliminatedPlayer.name}
            </p>
            <p className={`text-lg font-semibold ${
              eliminatedPlayer.role === 'impostor'
                ? 'text-red-600'
                : 'text-blue-600'
            }`}>
              {eliminatedPlayer.role === 'impostor' ? '🎭 Impostor' : '👤 Civil'}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Impostores Restantes: {impostors.length}</h3>
            {impostors.map((p) => (
              <p key={p.id} className="text-gray-600">• {p.name}</p>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Civiles Restantes: {civilians.length}</h3>
            {civilians.map((p) => (
              <p key={p.id} className="text-gray-600">• {p.name}</p>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
