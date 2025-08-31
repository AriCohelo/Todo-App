import React from 'react';
import type { IconProps } from '../types';

export const Icon: React.FC<IconProps> = ({ name, className, onClick, title, alt }) => {
  const basePath = import.meta.env.BASE_URL || '/';
  const iconPath = basePath === '/' ? `/icons/${name}.svg` : `${basePath}icons/${name}.svg`;
  
  return (
    <img
      src={iconPath}
      className={className}
      onClick={onClick}
      title={title}
      alt={alt || title || name}
    />
  );
};

export default Icon;