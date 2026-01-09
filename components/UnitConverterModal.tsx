"use client";

import { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';

export default function UnitConverterModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [value, setValue] = useState<number>(0);
  const [unitType, setUnitType] = useState('m_to_km');

  if (!isOpen) return null;

  const convert = (val: number) => {
    switch (unitType) {
      case 'm_to_km': return val / 1000;
      case 'km_to_m': return val * 1000;
      case 'kg_to_g': return val * 1000;
      case 'g_to_kg': return val / 1000;
      default: return val;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Unit Converter</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-500 mb-1 block">Conversion Type</label>
            <select 
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="m_to_km">Meters to Kilometers</option>
              <option value="km_to_m">Kilometers to Meters</option>
              <option value="kg_to_g">Kilograms to Grams</option>
              <option value="g_to_kg">Grams to Kilograms</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500 mb-1 block">Enter Value</label>
            <input 
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center py-2">
            <div className="bg-blue-50 p-2 rounded-full">
              <ArrowRightLeft className="text-blue-600 rotate-90" size={20} />
            </div>
          </div>

          <div className="bg-blue-600 p-4 rounded-xl text-center">
            <span className="text-blue-100 text-sm block">Result</span>
            <span className="text-white text-3xl font-bold">{convert(value)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}