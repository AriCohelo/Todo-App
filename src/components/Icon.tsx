import React from 'react';
import type { IconProps } from '../types';

export const Icon: React.FC<IconProps> = ({ name, className, onClick, title, alt }) => {
  return (
    <img
      src={`/Todo-App/icons/${name}.svg`}
      className={className}
      onClick={onClick}
      title={title}
      alt={alt || title || name}
    />
  );
};

export default Icon;