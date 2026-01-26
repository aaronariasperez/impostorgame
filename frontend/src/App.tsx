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
    // Scroll to top on mount
    window.scrollTo(0, 0);
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
    <div className="fixed inset-0 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {phase === 'setup' ? <GameSetup /> : <GamePage />}
    </div>
  );
}

export default App;
