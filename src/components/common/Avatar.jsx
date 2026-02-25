import { formatters } from '@utils/formatters';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  online = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  const onlineIndicatorSizes = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5',
  };

  const initials = name ? formatters.initials(name) : '?';

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold`}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={`absolute bottom-0 right-0 block ${onlineIndicatorSizes[size]} bg-green-500 rounded-full border-2 border-white`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
