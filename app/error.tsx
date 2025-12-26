'use client';

import { Leaf, RefreshCw } from 'lucide-react';
import { Button } from '@heroui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6">

      {/* Floating leaves */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <Leaf
            key={i}
            className="absolute text-green-300/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${14 + i * 2}s`,
              fontSize: `${18 + Math.random() * 24}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg text-center bg-white/80 backdrop-blur rounded-2xl p-10 shadow-xl border border-green-100">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Leaf className="h-8 w-8 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="text-gray-600 leading-relaxed mb-6">
          The garden is a little disturbed right now.
          <br />
          Take a breath — we’ll get you back shortly.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={reset}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>

          <Button
            variant="bordered"
            onClick={() => window.location.href = '/garden'}
            className="border-green-600 text-green-700 px-6 py-2 rounded-full"
          >
            Go to Garden
          </Button>
        </div>
      </div>

      {/* Footer fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/60 to-transparent" />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(4deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
