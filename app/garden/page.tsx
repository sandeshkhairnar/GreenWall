'use client';
import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, Leaf, Sun, Moon, Cloud, User, Settings, LogOut, Edit, Trash2 } from 'lucide-react';
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { getCurrentUser, getProfile, uploadAvatar, logout } from '@/lib/user';
import { addToast } from '@heroui/toast';
// INTEGRATED: Import notes CRUD functions
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  getNotesCount,
  Note as NoteType,
  NoteInput 
} from '@/lib/sticky';

interface Note {
  id: string; // CHANGED: from number to string for Supabase UUID
  date: string;
  text: string;
  mood: string;
  emoji: string;
  created_at?: string; // ADDED: for database timestamp
  updated_at?: string; // ADDED: for database timestamp
}

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

const GreenWall: React.FC = () => {
  // INTEGRATED: Now notes come from database instead of hardcoded
  const [notes, setNotes] = useState<Note[]>([]);
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
  
  // ADDED: Edit functionality state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditNote, setShowEditNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState('');
  const [editNoteEmoji, setEditNoteEmoji] = useState('🌱');
  
  // ADDED: Loading state
  const [isLoading, setIsLoading] = useState(false);

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

  // INTEGRATED: Fetch user and notes on component mount
  useEffect(() => {
    const fetchUserAndNotes = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await getProfile();
          setProfile(userProfile);
          
          // INTEGRATED: Fetch notes from database
          await fetchNotes();
        }
      } catch (error: any) {
        addToast({
          title: "Error",
          description: error.message || "Failed to load data",
        });
      }
    };

    fetchUserAndNotes();
  }, []);

  // ADDED: Function to fetch notes from database
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to load notes",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  // INTEGRATED: Create note in database
  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        setIsLoading(true);
        const noteInput: NoteInput = {
          text: newNote,
          mood: 'calm',
          emoji: selectedEmoji,
        };
        
        const createdNote = await createNote(noteInput);
        setNotes([createdNote, ...notes]); // Add new note at the beginning
        setNewNote('');
        setSelectedEmoji('🌱');
        setShowAddNote(false);
        
        addToast({
          title: "Success",
          description: "Note added successfully!",
        });
      } catch (error: any) {
        addToast({
          title: "Error",
          description: error.message || "Failed to create note",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ADDED: Check if note can be edited (only on same day of creation)
  const canEditNote = (note: Note): boolean => {
    const noteDate = new Date(note.date).toDateString();
    const today = new Date().toDateString();
    return noteDate === today;
  };

  // ADDED: Open edit modal
  const handleEditClick = (note: Note) => {
    if (!canEditNote(note)) {
      addToast({
        title: "Cannot Edit",
        description: "Notes can only be edited on the day they were created",
      });
      return;
    }
    setEditingNote(note);
    setEditNoteText(note.text);
    setEditNoteEmoji(note.emoji);
    setShowEditNote(true);
  };

  // ADDED: Update note in database
  const handleUpdateNote = async () => {
    if (!editingNote || !editNoteText.trim()) return;

    try {
      setIsLoading(true);
      const updates: Partial<NoteInput> = {
        text: editNoteText,
        emoji: editNoteEmoji,
      };
      
      const updatedNote = await updateNote(editingNote.id, updates);
      
      setNotes(notes.map(note => 
        note.id === editingNote.id ? updatedNote : note
      ));
      
      setShowEditNote(false);
      setEditingNote(null);
      setEditNoteText('');
      setEditNoteEmoji('🌱');
      
      addToast({
        title: "Success",
        description: "Note updated successfully!",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update note",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ADDED: Delete note from database
  const handleDeleteNote = async (note: Note) => {
    if (!canEditNote(note)) {
      addToast({
        title: "Cannot Delete",
        description: "Notes can only be deleted on the day they were created",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setIsLoading(true);
      await deleteNote(note.id);
      setNotes(notes.filter(n => n.id !== note.id));
      
      addToast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete note",
      });
    } finally {
      setIsLoading(false);
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
              isLoading={isLoading}
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

      {/* MODAL: Add Note */}
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
            <Button color="success" onPress={handleAddNote} isLoading={isLoading}>
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADDED: Edit Note Modal */}
      <Modal isOpen={showEditNote} onClose={() => setShowEditNote(false)} size="md">
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <Edit className="w-6 h-6 text-blue-500" />
            <span>Edit Reflection</span>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose your mood</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setEditNoteEmoji(emoji)}
                    className={`text-2xl p-3 rounded-xl transition-all ${editNoteEmoji === emoji
                      ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={editNoteText}
              onChange={(e) => setEditNoteText(e.target.value)}
              placeholder="What did you learn or feel today?"
              minRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setShowEditNote(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateNote} isLoading={isLoading}>
              Update Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Modal - unchanged */}
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

      {/* Notes Timeline */}
      <div className="h-screen overflow-y-auto pt-32 pb-20 px-6" onScroll={handleScroll}>
        <div className="max-w-2xl mx-auto space-y-8 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-300 via-green-400 to-green-500 rounded-full opacity-20"></div>

          {/* ADDED: Loading state */}
          {isLoading && notes.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600">Loading your reflections...</p>
            </div>
          )}

          {/* ADDED: Empty state */}
          {!isLoading && notes.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-600 italic">Start your journey by adding your first reflection</p>
            </div>
          )}

          {notes.map((note, index) => {
            const isLeft = index % 2 === 0;
            const opacity = 1 - (index / notes.length) * 0.3;
            const isEditable = canEditNote(note);

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
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-gray-500 font-medium">
                              {new Date(note.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            {/* ADDED: Edit and Delete buttons (only show if editable) */}
                            {isEditable && (
                              <div className="flex gap-1">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleEditClick(note)}
                                  className="min-w-unit-8 w-8 h-8"
                                >
                                  <Edit className="w-4 h-4 text-blue-500" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleDeleteNote(note)}
                                  className="min-w-unit-8 w-8 h-8"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-800 leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            );
          })}

          {notes.length > 0 && (
            <div className="text-center py-12 opacity-50">
              <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3 animate-bounce" />
              <p className="text-gray-600 italic">Your journey begins here</p>
            </div>
          )}
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