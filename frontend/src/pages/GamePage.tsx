import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { logGameEvent } from '@/services/telemetryService';
import CluePhase from '@/components/phases/CluePhase';
import TurnStarterPhase from '@/components/phases/TurnStarterPhase';
import DiscussionPhase from '@/components/phases/DiscussionPhase';
import VotingPhase from '@/components/phases/VotingPhase';
import ResultsPhase from '@/components/phases/ResultsPhase';
import GameOverPhase from '@/components/phases/GameOverPhase';

export default function GamePage() {
  const phase = useGameState((state) => state.phase);
  const gameWinner = useGameState((state) => state.gameWinner);
  const players = useGameState((state) => state.players);
  const round = useGameState((state) => state.round);

  // Log game end event
  useEffect(() => {
    if (phase === 'game-over' && gameWinner) {
      logGameEvent('game_end', {
        winner: gameWinner,
        round,
        totalPlayers: players.length,
        impostors: players.filter((p) => p.role === 'impostor').map((p) => p.name),
        civilians: players.filter((p) => p.role === 'civilian').map((p) => p.name),
      });
    }
  }, [phase, gameWinner, players, round]);

  const currentCluePlayer = useGameState((state) => state.getCurrentCluePlayer());

  return (
    <div className="min-h-screen p-4">
      {phase === 'clue' && <CluePhase key={currentCluePlayer?.id} />}
      {phase === 'turn-starter' && <TurnStarterPhase />}
      {phase === 'discussion' && <DiscussionPhase />}
      {phase === 'voting' && <VotingPhase />}
      {phase === 'results' && <ResultsPhase />}
      {phase === 'game-over' && <GameOverPhase />}
    </div>
  );
}
