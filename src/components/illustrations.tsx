import type { SVGProps } from 'react';

export function StudyingIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
        viewBox="0 0 200 150" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-labelledby="studying-title"
        role="img"
        {...props}
    >
        <title id="studying-title">Illustration of a character celebrating learning with books and confetti.</title>
        <defs>
            <linearGradient id="char-shirt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--primary) / 0.7)'}} />
            </linearGradient>
            <linearGradient id="char-pants-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--foreground) / 0.8)'}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--foreground) / 0.6)'}} />
            </linearGradient>
            <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="4" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Background Shapes */}
        <circle cx="50" cy="40" r="30" fill="hsl(var(--primary) / 0.1)" />
        <rect x="150" y="70" width="40" height="40" rx="8" fill="hsl(var(--accent) / 0.2)" transform="rotate(-25 170 90)" />

        {/* Books */}
        <g transform="translate(10, 100)">
            <rect width="60" height="20" rx="4" fill="hsl(var(--accent) / 0.9)" transform="skewY(-5)" />
            <rect y="8" width="60" height="15" rx="3" fill="hsl(var(--accent) / 0.7)" transform="skewY(-5)" />
            <rect y="-12" width="60" height="18" rx="4" fill="hsl(var(--accent) / 0.8)" transform="skewY(-5)" />
        </g>
        
        {/* Character */}
        <g transform="translate(85, 20)" filter="url(#soft-shadow)">
            {/* Legs */}
            <path d="M 45 95 C 40 120, 50 130, 60 130 C 70 130, 80 120, 75 95 Z" fill="url(#char-pants-grad)" />
            
            {/* Body */}
            <path d="M 30 40 C 30 20, 90 20, 90 40 L 85 100 L 35 100 Z" fill="url(#char-shirt-grad)" />
            
            {/* Head */}
            <circle cx="60" cy="30" r="25" fill="hsl(var(--accent) / 0.6)" />
            <path d="M 40 10 C 40 -5, 80 -5, 80 10 L 70 15 L 50 15 Z" fill="hsl(var(--foreground) / 0.7)" />
            <circle cx="52" cy="30" r="2" fill="hsl(var(--foreground))" />
            <circle cx="68" cy="30" r="2" fill="hsl(var(--foreground))" />
            <path d="M 58 38 Q 60 42, 62 38" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Arms */}
            <path d="M 30 50 C 10 60, 10 80, 25 80" stroke="url(#char-shirt-grad)" strokeWidth="16" fill="none" strokeLinecap="round" />
            <path d="M 90 50 C 110 60, 110 80, 95 80" stroke="url(#char-shirt-grad)" strokeWidth="16" fill="none" strokeLinecap="round" />
        </g>

        {/* Confetti */}
        <g style={{animation: 'confetti-fall 3s ease-out infinite'}}>
            <rect x="20" y="-10" width="5" height="10" fill="hsl(var(--primary))" rx="2" transform="rotate(20)" />
            <circle cx="180" cy="-5" r="4" fill="hsl(var(--accent))" />
            <polygon points="-5,100 5,100 0,110" fill="hsl(var(--primary) / 0.8)" transform="rotate(-30)" />
            <rect x="170" y="40" width="6" height="6" fill="hsl(var(--accent)/0.9)" rx="2" transform="rotate(50)" />
            <circle cx="10" cy="20" r="3" fill="hsl(var(--primary) / 0.7)" />
        </g>
        <style>
            {`@keyframes confetti-fall {
                0% { transform: translateY(-20px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(160px); opacity: 0; }
            }`}
        </style>
    </svg>
  );
}
