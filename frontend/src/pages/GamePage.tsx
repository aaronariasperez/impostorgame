import { useGameState } from '@/hooks/useGameState';
import CluePhase from '@/components/phases/CluePhase';
import DiscussionPhase from '@/components/phases/DiscussionPhase';
import VotingPhase from '@/components/phases/VotingPhase';
import ResultsPhase from '@/components/phases/ResultsPhase';
import GameOverPhase from '@/components/phases/GameOverPhase';

export default function GamePage() {
  const phase = useGameState((state) => state.phase);

  return (
    <div className="min-h-screen p-4">
      {phase === 'clue' && <CluePhase />}
      {phase === 'discussion' && <DiscussionPhase />}
      {phase === 'voting' && <VotingPhase />}
      {phase === 'results' && <ResultsPhase />}
      {phase === 'game-over' && <GameOverPhase />}
    </div>
  );
}
