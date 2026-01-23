import { useEffect, useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameSetup from '@/pages/GameSetup';
import GamePage from '@/pages/GamePage';
import LoadingScreen from '@/components/LoadingScreen';
import { logVisit } from '@/services/telemetryService';

function App() {
  const phase = useGameState((state) => state.phase);
  const [isLoading, setIsLoading] = useState(true);
  const visitLoggedRef = useRef(false);

  useEffect(() => {
    // Simulate app initialization
    setIsLoading(false);
  }, []);

  // Log visit on app mount (only once)
  useEffect(() => {
    if (visitLoggedRef.current) return;
    visitLoggedRef.current = true;
    logVisit();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Iniciando aplicación..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {phase === 'setup' ? <GameSetup /> : <GamePage />}
    </div>
  );
}

export default App;
