'use client';

import { useState, useEffect } from 'react';
import { Search, Save, Trash2, Edit3, Loader2, StickyNote, Sparkles } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
  const [isSaving, setIsSaving] = useState(false);

  // 1. FETCH NOTES FROM DATABASE
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // 2. SAVE OR UPDATE NOTE
  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch('/api/notes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title, content }),
      });

      if (res.ok) {
        const savedNote = await res.json();
        if (editingId) {
          setNotes(notes.map(n => n.id === editingId ? savedNote : n));
        } else {
          setNotes([savedNote, ...notes]);
        }
        handleClearForm();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. DELETE NOTE FROM DATABASE
  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure? This note will be removed from your Neural Lab too.')) return;
    
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Opening Notebook...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            My <span className="text-blue-600">Notebook</span>
          </h1>
          <p className="text-slate-500 mt-1 text-xs font-bold uppercase tracking-wider">Cloud Synced & AI Ready</p>
        </div>
      </div>

      {/* Note Creation Form */}
      <div className="relative group">
        <div className="bg-[#fffef0] border border-slate-200 rounded-sm shadow-xl p-8 relative overflow-hidden transition-all focus-within:shadow-2xl">
          <div className="absolute top-0 left-12 bottom-0 w-[1px] bg-red-200" />
          
          <div className="relative z-10 pl-8">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="NOTE TITLE..."
              className="w-full bg-transparent text-2xl font-black text-slate-800 placeholder:text-slate-200 outline-none mb-6 border-b border-dashed border-slate-200 pb-2 uppercase tracking-tighter"
            />
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Capture your thoughts..."
              rows={8}
              className="w-full bg-transparent text-slate-700 leading-[2rem] outline-none resize-none font-medium text-lg"
              style={{
                backgroundImage: 'linear-gradient(transparent, transparent 31px, #f3f4f6 31px)',
                backgroundSize: '100% 32px',
              }}
            />
            
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={handleSaveNote}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 font-black text-[10px] uppercase tracking-[0.2em]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              
              {editingId && (
                <button onClick={handleClearForm} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
        <input
          type="text"
          placeholder="SEARCH YOUR BRAIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500/20 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredNotes.map((note) => (
          <div 
            key={note.id} 
            className={`${note.color || 'bg-white'} border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col min-h-[300px] relative rounded-sm group`}
          >
            <div className="absolute top-0 left-10 bottom-0 w-[1px] bg-red-100/50" />
            
            <div className="relative z-10 pl-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-black text-slate-800 text-lg line-clamp-2 leading-tight uppercase tracking-tight">{note.title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEditNote(note)} className="p-2 text-blue-600 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} className="p-2 text-red-500 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-[1.6rem] mb-8 flex-grow line-clamp-[8] font-medium italic">
                {note.content}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-200/50 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-blue-400" /> AI READY
                </div>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}