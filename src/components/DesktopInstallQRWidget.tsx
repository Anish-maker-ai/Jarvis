import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { sfx } from '../utils/speech';

export const DesktopInstallQRWidget: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://ais-dev-zto7tlrccmhqncicm33u6p-107559288825.asia-southeast1.run.app');
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    sfx.playAcknowledge();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="PC & Mobile Installation QR Code"
      className="fixed bottom-20 right-4 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Expanded QR Card */}
      {isExpanded ? (
        <div className="w-56 p-3 rounded-2xl bg-[#0a0e17]/95 backdrop-blur-xl border border-[#00f0ff]/40 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col gap-2.5 animate-reactor-glow">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#00f0ff]/20">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[#00f0ff] text-base">qr_code_2</span>
              <span className="font-label-sm text-[#00f0ff] uppercase font-bold truncate">
                INSTALL ON PC / PHONE
              </span>
            </div>
            <button
              onClick={() => {
                sfx.playActivate();
                setIsExpanded(false);
              }}
              className="text-[#849495] hover:text-[#dfe2f0] p-0.5"
              title="Minimize QR widget"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2.5 rounded-xl flex items-center justify-center shadow-inner mx-auto">
            <QRCodeSVG
              value={currentUrl}
              size={132}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#0a0e17"
            />
          </div>

          <div className="flex flex-col items-center text-center gap-1">
            <span className="font-label-sm text-[#b9cacb] uppercase text-[10px]">
              Scan with camera to open & install
            </span>
            <button
              onClick={handleCopy}
              className="w-full py-1.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/30 font-label-sm uppercase font-bold transition-all flex items-center justify-center gap-1 text-xs"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'done' : 'content_copy'}
              </span>
              <span>{copied ? 'URL Copied!' : 'Copy App Link'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Minimized Floating Badge */
        <button
          onClick={() => {
            sfx.playActivate();
            setIsExpanded(true);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#181b25]/95 backdrop-blur-xl border border-[#00f0ff]/50 text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg animate-pulse">qr_code_2</span>
          <span className="font-label-sm font-bold uppercase tracking-wider text-xs">
            Scan to Install
          </span>
        </button>
      )}
    </aside>
  );
};
