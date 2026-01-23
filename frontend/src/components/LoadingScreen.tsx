interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({
  message = 'Cargando...',
  subMessage,
}: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center">
        {/* Animated spinner icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
          </div>
        </div>

        {/* Main message */}
        <h2 className="text-white text-2xl font-bold mb-2">{message}</h2>

        {/* Sub message */}
        {subMessage && (
          <p className="text-white text-sm opacity-80">{subMessage}</p>
        )}
      </div>
    </div>
  );
}
