interface TimerProps {
  timeLeft: number;
}

export default function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  return (
    <div className={`text-center mb-6 p-4 rounded-lg ${
      isLowTime ? 'bg-red-900' : 'bg-blue-900'
    }`}>
      <p className={`text-sm font-semibold ${
        isLowTime ? 'text-red-300' : 'text-blue-300'
      } mb-1`}>
        Tiempo Restante
      </p>
      <p className={`text-4xl font-bold ${
        isLowTime ? 'text-red-200' : 'text-blue-200'
      }`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
}
