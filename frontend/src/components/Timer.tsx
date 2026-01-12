interface TimerProps {
  timeLeft: number;
}

export default function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  return (
    <div className={`text-center mb-6 p-4 rounded-lg ${
      isLowTime ? 'bg-red-100' : 'bg-blue-100'
    }`}>
      <p className={`text-sm font-semibold ${
        isLowTime ? 'text-red-700' : 'text-blue-700'
      } mb-1`}>
        Tiempo Restante
      </p>
      <p className={`text-4xl font-bold ${
        isLowTime ? 'text-red-600' : 'text-blue-600'
      }`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
}
