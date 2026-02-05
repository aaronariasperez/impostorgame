import { useState, useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import LoadingScreen from '@/components/LoadingScreen';

export default function CluePhase() {
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [displayedPlayerName, setDisplayedPlayerName] = useState<string>('');
  const [coverPlayerName, setCoverPlayerName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const dragRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const dragContainerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 300; // pixels needed to complete swipe

  const currentCluePlayer = useGameState((state) => state.getCurrentCluePlayer());
  const submitClue = useGameState((state) => state.submitClue);
  const getActivePlayers = useGameState((state) => state.getActivePlayers);
  const round = useGameState((state) => state.round);
  const withClues = useGameState((state) => state.withClues);
  const resetGame = useGameState((state) => state.resetGame);

  const activePlayers = getActivePlayers();
  const currentPlayerIndex = activePlayers.findIndex((p) => p.id === currentCluePlayer?.id);
  const isFirstRound = round === 1;

  // Reset state when current player changes
  useEffect(() => {
    setSubmitted(false);
    setRevealed(false);
    setDragY(0);
    setTimeLeft(240);
    setDisplayedPlayerName('');
    // Set cover player name immediately when player changes
    if (currentCluePlayer) {
      setCoverPlayerName(currentCluePlayer.name);
    }
  }, [currentCluePlayer?.id]);

  // Update displayed player name only after revealed
  useEffect(() => {
    if (revealed && currentCluePlayer) {
      setDisplayedPlayerName(currentCluePlayer.name);
    }
  }, [revealed, currentCluePlayer]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const handleContinue = () => {
    if (!currentCluePlayer) return;
    setSubmitted(true);
    submitClue(currentCluePlayer.id, '');
    setTimeLeft(240);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    dragRef.current = dragY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only if mouse button is pressed

    const diff = e.clientY - startYRef.current;
    const newDragY = Math.max(0, dragRef.current - diff);

    setDragY(newDragY);

    // Reveal if dragged up enough
    if (newDragY >= SWIPE_THRESHOLD) {
      setRevealed(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Si no se completó el swipe, volver a posición inicial con animación
    if (dragY < SWIPE_THRESHOLD) {
      setIsReturning(true);
      setTimeout(() => {
        setDragY(0);
        setIsReturning(false);
      }, 0);
    }
    dragRef.current = dragY;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    dragRef.current = dragY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - startYRef.current;
    const newDragY = Math.max(0, dragRef.current - diff);

    setDragY(newDragY);

    // Reveal if dragged up enough
    if (newDragY >= SWIPE_THRESHOLD) {
      setRevealed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Si no se completó el swipe, volver a posición inicial con animación
    if (dragY < SWIPE_THRESHOLD) {
      setIsReturning(true);
      setTimeout(() => {
        setDragY(0);
        setIsReturning(false);
      }, 0);
    }
    dragRef.current = dragY;
  };

  // Calcular opacidad del brillo basado en progreso del swipe
  const glowProgress = Math.min(dragY / SWIPE_THRESHOLD, 1);
  const glowOpacity = glowProgress * 0.8; // Max 0.8 opacity

  const handleExitGame = () => {
    resetGame();
  };

  if (!currentCluePlayer) {
    return <LoadingScreen message="Preparando turno..." />;
  }

  const isCivilian = currentCluePlayer.role === 'civilian';
  const bgColor = isCivilian ? 'bg-blue-900 border-blue-700' : 'bg-red-900 border-red-700';
  const roleText = isCivilian ? '👤 Civil' : '🎭 Impostor';

  return (
    <>
      {revealed && (
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
      )}
      <div
        key={currentCluePlayer?.id}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
      >
        {/* Draggable cover card - ONLY render when NOT revealed */}
        {!revealed && (
          <div
            ref={dragContainerRef}
            className="fixed inset-0 rounded-b-3xl shadow-2xl p-8 select-none z-40 flex flex-col items-center justify-end will-change-transform"
            style={{
              transform: `translateY(-${dragY}px)`,
              transition: isReturning ? 'transform 0.15s ease-out' : 'none',
              touchAction: 'none',
              background: `linear-gradient(to bottom, rgba(${Math.min(31 + glowProgress * 50, 255)}, ${Math.min(41 + glowProgress * 50, 255)}, ${Math.min(55 + glowProgress * 80, 255)}, 1), rgba(${Math.min(31 + glowProgress * 30, 255)}, ${Math.min(41 + glowProgress * 30, 255)}, ${Math.min(55 + glowProgress * 50, 255)}, 1))`,
              boxShadow: `
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 0 ${40 + glowProgress * 60}px rgba(59, 130, 246, ${glowOpacity}),
                inset 0 0 ${30 + glowProgress * 50}px rgba(147, 197, 253, ${glowOpacity * 0.5})
              `,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex justify-center mb-4 pt-4">
              <div className="w-12 h-1 bg-white rounded-full opacity-70"></div>
            </div>

            <div className="text-center text-white mt-12 flex-1 flex flex-col justify-center">
              <p className="text-3xl font-bold mb-2">Turno de {coverPlayerName}</p>
              <p className="text-lg mb-8 opacity-90">Desliza hacia arriba para ver tu información</p>

              <div className={isDragging ? '' : 'animate-bounce'}>
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m0 0l7-7m0 0l7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Content - ONLY render AFTER revealed */}
        {revealed && (
          <div className="relative">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 min-w-96 max-w-2xl border border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Turno de {displayedPlayerName}
                </h2>
                <p className="text-lg font-semibold text-white">
                  Jugador {currentPlayerIndex + 1} de {activePlayers.length}
                </p>
                <p className="text-base font-semibold text-white mt-2">Ronda {round}</p>
              </div>

              <div className={`border-2 rounded-lg p-6 mb-6 text-center ${bgColor}`}>
                <p className="text-gray-300 font-semibold mb-2">Eres:</p>
                <p className={`text-3xl font-bold text-white`}>
                  {roleText}
                </p>
              </div>
              {isFirstRound && (withClues || isCivilian) && (
                <div className={`border-2 rounded-lg p-6 mb-6 text-center ${bgColor}`}>
                  <p className="text-gray-300 font-semibold mb-2">{isCivilian ? 'Tu palabra es:' : 'Tu pista es:'}</p>

                  <p className="text-4xl font-bold text-white">
                    {currentCluePlayer.word}
                  </p>
                </div>
              )}

              {!submitted && (
                <button
                  onClick={handleContinue}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Continuar
                </button>
              )}

              {submitted && (
                <div className="text-center">
                  <p className="text-gray-600">Esperando al siguiente jugador...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
