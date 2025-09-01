'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  padding = 'md',
  onClick 
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'shadow-sm hover:shadow-md border border-gray-100',
    outlined: 'border-2 border-gray-200 hover:border-primary-300 hover:shadow-sm',
    elevated: 'shadow-lg hover:shadow-xl border-0',
  };
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer hover:scale-[1.02]' : '';

  return (
    <div
      className={clsx(
        baseClasses,
        variants[variant],
        paddings[padding],
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Componente específico para publicaciones
interface PostCardProps {
  children: ReactNode;
  className?: string;
  author?: {
    name: string;
    avatar?: string;
    time: string;
  };
}

export function PostCard({ children, className, author }: PostCardProps) {
  return (
    <Card variant="outlined" padding="lg" className={clsx('space-y-4', className)}>
      {author && (
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-primary-700 font-body font-semibold text-sm">
                {author.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-body font-semibold text-text-primary">{author.name}</h4>
            <p className="text-xs font-body text-text-muted">{author.time}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
}
