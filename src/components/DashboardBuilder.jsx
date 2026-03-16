import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { Settings, Lock, MapPin, Eye, Palette, Sliders, Square } from 'lucide-react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ProfileCard from './widgets/ProfileCard';
import SocialLinks from './widgets/SocialLinks';
import AnalogClock from './widgets/AnalogClock';
import AnalyticsGraph from './widgets/AnalyticsGraph';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  profile: ProfileCard,
  links: SocialLinks,
  clock: AnalogClock,
  graphs: AnalyticsGraph,
};

export default function DashboardBuilder() {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'profile', x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
      { i: 'links', x: 4, y: 0, w: 4, h: 2, minW: 3 },
      { i: 'clock', x: 8, y: 0, w: 4, h: 3 },
      { i: 'graphs', x: 0, y: 3, w: 8, h: 3 },
    ]
  });

  const [isDraggable, setIsDraggable] = useState(true);
  const [isResizable, setIsResizable] = useState(true);

  // Phase 2.2 Global Customizer State
  const [bgUrl, setBgUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80');
  const [bgBlur, setBgBlur] = useState(12);
  const [bgTintColor, setBgTintColor] = useState('#0a0b10');
  const [bgOpacity, setBgOpacity] = useState(60); 
  const [cardRadius, setCardRadius] = useState(24);
  const [glowStrength, setGlowStrength] = useState(15);
  const [cardBgOpacity, setCardBgOpacity] = useState(40);

  // Phase 2.3 Preview State
  const [isPreview, setIsPreview] = useState(false);

  // Phase 3 Save State
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const resp = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: 'test-page-id', // bound to seeded local page
          layouts: layouts,
          theme: { bgUrl, bgBlur, bgTintColor, bgOpacity, cardRadius, glowStrength, cardBgOpacity }
        })
      });
      const res = await resp.json();
      if (res.success) {
        alert('🎨 Canvas Design Published to D1 Successfully!');
      } else {
        alert('Failed: ' + res.error);
      }
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen text-white p-8 font-sans transition-all duration-500 bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: `url(${bgUrl})`,
      }}
    >
      {/* Background Tint + Blur Overlay */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{ 
          backgroundColor: bgTintColor,
          opacity: bgOpacity / 100,
          backdropFilter: `blur(${bgBlur}px)`,
        }}
      />

      {/* Floating Exit Button for Preview Mode */}
      {isPreview && (
        <button 
          onClick={() => {
            setIsPreview(false);
            setIsDraggable(true);
            setIsResizable(true);
          }}
          className="fixed top-6 right-6 z-50 bg-[#12131a]/80 border border-white/10 p-3.5 rounded-2xl backdrop-blur-3xl hover:bg-[#16171d] hover:scale-105 active:scale-95 shadow-2xl transition-all cursor-pointer"
          title="Exit Preview"
        >
          <Eye className="w-5 h-5 text-indigo-400" />
        </button>
      )}

      {/* Main Content Wrapper */}
      <div className={`relative z-10 flex flex-col h-full mx-auto transition-all duration-500 ${isPreview ? 'max-w-full' : 'max-w-7xl'}`}>
        
        {/* Top Navbar */}
        {!isPreview && (
          <div className="mb-6 flex justify-between items-center bg-[#16171d]/60 backdrop-blur-3xl p-4 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-400 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-[14px] bg-[#111218] flex items-center justify-center">
                  <Square className="w-4 h-4 text-fuchsia-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                ChichiCanvas
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Preview Button */}
              <button 
                onClick={() => {
                  setIsPreview(true);
                  setIsDraggable(false);
                  setIsResizable(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium bg-neutral-800/80 border border-neutral-700/50 hover:border-neutral-600 transition-all duration-300"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                Preview
              </button>

              <button 
                onClick={() => {
                  setIsDraggable(!isDraggable);
                  setIsResizable(!isResizable);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                  isDraggable 
                    ? 'bg-neutral-800/80 border-neutral-700/50 hover:border-neutral-600' 
                    : 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10'
                }`}
              >
                {isDraggable ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {isDraggable ? 'Lock Design' : 'Edit Layout'}
              </button>
              <button 
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        )}

        {/* Workspace Splitting Layout */}
        <div className="flex gap-6 flex-1">
          
          {/* Grid Canvas Workspace (Left) */}
          <div className={`flex-1 relative rounded-[32px] border border-white/[0.04] bg-[#0a0b10]/40 p-2 backdrop-blur-lg overflow-hidden min-h-[calc(100vh-160px)] transition-all duration-500`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06)_0%,transparent_100%)] pointer-events-none" />
            
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              isDraggable={isDraggable}
              isResizable={isResizable}
              margin={[16, 16]}
              onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
            >
              {[
                { id: 'profile' },
                { id: 'links' },
                { id: 'clock' },
                { id: 'graphs' }
              ].map(item => {
                const Widget = widgetComponents[item.id];
                return (
                  <div 
                    key={item.id} 
                    className="group relative border border-white/[0.04] backdrop-blur-xl hover:border-indigo-400/20 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.08)] transition-all duration-300 overflow-hidden"
                    style={{
                      borderRadius: `${cardRadius}px`,
                      backgroundColor: `rgba(22, 23, 29, ${cardBgOpacity / 100})`,
                      boxShadow: `0 4px 20px -5px rgba(0,0,0,0.5), 0 0 ${glowStrength}px -3px rgba(99, 102, 241, ${glowStrength / 100})`
                    }}
                  >
                    {Widget && <Widget />}
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          </div>

          {/* Settings Sidebar (Right) */}
          {!isPreview && (
            <div className="w-80 bg-[#14151a]/80 border border-white/5 rounded-[32px] p-6 backdrop-blur-2xl shadow-2xl h-fit sticky top-0 transition-all duration-500">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Palette className="w-4 h-4 text-neutral-400" />
                <h2 className="font-bold text-sm tracking-wide text-neutral-200 uppercase">Canvas Theme</h2>
              </div>

              <div className="space-y-5">
                {/* Background Options */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">Background Image URL</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={bgUrl} 
                      onChange={e => setBgUrl(e.target.value)}
                      className="w-full bg-[#1c1e24] border border-white/5 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500/40"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Spacing / Sliders */}
                {[
                  { label: 'Background Blur', value: bgBlur, min: 0, max: 20, setter: setBgBlur, icon: <Eye className="w-3 h-3 text-neutral-500" /> },
                  { label: 'Tint Opacity (%)', value: bgOpacity, min: 10, max: 100, setter: setBgOpacity, icon: <Sliders className="w-3 h-3 text-neutral-500" /> },
                  { label: 'Corner Radius (px)', value: cardRadius, min: 0, max: 40, setter: setCardRadius, icon: <Square className="w-3 h-3 text-neutral-500" /> },
                  { label: 'Card Translucency (%)', value: cardBgOpacity, min: 10, max: 90, setter: setCardBgOpacity, icon: <Palette className="w-3 h-3 text-neutral-500" /> },
                  { label: 'Glow Strength', value: glowStrength, min: 0, max: 30, setter: setGlowStrength, icon: <Settings className="w-3 h-3 text-neutral-500" /> },
                ].map((slider, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {slider.icon}
                        <span className="text-xs font-medium text-neutral-300">{slider.label}</span>
                      </div>
                      <span className="text-xs text-indigo-400 font-bold">{slider.value}</span>
                    </div>
                    <input 
                      type="range" 
                      min={slider.min} 
                      max={slider.max} 
                      value={slider.value} 
                      onChange={e => slider.setter(Number(e.target.value))}
                      className="w-full h-1 bg-[#1c1e24] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">Tint Overlay Color</label>
                  <div className="flex gap-2">
                    {['#0a0b10', '#121019', '#1a0b0b', '#0b1612'].map((color, i) => (
                      <button 
                        key={i}
                        onClick={() => setBgTintColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border border-white/10 ${bgTintColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#14151a]' : ''}`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
