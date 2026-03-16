import React, { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
      <div className="relative w-28 h-28 rounded-full border border-white/[0.04] bg-neutral-950/20 backdrop-blur-3xl shadow-2xl flex items-center justify-center">
        {/* Center Dot */}
        <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full z-30 shadow-md shadow-indigo-500/20" />

        {/* Hour Hand */}
        <div 
          className="absolute w-[3px] h-9 bg-neutral-200 rounded-full origin-bottom z-10 transition-transform duration-300"
          style={{ 
            transform: `translateY(-50%) rotate(${hourDeg}deg)`,
            top: '50%'
          }}
        />

        {/* Minute Hand */}
        <div 
          className="absolute w-[2px] h-12 bg-neutral-400 rounded-full origin-bottom z-10 transition-transform duration-300"
          style={{ 
            transform: `translateY(-50%) rotate(${minDeg}deg)`,
            top: '50%'
          }}
        />

        {/* Second Hand */}
        <div 
          className="absolute w-[1px] h-12 bg-rose-500 origin-bottom z-20 transition-transform duration-100"
          style={{ 
            transform: `translateY(-50%) rotate(${secDeg}deg)`,
            top: '50%'
          }}
        />

        {/* Clock Dials (Ticks) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <div 
            key={i}
            className="absolute w-[1px] h-2 bg-white/10 origin-bottom"
            style={{ 
              transform: `rotate(${deg}deg) translateY(-48px)`,
              top: '50%'
            }}
          />
        ))}
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-bold text-neutral-300">
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
