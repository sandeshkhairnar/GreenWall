'use client';
import React, { useState } from 'react';
import { Leaf, Moon, Sun, Cloud, Sparkles, Lock, Mail, User } from 'lucide-react';
import { addToast } from "@heroui/toast";
import { signIn, signUp } from '@/lib/user';
import { useRouter } from 'next/navigation';

const GreenWallLanding = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);
  const router = useRouter();

  const sampleNotes = [
    { id: 1, text: 'Today I chose peace over productivity', emoji: '🌿', rotation: -3, position: 'top-20 left-10' },
    { id: 2, text: 'Morning walk cleared my mind', emoji: '🌸', rotation: 2, position: 'top-40 right-20' },
    { id: 3, text: 'Learning to embrace imperfection', emoji: '🍃', rotation: -2, position: 'top-60 left-1/4' },
    { id: 4, text: 'Grateful for small moments of quiet', emoji: '☁️', rotation: 4, position: 'top-80 right-1/3' },
    { id: 5, text: 'My thoughts feel lighter these days', emoji: '🌱', rotation: -4, position: 'top-1/3 left-1/2' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (authMode === "signup") {
        await signUp(formData.email, formData.password, formData.name);

        addToast({
          title: "Success!",
          description: "Account created successfully.",
        });
      } else {
        await signIn(formData.email, formData.password);

        addToast({
          title: "Success!",
          description: "Signed in successfully.",
        });
      }

      setShowAuth(false);
      setFormData({ name: "", email: "", password: "" });

      router.push("/garden");

    } catch (error: any) {
      console.error(error);

      addToast({
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
        classNames: {
          base: "bg-red-50 dark:bg-red-900 shadow-sm border border-l-8 rounded-md rounded-l-none flex flex-col items-start border-red-400 dark:border-red-600 border-l-red-500",
          icon: "w-6 h-6 fill-current",
        },
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden green-scrollbar">
      {/* Floating leaves animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Leaf
            key={i}
            className="absolute text-green-300/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`,
              fontSize: `${20 + Math.random() * 30}px`
            }}
          />
        ))}
      </div>

      {/* Sticky Notes Background (when not showing auth) */}
      {!showAuth && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {sampleNotes.map((note) => (
            <div
              key={note.id}
              className={`absolute ${note.position} w-48 p-4 bg-yellow-100 shadow-lg transition-all duration-300`}
              style={{
                transform: `rotate(${note.rotation}deg)`,
              }}
              onMouseEnter={() => setHoveredNote(note.id)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl">{note.emoji}</span>
                <p className="text-sm text-gray-700 font-handwriting">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">GreenWall</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Your mindful moment
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Make <span className="text-green-600">peaceful</span>
                <br />
                reflections regardless of your journey
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                A calm space to pin your daily thoughts. One moment at a time, watch your garden of reflections grow.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setAuthMode('signup');
                  }}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Start Your Garden
                </button>
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setAuthMode('signin');
                  }}
                  className="px-8 py-4 border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-full font-semibold transition-all"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  No streaks pressure
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Just calm
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Private by default
                </div>
              </div>
            </div>

            {/* Right: Auth Card or Preview */}
            <div className="relative">
              {showAuth ? (
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-green-100">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {authMode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
                    </h2>
                    <p className="text-gray-600">
                      {authMode === 'signin'
                        ? 'Continue your mindful practice'
                        : 'Create your peaceful space'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                    >
                      {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        {authMode === 'signin'
                          ? "Don't have an account? Sign up"
                          : 'Already have an account? Sign in'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="text-4xl">🌸</span>
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Dec 25, 2024</p>
                        <p className="text-gray-800 text-lg leading-relaxed">
                          Today I chose peace over productivity. Learning to embrace the quiet moments.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-green-100/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-4/5 transform -rotate-3">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">🍃</span>
                      <div>
                        <p className="text-gray-500 text-xs mb-2">Dec 24, 2024</p>
                        <p className="text-gray-700 leading-relaxed">
                          Morning walk cleared my mind beautifully...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-gray-600 text-sm">
          <p>Made with 🌿 for mindful moments</p>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
      `}</style>
    </div>
  );
};

export default GreenWallLanding;