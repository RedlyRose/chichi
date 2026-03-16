import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ProfileCard({ customConfig = {}, onUpdateConfig = () => {} }) {
  const [name, setName] = useState(customConfig.name || 'John Doe');
  const [bio, setBio] = useState(customConfig.bio || 'Product Designer based in NYC. Crafting interfaces & code.');
  const [avatar, setAvatar] = useState(customConfig.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data.success) {
        setAvatar(data.url);
        onUpdateConfig({ avatarUrl: data.url });
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none group">
      {/* Avatar Container with Hover Upload */}
      <div className="relative w-16 h-16 mb-3">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/30 to-rose-400/20 p-0.5">
          <img 
            src={avatar} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover rounded-[14px]"
          />
        </div>
        
        {/* Hover Camera Label for Upload (Only visible when hovering over parent in design mode) */}
        <label className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-[10px] text-white py-1 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="w-3 h-3 text-neutral-300" />
          Edit
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload}
          />
        </label>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm text-neutral-200 tracking-wide">{name}</h3>
        <p className="text-[11px] text-neutral-400 font-medium px-4 line-clamp-2">{bio}</p>
      </div>

      {/* Badges Slider Wrapper */}
      <div className="flex gap-1.5 mt-3">
        <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
          Designer
        </span>
        <span className="text-[10px] font-semibold bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/20">
          Developer
        </span>
      </div>
    </div>
  );
}
