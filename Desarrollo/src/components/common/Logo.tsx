import logo from '@/assets/images/logo_sin_fondo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
  sm: 'h-12 md:h-16',
  md: 'h-16 md:h-24',
  lg: 'h-20 md:h-28'
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
