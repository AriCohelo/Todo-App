import React from 'react';

type IconName = 'plus' | 'palette' | 'trash' | 'x';

interface IconProps {
  name: IconName;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  title?: string;
  alt?: string;
}

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