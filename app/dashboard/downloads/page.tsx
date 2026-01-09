"use client";

import { useEffect, useState } from 'react';
import { 
  Trash2, FileText, Download, Clock, Search, 
  Loader2, Sparkles, X, Copy, Check, Printer 
} from 'lucide-react';

export default function DownloadsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/get-saved-tools');
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/save-tool?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs(docs.filter(doc => doc.id !== id));
        if (selectedDoc?.id === id) setSelectedDoc(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredDocs = docs.filter(doc => 
    doc.toolName.toLowerCase().includes(search.toLowerCase()) ||
    doc.output.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            My <span className="text-blue-600">Downloads</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Your personal library of AI-generated study guides.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search saved results..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Docs */}
      {filteredDocs.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
          <FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400 font-medium italic text-lg text-center">
            {search ? "No matches found for your search." : "Your library is empty. Save some results from the Tools page!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-2xl transition-all flex flex-col group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{doc.toolName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                      <Clock size={10} /> {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => deleteDoc(doc.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-slate-700 text-sm leading-relaxed line-clamp-[6] whitespace-pre-wrap font-medium mb-4">
                  {doc.output}
                </p>
              </div>

              <button 
                onClick={() => setSelectedDoc(doc)}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Download size={14} /> Full View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- FULL VIEW MODAL --- */}
      
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedDoc.toolName}</h2>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Saved on {new Date(selectedDoc.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => copyToClipboard(selectedDoc.output)} 
                  className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-xs ${isCopied ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  {isCopied ? "Copied!" : "Copy Text"}
                </button>
                <button onClick={() => setSelectedDoc(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-12 bg-white scrollbar-hide">
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Original Context/Input</p>
                  <p className="text-slate-600 text-sm italic leading-relaxed">{selectedDoc.input}</p>
                </div>
                
                <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedDoc.output}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}