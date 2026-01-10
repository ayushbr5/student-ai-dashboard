"use client";

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Trash2, FileText, Download, Clock, Search,
  Loader2, Sparkles, X, Copy, Check, FileDown,
  Pencil, Save, Wand2, ArrowUp
} from 'lucide-react';

const CATEGORIES = ["All", "Math", "Science", "English", "History", "Coding", "Uncategorized"];

export default function DownloadsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
    const scrollContainer = document.getElementById('dashboard-scroll-container');
    const handleScroll = () => {
      if (scrollContainer && scrollContainer.scrollTop > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/get-saved-tools');
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch error:", err); } finally { setLoading(false); }
  };

  const scrollToTop = () => {
    document.getElementById('dashboard-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/save-tool?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs(docs.filter(doc => doc.id !== id));
        if (selectedDoc?.id === id) setSelectedDoc(null);
      }
    } catch (err) { console.error("Delete error:", err); }
  };

  const handleUpdate = async (id: string, nameToSave?: string, category?: string) => {
    try {
      const res = await fetch(`/api/rename-tool`, {
        method: 'PATCH',
        body: JSON.stringify({ id, newName: nameToSave, category })
      });
      if (res.ok) {
        setDocs(docs.map(doc => doc.id === id ? { ...doc, toolName: nameToSave || doc.toolName, category: category || doc.category } : doc));
        setEditingId(null);
      }
    } catch (err) { console.error("Update error:", err); }
  };

  const generateAiTitle = async (id: string, content: string) => {
    setIsGeneratingTitle(id);
    try {
      const res = await fetch('/api/generate-title', { method: 'POST', body: JSON.stringify({ content }) });
      const data = await res.json();
      if (data.title) await handleUpdate(id, data.title);
    } catch (err) { console.error("AI Title Error:", err); } finally { setIsGeneratingTitle(null); }
  };

  const downloadAsPDF = (doc: any) => {
    const pdf = new jsPDF();
    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(20);
    pdf.setTextColor(37, 99, 235);
    pdf.text(doc.toolName.toUpperCase(), margin, 20);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Subject: ${doc.category || "Uncategorized"} | Saved on: ${new Date(doc.createdAt).toLocaleDateString()}`, margin, 28);
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    const splitText = pdf.splitTextToSize(doc.output, pageWidth - (margin * 2));
    pdf.text(splitText, margin, 45);
    pdf.save(`${doc.toolName.replace(/\s+/g, '_')}_Notes.pdf`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.toolName.toLowerCase().includes(search.toLowerCase()) ||
                          doc.output.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="w-full mx-auto p-4 md:p-8 animate-in fade-in duration-500 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">My <span className="text-blue-600">Downloads</span></h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Your personal library of study guides.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
          <input type="text" placeholder="Search saved results..." className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Category Swiper - Improved mobile visibility */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-10 md:p-20 text-center">
          <FileText className="mx-auto text-slate-300 mb-4 w-12 h-12" />
          <p className="text-slate-400 font-medium italic text-center">No documents found.</p>
        </div>
      ) : (
        /* FIXED GRID: grid-cols-1 ensures 100% width on mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
          {filteredDocs.map((doc) => (
            /* Card Container: w-full ensures it fits the mobile screen */
            <div key={doc.id} className="w-full bg-white border border-slate-200 p-5 rounded-xl sm:rounded-[28px] hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 w-full min-w-0">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Sparkles className="w-4 h-4 md:w-[18px] md:h-[18px]" /></div>
                  <div className="w-full min-w-0">
                    {editingId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <input autoFocus className="text-xs sm:text-sm font-bold border-b-2 border-blue-500 outline-none w-full bg-transparent" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <button onClick={() => handleUpdate(doc.id, newName)} className="text-green-600 shrink-0"><Save className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 group/title">
                          <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{doc.toolName}</h3>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover/title:opacity-100 transition-all">
                            <button onClick={() => { setEditingId(doc.id); setNewName(doc.toolName); }} className="text-slate-400 hover:text-blue-600 p-0.5"><Pencil className="w-3 h-3" /></button>
                            <button onClick={() => generateAiTitle(doc.id, doc.output)} disabled={isGeneratingTitle === doc.id} className="text-slate-400 hover:text-purple-600 p-0.5">{isGeneratingTitle === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}</button>
                          </div>
                        </div>
                        <select value={doc.category || "Uncategorized"} onChange={(e) => handleUpdate(doc.id, undefined, e.target.value)} className="text-[9px] sm:text-[10px] font-bold text-blue-500 bg-blue-50/50 px-2 py-0.5 rounded-lg outline-none mt-1 w-fit cursor-pointer">
                          {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteDoc(doc.id)} className="text-slate-300 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed line-clamp-[5] whitespace-pre-wrap font-medium mb-4 flex-1">{doc.output}</p>

              {/* Full View Button: Made more accessible on mobile */}
              <button onClick={() => setSelectedDoc(doc)} className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all sm:opacity-0 group-hover:opacity-100 active:bg-blue-600 active:text-white">
                <Download className="w-4 h-4" /> Full View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Scroll Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-2xl animate-in fade-in zoom-in duration-300 z-50 hover:bg-blue-700 active:scale-90 transition-all"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* MODAL: Bottom Sheet on mobile for perfect fit */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white rounded-t-[32px] sm:rounded-[40px] w-full max-w-4xl h-[92vh] sm:h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="p-5 sm:p-8 border-b flex flex-row justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-2xl font-black text-slate-800 uppercase tracking-tight truncate">{selectedDoc.toolName}</h2>
                  <p className="text-[9px] sm:text-xs font-bold text-blue-500 uppercase tracking-widest truncate">{selectedDoc.category || "Uncategorized"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
                <button onClick={() => downloadAsPDF(selectedDoc)} className="p-2 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shrink-0 shadow-sm"><FileDown className="w-4 h-4 sm:mr-1 inline" /> <span className="hidden xs:inline">PDF</span></button>
                <button onClick={() => copyToClipboard(selectedDoc.output)} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  {isCopied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
                <button onClick={() => setSelectedDoc(null)} className="p-1 sm:p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X className="w-6 h-6 md:w-7 md:h-7" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-white">
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl mb-6 border border-slate-100">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Original Input</p>
                  <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">{selectedDoc.input}</p>
                </div>
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium pb-10">
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