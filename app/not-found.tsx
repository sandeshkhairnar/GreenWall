'use client';

import { Leaf, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-6">

      {/* Floating leaves */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Leaf
            key={i}
            className="absolute text-green-300/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${14 + i * 2}s`,
              fontSize: `${18 + Math.random() * 28}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-xl text-center">

        {/* Soft badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <Leaf className="w-4 h-4" />
          Lost in the garden
        </div>

        {/* Big 404 */}
        <h1 className="text-[7rem] leading-none font-bold text-green-700/90 tracking-tight">
          404
        </h1>

        {/* Message */}
        <p className="mt-4 text-xl text-gray-700">
          This path doesn’t grow here.
        </p>

        <p className="mt-2 text-gray-500 leading-relaxed">
          Sometimes wandering is part of the journey.
          <br />
          Let’s gently guide you back.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.push('/garden')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            Return to Garden
          </Button>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>

      {/* Ground gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-100/60 to-transparent" />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(4deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
