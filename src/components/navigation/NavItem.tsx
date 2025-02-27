/**
 * NavItem Component
 * Renders a single navigation item with icon and text
 */
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface NavItemProps {
  icon: LucideIcon;
  text: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  isMenuOpen: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  text, 
  active, 
  className = '', 
  onClick, 
  isMenuOpen 
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${active 
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
        ${className}
        ${!isMenuOpen && isDesktop ? 'md:justify-center' : ''}
      `}
      title={!isMenuOpen && isDesktop ? text : undefined}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <span className={`transition-opacity duration-200 ${!isMenuOpen && isDesktop ? 'md:hidden' : ''}`}>
        {text}
      </span>
    </button>
  );
};
