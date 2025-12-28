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
      <title id="student-with-phone-title">2D vector illustration of a cartoon student holding a phone with the Prep Quiz app.</title>
      
      {/* Background shapes */}
      <circle cx="30" cy="40" r="15" fill="hsl(var(--primary) / 0.1)" />
      <rect x="150" y="80" width="30" height="30" rx="8" fill="hsl(var(--accent) / 0.2)" transform="rotate(-20 165 95)" />
      <path d="M 170,15 L 185,30 L 170,45 L 155,30 Z" fill="hsl(var(--primary) / 0.15)" />

      {/* Person */}
      <g transform="translate(0, 10)">
        {/* Legs */}
        <rect x="90" y="115" width="20" height="25" fill="hsl(var(--foreground) / 0.7)" />
        {/* Body */}
        <rect x="75" y="65" width="50" height="50" rx="15" fill="hsl(var(--primary))" />
        {/* Head */}
        <circle cx="100" cy="45" r="22" fill="hsl(var(--accent) / 0.9)" />
        <path d="M 80 25 C 80 10, 120 10, 120 25 L 115 30 L 85 30 Z" fill="hsl(var(--foreground) / 0.8)" />
      </g>

      {/* Phone */}
      <g transform="translate(50 75)">
        <rect x="0" y="0" width="40" height="65" rx="8" fill="hsl(var(--card-foreground))" />
        <rect x="3" y="3" width="34" height="59" rx="6" fill="hsl(var(--background))" />
        
        {/* App Logo on Screen */}
        <g transform="translate(9, 20) scale(0.9)">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="hsl(var(--primary))" fill="none" strokeWidth="1.5" />
            <path d="m9 9.5 2 2 4-4" stroke="hsl(var(--accent))" strokeWidth="2" />
            <path d="m9 14.5 2 2 4-4" stroke="hsl(var(--accent))" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}
