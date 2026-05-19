import logo from '@/assets/images/logo_sin_fondo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
  sm: 'h-20 md:h-20',
  md: 'h-28 md:h-28',
  lg: 'h-32 md:h-32'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logo}
        alt="Forkast"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </div>
  );
}
