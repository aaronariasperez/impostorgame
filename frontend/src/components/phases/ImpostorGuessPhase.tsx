import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function ImpostorGuessPhase() {
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const eliminatedPlayer = useGameState((state) => state.eliminatedPlayer);
  const submitImpostorGuess = useGameState((state) => state.submitImpostorGuess);

  const handleSubmit = () => {
    setSubmitted(true);
    submitImpostorGuess(guess);
  };

  if (!eliminatedPlayer) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🎭 Oportunidad del Impostor
        </h2>

        <div className="bg-red-100 border-2 border-red-400 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-700 font-semibold mb-2">{eliminatedPlayer.name}</p>
          <p className="text-gray-600">Tienes una oportunidad para adivinar la palabra civil</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ¿Cuál es la palabra civil?
            </label>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Escribe tu adivinanza..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={submitted}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitted || !guess.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Enviar Adivinanza
          </button>
        </div>

        {submitted && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">Procesando adivinanza...</p>
          </div>
        )}
      </div>
    </div>
  );
}
