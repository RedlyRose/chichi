import React from 'react';
import { Github, Twitter, Linkedin, Globe, Instagram, Youtube } from 'lucide-react';

export default function SocialLinks({ customConfig = {} }) {
  const links = customConfig.links || [
    { icon: <Github className="w-4 h-4" />, label: 'GitHub', url: 'https://github.com' },
    { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: <Globe className="w-4 h-4" />, label: 'Website', url: 'https://google.com' }
  ];

  return (
    <div className="w-full h-full p-4 flex flex-col justify-center select-none">
      <h3 className="text-xs font-semibold text-neutral-400 mb-3 ml-1 tracking-wider uppercase">Connect</h3>
      
      <div className="grid grid-cols-2 gap-2 h-full">
        {links.map((link, idx) => (
          <a 
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-400/5 flex items-center justify-center text-neutral-300 group-hover:text-indigo-400 transition-colors">
              {link.icon}
            </div>
            <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
