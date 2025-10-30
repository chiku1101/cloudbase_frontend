import React, { useRef, useEffect } from 'react';
import { 
  FaGoogle, 
  FaMicrosoft, 
  FaAmazon, 
  FaApple, 
  FaFacebook, 
  FaStripe,
  FaPlay,
  FaSpotify,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaSnapchat
} from 'react-icons/fa';

const LogoLoop = ({ 
  logos = [], 
  speed = 1, 
  direction = 'left',
  className = '',
  logoClassName = '',
  pauseOnHover = true 
}) => {
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    if (pauseOnHover && containerRef.current) {
      containerRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && containerRef.current) {
      containerRef.current.style.animationPlayState = 'running';
    }
  };

  // Default logos if none provided
  const defaultLogos = [
    { name: 'Google', icon: FaGoogle },
    { name: 'Microsoft', icon: FaMicrosoft },
    { name: 'Amazon', icon: FaAmazon },
    { name: 'Apple', icon: FaApple },
    { name: 'Facebook', icon: FaFacebook },
    { name: 'Stripe', icon: FaStripe },
    { name: 'Instagram', icon: FaInstagram },
    { name: 'Spotify', icon: FaSpotify },
    { name: 'LinkedIn', icon: FaLinkedin },
    { name: 'Twitter', icon: FaTwitter },
    { name: 'GitHub', icon: FaGithub },
    { name: 'YouTube', icon: FaYoutube }
  ];

  const logosToUse = logos.length > 0 ? logos : defaultLogos;

  return (
    <div 
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={containerRef}
        className="flex items-center whitespace-nowrap"
        style={{
          width: '300%',
          display: 'flex',
          animation: `logoLoop${direction === 'left' ? 'Left' : 'Right'} ${20 / speed}s linear infinite`,
          animationPlayState: 'running'
        }}
      >
        {/* First set of logos */}
        <div className="flex items-center space-x-16 px-6">
          {logosToUse.map((logo, index) => (
            <div
              key={`first-${index}`}
              className={`flex items-center justify-center ${logoClassName}`}
            >
              {typeof logo === 'string' ? (
                <span className="text-2xl font-bold text-gray-400">{logo}</span>
              ) : (
                <div className="flex items-center justify-center">
                  {logo.icon && <logo.icon className="w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors" />}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Second set of logos (for seamless loop) */}
        <div className="flex items-center space-x-16 px-6">
          {logosToUse.map((logo, index) => (
            <div
              key={`second-${index}`}
              className={`flex items-center justify-center ${logoClassName}`}
            >
              {typeof logo === 'string' ? (
                <span className="text-2xl font-bold text-gray-400">{logo}</span>
              ) : (
                <div className="flex items-center justify-center">
                  {logo.icon && <logo.icon className="w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors" />}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Third set of logos (for perfect infinite loop) */}
        <div className="flex items-center space-x-16 px-6">
          {logosToUse.map((logo, index) => (
            <div
              key={`third-${index}`}
              className={`flex items-center justify-center ${logoClassName}`}
            >
              {typeof logo === 'string' ? (
                <span className="text-2xl font-bold text-gray-400">{logo}</span>
              ) : (
                <div className="flex items-center justify-center">
                  {logo.icon && <logo.icon className="w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors" />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoLoop;
