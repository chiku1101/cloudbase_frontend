import React, { useEffect, useState } from 'react';

const JoinAnimation = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-1000 ease-out ${className}`}>
      {React.Children.map(children, (child, index) => {
        // Determine animation direction based on index
        const isEven = index % 2 === 0;
        const direction = isEven ? 'left' : 'right';
        
        return (
          <div
            key={index}
            className={`transition-all duration-800 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
                : direction === 'left'
                ? 'opacity-0 -translate-x-12 translate-y-4 scale-95'
                : 'opacity-0 translate-x-12 translate-y-4 scale-95'
            }`}
            style={{
              transitionDelay: `${index * 150}ms`,
              transformOrigin: direction === 'left' ? 'left center' : 'right center',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default JoinAnimation;
