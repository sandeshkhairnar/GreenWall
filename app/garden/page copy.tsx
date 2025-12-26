'use client';
import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, Leaf, Sun, Moon, Cloud } from 'lucide-react';

const GreenWall = () => {
  const [notes, setNotes] = useState([
    { id: 1, date: '2024-12-01', text: 'Started my mindfulness journey. Feeling hopeful.', mood: 'calm', emoji: '🌱' },
    { id: 2, date: '2024-12-03', text: 'Learned to pause before reacting today.', mood: 'peaceful', emoji: '🍃' },
    { id: 3, date: '2024-12-05', text: 'Morning walk cleared my mind beautifully.', mood: 'joyful', emoji: '🌸' },
    { id: 4, date: '2024-12-08', text: 'Grateful for small moments of quiet.', mood: 'grateful', emoji: '🌿' },
    { id: 5, date: '2024-12-10', text: 'Today I chose peace over productivity.', mood: 'calm', emoji: '🌾' },
    { id: 6, date: '2024-12-12', text: 'Meditation helped me find my center again.', mood: 'centered', emoji: '🧘' },
    { id: 7, date: '2024-12-15', text: 'Rain sounds brought unexpected clarity.', mood: 'reflective', emoji: '🌧️' },
    { id: 8, date: '2024-12-17', text: 'Discovered beauty in doing nothing.', mood: 'peaceful', emoji: '🍂' },
    { id: 9, date: '2024-12-20', text: 'My thoughts feel lighter these days.', mood: 'light', emoji: '☁️' },
    { id: 10, date: '2024-12-22', text: 'Learning to embrace imperfection.', mood: 'accepting', emoji: '🌻' },
    { id: 11, date: '2024-12-24', text: 'Today I learned how to slow my thoughts.', mood: 'calm', emoji: '🍃' },
  ]);
  
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌱');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [butterflies, setButterflies] = useState([]);

  const emojis = ['🌱', '🍃', '🌸', '🌿', '🌾', '🌻', '🍂', '☁️', '🌧️', '🧘'];
  
  const moodColors = {
    calm: 'bg-blue-50 border-blue-200',
    peaceful: 'bg-green-50 border-green-200',
    joyful: 'bg-yellow-50 border-yellow-200',
    grateful: 'bg-pink-50 border-pink-200',
    centered: 'bg-purple-50 border-purple-200',
    reflective: 'bg-indigo-50 border-indigo-200',
    light: 'bg-cyan-50 border-cyan-200',
    accepting: 'bg-amber-50 border-amber-200'
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('day');
    else if (hour >= 17 && hour < 20) setTimeOfDay('evening');
    else setTimeOfDay('night');

    const initialButterflies = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 0.8 + Math.random() * 0.4,
      color: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
    }));
    setButterflies(initialButterflies);
  }, []);

  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollProgress(scrollPercentage);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        text: newNote,
        mood: 'calm',
        emoji: selectedEmoji
      };
      setNotes([...notes, newNoteObj]);
      setNewNote('');
      setSelectedEmoji('🌱');
      setShowAddNote(false);
    }
  };

  const getBackgroundGradient = () => {
    switch(timeOfDay) {
      case 'morning':
        return 'from-orange-50 via-yellow-50 to-green-50';
      case 'day':
        return 'from-blue-50 via-cyan-50 to-teal-50';
      case 'evening':
        return 'from-purple-50 via-pink-50 to-orange-50';
      case 'night':
        return 'from-indigo-900 via-purple-900 to-blue-900';
      default:
        return 'from-green-50 via-emerald-50 to-teal-50';
    }
  };

  const TimeIcon = () => {
    switch(timeOfDay) {
      case 'morning': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'day': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'evening': return <Cloud className="w-5 h-5 text-purple-500" />;
      case 'night': return <Moon className="w-5 h-5 text-indigo-300" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden `}>
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="vine" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,50 Q30,20 50,50 T90,50" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="20" cy="40" r="3" fill="#16a34a" opacity="0.4"/>
            <circle cx="45" cy="25" r="2.5" fill="#16a34a" opacity="0.4"/>
            <circle cx="70" cy="45" r="3" fill="#16a34a" opacity="0.4"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#vine)" />
        </svg>
      </div>

      {butterflies.map(butterfly => (
        <div
          key={butterfly.id}
          className="absolute pointer-events-none"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            animation: `butterfly-float ${butterfly.duration}s ease-in-out infinite`,
            animationDelay: `${butterfly.delay}s`,
            transform: `scale(${butterfly.size})`,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            className="animate-[butterfly-wing_0.6s_ease-in-out_infinite]"
          >
            <ellipse cx="8" cy="12" rx="7" ry="10" fill={butterfly.color} opacity="0.6" transform="rotate(-20 8 12)"/>
            <ellipse cx="22" cy="12" rx="7" ry="10" fill={butterfly.color} opacity="0.6" transform="rotate(20 22 12)"/>
            <ellipse cx="8" cy="18" rx="5" ry="7" fill={butterfly.color} opacity="0.5" transform="rotate(-15 8 18)"/>
            <ellipse cx="22" cy="18" rx="5" ry="7" fill={butterfly.color} opacity="0.5" transform="rotate(15 22 18)"/>
            <line x1="15" y1="8" x2="15" y2="22" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="15" cy="8" r="2" fill="#374151"/>
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes butterfly-float {
          0%, 100% {
            transform: translate(0, 0) scale(var(--scale, 1));
          }
          25% {
            transform: translate(30vw, -20vh) scale(var(--scale, 1));
          }
          50% {
            transform: translate(60vw, 10vh) scale(var(--scale, 1));
          }
          75% {
            transform: translate(30vw, 30vh) scale(var(--scale, 1));
          }
        }
        
        @keyframes butterfly-wing {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(0.9);
          }
        }
      `}</style>

      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30"></div>
              <Leaf className="w-8 h-8 text-green-600 relative" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">GreenWall</h1>
              <p className="text-sm text-gray-600">Your garden of thoughts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TimeIcon />
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Today
            </button>
          </div>
        </div>
      </div>

      {showAddNote && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Today's Reflection</h2>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose your mood</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-3 rounded-xl transition-all ${
                      selectedEmoji === emoji 
                        ? 'bg-green-100 ring-2 ring-green-500 scale-110' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="What did you learn or feel today?"
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none text-gray-700"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddNote(false)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className="h-screen overflow-y-auto pt-32 pb-20 px-6"
        onScroll={handleScroll}
      >
        <div className="max-w-2xl mx-auto space-y-8 relative">
          
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-300 via-green-400 to-green-500 rounded-full opacity-20"></div>

          {notes.map((note, index) => {
            const isLeft = index % 2 === 0;
            const opacity = 1 - (index / notes.length) * 0.3;
            
            return (
              <div
                key={note.id}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: opacity
                }}
              >
                <div className={`relative max-w-sm ${isLeft ? 'mr-12' : 'ml-12'}`}>
                  <div className={`absolute ${isLeft ? '-right-14' : '-left-14'} top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center`}>
                    <Leaf className="w-4 h-4 text-white" />
                  </div>

                  <div 
                    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 ${moodColors[note.mood] || 'border-gray-200'} transform hover:scale-105 hover:-rotate-1`}
                    style={{
                      transform: `rotate(${isLeft ? '-2deg' : '2deg'})`,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{note.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          {new Date(note.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-800 leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-green-100/50 rounded-2xl -z-10"></div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-center py-12 opacity-50">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3 animate-bounce" />
            <p className="text-gray-600 italic">Your journey begins here</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700">{notes.length} reflections</span>
        </div>
      </div>

      {scrollProgress > 50 && (
        <div className="fixed bottom-6 left-6 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GreenWall;