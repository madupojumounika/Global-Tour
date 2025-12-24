import React from 'react';
import { MapPin, Star, Map as MapIcon, Loader2, ArrowRight } from 'lucide-react';

function PackageCard({ pkg, onBook, onViewMap, isLoading }) {
  return (
    <div className="group bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 hover:border-blue-500/60 hover:shadow-blue-500/20 hover:shadow-2xl transition-all h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pkg.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={pkg.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm inline-block text-slate-900">
            {pkg.type}
          </span>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm inline-block">
            {pkg.days}
          </span>
        </div>
        <button
          onClick={() => onViewMap(pkg)}
          className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-xl text-blue-600 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90"
        >
          <MapIcon size={20} />
        </button>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-semibold text-slate-100">{pkg.rating}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            {pkg.category}
          </span>
        </div>
        <h4 className="text-lg font-black text-slate-50 mb-1 leading-tight">
          {pkg.title}
        </h4>
        <p className="text-slate-400 font-medium text-xs mb-4">
          <MapPin size={11} className="inline mr-1" />
          {pkg.location}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">From</span>
            <div className="text-2xl font-black text-slate-50">${pkg.price}</div>
          </div>
          <button
            onClick={() => onBook(pkg)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase disabled:opacity-50 active:scale-95"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
