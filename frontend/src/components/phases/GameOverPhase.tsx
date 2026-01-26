import { useGameState } from '@/hooks/useGameState';

export default function GameOverPhase() {
  const gameWinner = useGameState((state) => state.gameWinner);
  const civilianWord = useGameState((state) => state.civilianWord);
  const players = useGameState((state) => state.players);
  const resetGame = useGameState((state) => state.resetGame);

  const handlePlayAgain = () => {
    resetGame();
  };

  const isCiviliansWin = gameWinner === 'civilians';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className={`text-4xl font-bold text-center mb-6 ${
          isCiviliansWin ? 'text-blue-600' : 'text-red-600'
        }`}>
          {isCiviliansWin ? '🎉 ¡Civiles Ganan!' : '🎭 ¡Impostores Ganan!'}
        </h2>

        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <p className="text-gray-700 font-semibold mb-2">Palabra Civil:</p>
          <p className="text-3xl font-bold text-gray-800">{civilianWord}</p>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-gray-800">Roles Finales:</h3>
          {players.map((player) => (
            <div key={player.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <span className="font-semibold text-gray-800">{player.name}</span>
              <span className={`font-semibold ${
                player.role === 'impostor' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {player.role === 'impostor' ? '🎭 Impostor' : '👤 Civil'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePlayAgain}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Jugar de Nuevo
        </button>
      </div>
    </div>
  );
}
