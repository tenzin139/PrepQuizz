import type { SVGProps } from 'react';

export function StudyingIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 150"
      aria-labelledby="student-with-phone-title"
      role="img"
      {...props}
    >
      <title id="student-with-phone-title">Illustration of a student sitting and using the Prep Quiz app on a smartphone.</title>
      
      <defs>
        <linearGradient id="person-shirt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--primary) / 0.7)', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="person-trousers-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--foreground) / 0.8)'}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--foreground) / 0.6)'}} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="2" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
            </feMerge>
        </filter>
      </defs>

      {/* Background elements */}
      <circle cx="40" cy="50" r="20" fill="hsl(var(--primary) / 0.1)" />
      <rect x="140" y="70" width="40" height="40" rx="8" fill="hsl(var(--accent) / 0.15)" transform="rotate(-15 160 90)" />

      {/* Person */}
      <g transform="translate(15, 0)" filter="url(#shadow)">
          {/* Legs */}
          <path d="M 85 100 L 80 140 L 100 140 L 105 100 Z" fill="url(#person-trousers-gradient)" />
          
          {/* Body */}
          <path d="M 70 50 C 70 30, 130 30, 130 50 L 125 105 L 75 105 Z" fill="url(#person-shirt-gradient)" />
          
          {/* Head */}
          <circle cx="100" cy="35" r="25" fill="hsl(var(--accent) / 0.8)" />
          <path d="M 80 15 C 80 0, 120 0, 120 15 L 110 20 L 90 20 Z" fill="hsl(var(--foreground) / 0.7)" />
          <circle cx="92" cy="35" r="1.5" fill="hsl(var(--foreground) / 0.7)" />
          <circle cx="108" cy="35" r="1.5" fill="hsl(var(--foreground) / 0.7)" />
          <path d="M 98 42 Q 100 45, 102 42" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="1.5" fill="none" />

          {/* Arms & Phone */}
          <g>
            <rect x="50" y="60" width="50" height="15" rx="7" fill="url(#person-shirt-gradient)" transform="rotate(10 75 67.5)" />
            {/* Phone */}
            <rect x="35" y="65" width="45" height="70" rx="8" fill="hsl(var(--foreground) / 0.9)" />
            <rect x="38" y="68" width="39" height="64" rx="6" fill="hsl(var(--background))" />
            
            {/* App Logo on Screen */}
            <g transform="translate(45, 80) scale(0.8)">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="hsl(var(--primary))" fill="none" strokeWidth="1.5" />
                 <text x="12" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="hsl(var(--primary))" fontFamily="sans-serif">Prep</text>
                 <text x="12" y="48" textAnchor="middle" fontSize="8" fontWeight="bold" fill="hsl(var(--primary))" fontFamily="sans-serif">Quiz</text>
            </g>
          </g>
      </g>
    </svg>
  );
}
