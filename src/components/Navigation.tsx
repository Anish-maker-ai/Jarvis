import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeAutomationsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: string; code: string }> = [
    { id: 'core-hud', label: 'Core HUD', icon: 'grid_view', code: 'HUD.01' },
    { id: 'chat-voice', label: 'Chat & Voice', icon: 'graphic_eq', code: 'VOX.02' },
    { id: 'file-code', label: 'File & Code', icon: 'terminal', code: 'DEV.03' },
    { id: 'settings', label: 'Settings', icon: 'tune', code: 'CFG.04' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#070b14]/90 backdrop-blur-2xl border-t border-[#00f0ff]/25 shadow-[0_-8px_32px_rgba(0,240,255,0.12)]">
      {/* Top holographic light line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80"></div>
      
      <div className="h-16 px-3 max-w-xl mx-auto flex items-center justify-around relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 max-w-[120px] py-1.5 px-2 rounded-xl transition-all duration-300 group cursor-pointer ${
                isActive
                  ? 'text-[#00f0ff] bg-[#00f0ff]/10 shadow-[inset_0_0_12px_rgba(0,240,255,0.2)] border border-[#00f0ff]/40'
                  : 'text-[#849495] hover:text-[#dbfcff] hover:bg-[#181b25]/60 border border-transparent'
              }`}
            >
              {/* Corner HUD brackets for active tab */}
              {isActive && (
                <>
                  <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00f0ff]"></span>
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#00f0ff]"></span>
                  <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#00f0ff]"></span>
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#00f0ff]"></span>
                </>
              )}

              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-all duration-200 ${
                    isActive
                      ? 'scale-110 text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]'
                      : 'group-hover:scale-105 group-hover:text-[#dbfcff]'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${
                  isActive ? 'text-[#00f0ff]' : 'text-[#849495]'
                }`}>
                  {tab.label}
                </span>
              </div>

              {/* Active illuminated bar */}
              {isActive && (
                <span className="absolute -bottom-[1px] w-10 h-[2px] rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
