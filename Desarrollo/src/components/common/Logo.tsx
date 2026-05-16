interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { height: 32, fontSize: '20px' },
    md: { height: 48, fontSize: '32px' },
    lg: { height: 64, fontSize: '48px' }
  };

  const { height, fontSize } = sizes[size];

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <svg width={height * 3.5} height={height} viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="48" fill="#44916F" style={{ fontSize, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          For
        </text>
        <g transform="translate(85, 0)">
          <path d="M0 48V12h8v36h-8z M16 12h8l-8 20h8l8-20h8L32 32l8 16h-8l-8-16h-8v16h-8V12z" fill="#44916F"/>
          <path d="M16 15l2-3 2 1 2 1 1 2v3l-2 2-2 1-2-1-2-2v-3l1-1z M17 16l1 1 1 1h2l1-1 1-1v-2l-1-1-1-1h-2l-1 1-1 1v2z" fill="#44916F"/>
          <path d="M20 14h2v4l2-2 1-1 1 1-2 2-2 2h-2v-6z" fill="#44916F"/>
        </g>
        <text x="140" y="48" fill="#44916F" style={{ fontSize, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          ast
        </text>
      </svg>
    </div>
  );
}
