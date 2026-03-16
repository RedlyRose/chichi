import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AnalyticsGraph() {
  const data = [12, 19, 14, 25, 22, 30, 26, 35, 38];

  return (
    <div className="w-full h-full p-5 flex flex-col select-none justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-neutral-400 tracking-wider">VISITS</h3>
          <p className="text-2xl font-black text-white tracking-tight">2,484</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">
          <ArrowUpRight className="w-3 h-3" />
          +12%
        </div>
      </div>

      {/* Mini Bar Chart simulation using CSS grids/Flex style height maps */}
      <div className="flex items-end gap-1.5 h-16 mt-4">
        {data.map((val, idx) => (
          <div 
            key={idx}
            className="flex-1 rounded-md bg-gradient-to-t from-indigo-500/80 via-indigo-400/50 to-indigo-500/20 min-w-2 transition-all duration-500 hover:from-indigo-400 hover:scale-105 cursor-pointer relative group"
            style={{ height: `${(val / 40) * 100}%` }}
          >
            {/* Tooltip on Hover */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-neutral-900 text-[9px] text-white px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-md transition-opacity pointer-events-none">
              {val}k
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
