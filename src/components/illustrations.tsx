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
      <title id="student-with-phone-title">Illustration of a cartoon student holding a phone with the Prep Quiz app.</title>
      
      {/* Background elements */}
      <circle cx="25" cy="50" r="12" fill="hsl(var(--primary) / 0.2)" />
      <rect x="160" y="80" width="25" height="25" rx="5" fill="hsl(var(--accent) / 0.4)" transform="rotate(-15 172.5 92.5)" />
      <path d="M 150,20 L 160,30 L 150,40 Z" fill="hsl(var(--primary) / 0.3)" />

      {/* Student */}
      <g>
        {/* Head */}
        <circle cx="100" cy="50" r="20" fill="hsl(var(--accent) / 0.8)" />
        {/* Hair */}
        <path d="M 85,35 C 80,20 120,20 115,35 Q 100,40 85,35 Z" fill="hsl(var(--foreground) / 0.8)" />
        {/* Eyes */}
        <circle cx="93" cy="50" r="2" fill="hsl(var(--foreground))" />
        <circle cx="107" cy="50" r="2" fill="hsl(var(--foreground))" />
        {/* Smile */}
        <path d="M 95 60 Q 100 65 105 60" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
        
        {/* Body */}
        <rect x="80" y="70" width="40" height="50" rx="10" fill="hsl(var(--primary))" />
        {/* Arm holding phone */}
        <rect x="65" y="75" width="30" height="15" rx="7.5" fill="hsl(var(--primary))" />
      </g>

      {/* Phone */}
      <g transform="translate(45 80)">
        {/* Phone Case */}
        <rect x="0" y="0" width="35" height="60" rx="5" fill="hsl(var(--foreground) / 0.7)" />
        {/* Phone Screen */}
        <rect x="2.5" y="2.5" width="30" height="55" rx="3" fill="hsl(var(--background))" />
        
        {/* App Logo on Screen */}
        <g transform="translate(7, 15) scale(0.8)">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="hsl(var(--primary))" fill="none" strokeWidth="1.5" />
            <path d="m9 9.5 2 2 4-4" stroke="hsl(var(--accent))" strokeWidth="2" />
            <path d="m9 14.5 2 2 4-4" stroke="hsl(var(--accent))" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}
