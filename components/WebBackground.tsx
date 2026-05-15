'use client';

export function WebBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Corner web - top right */}
      <svg
        className="absolute -top-10 -right-10 opacity-[0.06] web-strand"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
      >
        <line x1="400" y1="0" x2="200" y2="200" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="400" y1="0" x2="150" y2="250" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="400" y1="0" x2="100" y2="200" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="400" y1="0" x2="200" y2="150" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="400" y1="0" x2="250" y2="100" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="400" y1="0" x2="300" y2="50" stroke="#C9A84C" strokeWidth="0.8" />
        {/* Cross strands */}
        <path d="M 340 0 Q 300 80 200 150" stroke="#7B5EA7" strokeWidth="0.6" fill="none" />
        <path d="M 380 50 Q 320 130 180 200" stroke="#7B5EA7" strokeWidth="0.6" fill="none" />
        <path d="M 400 80 Q 330 160 170 230" stroke="#C9A84C" strokeWidth="0.5" fill="none" />
        <path d="M 400 140 Q 320 200 150 270" stroke="#7B5EA7" strokeWidth="0.5" fill="none" />
      </svg>

      {/* Corner web - bottom left */}
      <svg
        className="absolute -bottom-10 -left-10 opacity-[0.05] web-strand"
        style={{ animationDelay: '4s' }}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
      >
        <line x1="0" y1="300" x2="150" y2="150" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="0" y1="300" x2="180" y2="130" stroke="#7B5EA7" strokeWidth="1" />
        <line x1="0" y1="300" x2="100" y2="100" stroke="#C9A84C" strokeWidth="0.8" />
        <line x1="0" y1="300" x2="50" y2="150" stroke="#7B5EA7" strokeWidth="1" />
        <path d="M 0 260 Q 80 200 180 130" stroke="#7B5EA7" strokeWidth="0.6" fill="none" />
        <path d="M 30 300 Q 100 230 200 160" stroke="#C9A84C" strokeWidth="0.5" fill="none" />
        <path d="M 0 220 Q 60 170 160 110" stroke="#7B5EA7" strokeWidth="0.5" fill="none" />
      </svg>

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />
    </div>
  );
}
