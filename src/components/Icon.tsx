import React from 'react';
import type { IconProps } from '../types';

export const Icon: React.FC<IconProps> = ({
  name,
  className,
  onClick,
  onPointerDown,
  title,
}) => {
  const basePath = import.meta.env.BASE_URL || '/';
  const iconPath =
    basePath === '/' ? `/icons/${name}.svg` : `${basePath}icons/${name}.svg`;

  return (
    <div
      className={className}
      onClick={onClick}
      onPointerDown={onPointerDown}
      title={title}
      style={{
        backgroundImage: `url(${iconPath})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default Icon;
