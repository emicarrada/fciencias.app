import Image from 'next/image';

interface LoaderProps {
  size?: number;
  className?: string;
}

export default function Loader({ size = 48, className = '' }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/3-dots-bounce.svg"
        alt="Cargando..."
        width={size}
        height={size}
        className="animate-pulse"
      />
    </div>
  );
}