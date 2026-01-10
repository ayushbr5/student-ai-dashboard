'use client';

import { useState, useEffect } from 'react';
import { Search, Save, Plus, Trash2, Edit3, X, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const PAPER_COLORS = [
  'bg-[#fffef0]', // Cream Parchment
  'bg-[#f0f9ff]', // Soft Blue Paper
  'bg-[#fdf2f8]', // Soft Pink Paper
  'bg-[#f0fdf4]', // Soft Green Paper
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('studentai-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to parse notes from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('studentai-notes', JSON.stringify(notes));
    }
  }, [notes, isLoading]);

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content for your note.');
      return;
    };

    const now = new Date();
    
    if (editingId) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, title, content, updatedAt: now } 
          : note
      ));
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: now,
        updatedAt: now,
        color: PAPER_COLORS[notes.length % PAPER_COLORS.length],
      };
      setNotes([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
  };

  const handleEditNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (editingId === id) {
        setTitle('');
        setContent('');
        setEditingId(null);
      }
    }
  };

  const handleClearForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          My <span className="text-blue-600">Notes</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Organize your thoughts and ideas on digital parchment.</p>
      </div>

      {/* Note Creation Form (Paper Style) */}
      <div className="relative group mb-8">
        {/* Decorative Stacked Paper Effect */}
        <div className="absolute inset-0 bg-white border border-slate-200 rounded-sm translate-x-1.5 translate-y-1.5 -z-10 shadow-sm" />
        
        <div className="bg-[#fffef0] border border-slate-200 rounded-sm shadow-md p-6 md:p-8 relative overflow-hidden">
          {/* Vertical Red Margin Line */}
          <div className="absolute top-0 left-12 bottom-0 w-[1px] bg-red-200 z-0" />
          
          <div className="relative z-10 pl-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full bg-transparent text-2xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-4 border-b border-dashed border-slate-200 pb-2"
            />
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something brilliant..."
              rows={8}
              className="w-full bg-transparent text-slate-700 leading-[2rem] outline-none transition resize-none font-medium"
              style={{
                backgroundImage: 'linear-gradient(transparent, transparent 31px, #e5e7eb 31px)',
                backgroundSize: '100% 32px',
              }}
            />
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 font-bold text-sm"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              
              {editingId && (
                <button
                  onClick={handleClearForm}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Positioned below the creation form */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search through your notebook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <Edit3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Your notebook is empty</h3>
          <p className="text-slate-500 mt-1 font-medium">
            {searchTerm 
              ? 'No notes match your search term.' 
              : 'Start your learning adventure by writing your first note above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`${note.color || 'bg-white'} border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col min-h-[250px] relative rounded-sm group`}
            >
              {/* Paper line decoration for cards */}
              <div className="absolute top-0 left-8 bottom-0 w-[1px] bg-red-100/50" />
              
              <div className="relative z-10 pl-4 h-full flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{note.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1.5 text-blue-600 bg-white/80 hover:bg-white rounded-lg shadow-sm border border-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-red-500 bg-white/80 hover:bg-white rounded-lg shadow-sm border border-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p 
                  className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-6 font-medium"
                  style={{
                    backgroundImage: 'linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.03) 23px)',
                    backgroundSize: '100% 24px',
                  }}
                >
                  {note.content}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>{note.updatedAt.toLocaleDateString()}</span>
                  <span>{note.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}