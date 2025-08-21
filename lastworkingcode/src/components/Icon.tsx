import React from 'react';
import type { IconProps } from '../types';

export const Icon: React.FC<IconProps> = ({ name, className, onClick, title, alt }) => {
  const basePath = import.meta.env.BASE_URL || '/';
  
  return (
    <img
      src={`${basePath}icons/${name}.svg`}
      className={className}
      onClick={onClick}
      title={title}
      alt={alt || title || name}
    />
  );
};

export default Icon;