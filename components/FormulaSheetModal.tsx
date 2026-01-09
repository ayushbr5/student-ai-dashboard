"use client";

import { X, Square, Circle, Triangle } from 'lucide-react';

export default function FormulaSheetModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const formulas = [
    { title: 'Square', area: 'A = s²', perimeter: 'P = 4s', icon: Square },
    { title: 'Rectangle', area: 'A = l × w', perimeter: 'P = 2(l + w)', icon: Square },
    { title: 'Circle', area: 'A = πr²', perimeter: 'C = 2πr', icon: Circle },
    { title: 'Triangle', area: 'A = ½bh', perimeter: 'P = a + b + c', icon: Triangle },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Geometry Formulas</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formulas.map((f) => (
            <div key={f.title} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-600">Area: <code className="bg-white px-1 rounded">{f.area}</code></p>
                <p className="text-sm text-slate-600">Perimeter: <code className="bg-white px-1 rounded">{f.perimeter}</code></p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-xs text-blue-600 font-medium italic">
            Tip: Use these formulas to double-check the calculations in your AI Adventures!
          </p>
        </div>
      </div>
    </div>
  );
}