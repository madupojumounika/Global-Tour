import React from 'react';
import { MapPin, Star, Map as MapIcon, Loader2, ArrowRight } from 'lucide-react';

function PackageCard({ pkg, onBook, onViewMap, isLoading }) {
  return (
    <div className="group bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 hover:border-blue-500/60 hover:shadow-blue-500/20 hover:shadow-2xl transition-all flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Type & Days */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm text-slate-900">
            {pkg.type}
          </span>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm">
            {pkg.days} Days
          </span>
        </div>

        {/* Map Button */}
        <button
          onClick={() => onViewMap(pkg)}
          className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-xl text-blue-600 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90"
        >
          <MapIcon size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Rating & Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-semibold text-slate-100">{pkg.rating}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            {pkg.category}
          </span>
        </div>

        {/* Title & Location */}
        <h4 className="text-lg font-black text-slate-50 mb-1 leading-tight">{pkg.title}</h4>
        <p className="text-slate-400 font-medium text-xs mb-6">
          <MapPin size={11} className="inline mr-1" />
          {pkg.location}
        </p>

        {/* Book Button */}
        <div className="mt-auto flex justify-center pt-4 border-t border-slate-800">
          <button
            onClick={() => onBook(pkg)}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white px-8 py-3 rounded-2xl flex items-center gap-3 text-sm font-black uppercase disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-500/40 transition-all"
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