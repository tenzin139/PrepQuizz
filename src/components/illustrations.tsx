import type { SVGProps } from 'react';

export function StudyingIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 150"
      aria-labelledby="studying-illustration-title"
      role="img"
      {...props}
    >
      <title id="studying-illustration-title">Illustration of a person studying on a large pile of books.</title>
      
      {/* Background elements */}
      <circle cx="40" cy="40" r="10" fill="hsl(var(--accent) / 0.5)" />
      <circle cx="160" cy="110" r="15" fill="hsl(var(--primary) / 0.2)" />
      <rect x="150" y="20" width="20" height="20" rx="5" fill="hsl(var(--accent) / 0.3)" transform="rotate(25 160 30)" />

      {/* Pile of books */}
      <g>
        <rect x="20" y="130" width="160" height="15" rx="3" fill="hsl(var(--primary) / 0.8)" />
        <rect x="25" y="110" width="150" height="20" rx="3" fill="hsl(var(--secondary-foreground) / 0.8)" />
        <rect x="30" y="95" width="140" height="15" rx="3" fill="hsl(var(--primary) / 0.6)" />
        <rect x="35" y="80" width="130" height="15" rx="3" fill="hsl(var(--secondary-foreground) / 0.6)" />
      </g>
      
      {/* Person */}
      <g transform="translate(0, -10)">
        {/* Body */}
        <path d="M85,45 Q100,40 115,45 L120,85 L80,85 Z" fill="hsl(var(--accent))" />
        {/* Head */}
        <circle cx="100" cy="30" r="15" fill="hsl(var(--foreground) / 0.8)" />
         {/* Hair */}
        <path d="M 88,20 C 85,10, 115,10, 112,20 C 115,25, 85,25, 88,20 Z" fill="hsl(var(--foreground))" />
      </g>
      
      {/* Open Book on lap */}
      <g transform="translate(75, 65) rotate(5 100 80)">
        <path d="M0,0 C10,-5, 20,-5, 30,0 L30,20 L0,20 Z" fill="#fff" stroke="hsl(var(--border))" strokeWidth="1"/>
        <path d="M30,0 C40,-5, 50,-5, 60,0 L60,20 L30,20 Z" fill="#fff" stroke="hsl(var(--border))" strokeWidth="1"/>
        {/* Book lines */}
        <line x1="5" y1="5" x2="25" y2="5" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <line x1="5" y1="10" x2="25" y2="10" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <line x1="35" y1="5" x2="55" y2="5" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <line x1="35" y1="10" x2="55" y2="10" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
