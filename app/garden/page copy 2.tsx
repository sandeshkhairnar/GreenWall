'use client';
import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, Leaf, Sun, Moon, Cloud, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { getCurrentUser, getProfile, uploadAvatar, logout } from '@/lib/user';
import { addToast } from '@heroui/toast';

interface Note {
  id: number;
  date: string;
  text: string;
  mood: string;
  emoji: string;
}

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

const GreenWall: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
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
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const emojis = ['🌱', '🍃', '🌸', '🌿', '🌾', '🌻', '🍂', '☁️', '🌧️', '🧘'];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const moodColors: Record<string, string> = {
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
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await getProfile();
        setProfile(userProfile);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('day');
    else if (hour >= 17 && hour < 20) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollProgress(scrollPercentage);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj: Note = {
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
    return 'from-sky-100 via-cyan-100 to-teal-100';
  };

  const TimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'day': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'evening': return <Cloud className="w-5 h-5 text-purple-500" />;
      case 'night': return <Moon className="w-5 h-5 text-indigo-300" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleAvatarAction = async (key: React.Key) => {
    if (key === 'profile') {
      setShowProfile(true);
    } else if (key === 'logout') {
      try {
        await logout();
        setUser(null);
        setProfile(null);
        addToast({
          title: "Logged out",
          description: "You have successfully logged out.",
        });
        // Optionally redirect to login page
        window.location.href = '/';
      } catch (err: any) {
        addToast({
          title: "Error",
          description: err.message || "Logout failed.",
        });
      }
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    try {
      const url = await uploadAvatar(file);
      setProfile((prev: any) => ({ ...prev, avatar_url: url }));
      addToast({
        title: "Success",
        description: "Avatar updated!",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="vine" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,50 Q30,20 50,50 T90,50" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.3" />
            <circle cx="20" cy="40" r="3" fill="#16a34a" opacity="0.4" />
            <circle cx="45" cy="25" r="2.5" fill="#16a34a" opacity="0.4" />
            <circle cx="70" cy="45" r="3" fill="#16a34a" opacity="0.4" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#vine)" />
        </svg>
      </div>

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
            <Button
              color="success"
              radius="full"
              startContent={<Plus className="w-5 h-5" />}
              onPress={() => setShowAddNote(true)}
            >
              Add Today
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  color="success"
                  src={profile?.avatar_url || 'https://i.pravatar.cc/150?u=a04258114e29026702d'}
                  className="cursor-pointer"
                />

              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" onAction={handleAvatarAction}>
                <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
                  Profile
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                  Settings
                </DropdownItem>
                <DropdownItem key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />}>
                  Logout
                </DropdownItem>
              </DropdownMenu>

            </Dropdown>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddNote} onClose={() => setShowAddNote(false)} size="md">
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <Leaf className="w-6 h-6 text-green-500" />
            <span>Today's Reflection</span>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose your mood</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-3 rounded-xl transition-all ${selectedEmoji === emoji
                      ? 'bg-green-100 ring-2 ring-green-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="What did you learn or feel today?"
              minRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setShowAddNote(false)}>
              Cancel
            </Button>
            <Button color="success" onPress={handleAddNote}>
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} size="md" className='blur-backdrop'>
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar
                src={previewUrl || profile?.avatar_url || 'https://i.pravatar.cc/150?u=a04258114e29026702d'}
                isBordered
                color="success"
                className="w-24 h-24 cursor-pointer"
                onClick={() => document.getElementById('avatarInput')?.click()}
              />
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <Button color="success" onPress={() => handleAvatarUpload(selectedFile)}>
                  Set Avatar
                </Button>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold">{profile?.full_name || 'Mindful User'}</h3>
                <p className="text-gray-600">{user?.email || 'user@greenwall.com'}</p>
              </div>

              <Card className="w-full">
                <CardBody>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reflections</span>
                      <span className="font-semibold">{notes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold">{new Date(user?.created_at || '').toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-semibold">7 days</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => setShowProfile(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="h-screen overflow-y-auto pt-32 pb-20 px-6" onScroll={handleScroll}>
        <div className="max-w-2xl mx-auto space-y-8 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-300 via-green-400 to-green-500 rounded-full opacity-20"></div>

          {notes.map((note, index) => {
            const isLeft = index % 2 === 0;
            const opacity = 1 - (index / notes.length) * 0.3;

            return (
              <div
                key={note.id}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                style={{ opacity }}
              >
                <div className={`relative max-w-sm ${isLeft ? 'mr-12' : 'ml-12'}`}>
                  <div className={`absolute ${isLeft ? '-right-14' : '-left-14'} top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center`}>
                    <Leaf className="w-4 h-4 text-white" />
                  </div>

                  <Card className={`${moodColors[note.mood] || 'border-gray-200'} border-2 transform hover:scale-105 transition-all`}>
                    <CardBody className="p-6">
                      <div className="flex items-start gap-3">
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
                    </CardBody>
                  </Card>
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
        <Button
          isIconOnly
          color="success"
          className="fixed bottom-6 left-6"
          onPress={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronDown className="w-5 h-5 rotate-180" />
        </Button>
      )}
    </div>
  );
};

export default GreenWall;