import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameSetup from '@/pages/GameSetup';
import GamePage from '@/pages/GamePage';

function App() {
  const phase = useGameState((state) => state.phase);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-2xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {phase === 'setup' ? <GameSetup /> : <GamePage />}
    </div>
  );
}

export default App;
