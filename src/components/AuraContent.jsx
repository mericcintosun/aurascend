import React, { useState, useRef, useEffect } from 'react';
import AuraPlayer from './AuraPlayer';

const AuraContent = ({ aura }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Animation on component mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('animate-fadeIn');
    }
  }, [aura]);

  if (!aura) return null;

  // Extract gradient colors from the color string
  const getGradientColors = () => {
    if (!aura.color) return { from: 'from-purple-500', to: 'to-blue-500' };
    
    const parts = aura.color.split(' ');
    const fromPart = parts.find(p => p.startsWith('from-')) || 'from-purple-500';
    const toPart = parts.find(p => p.startsWith('to-')) || 'to-blue-500';
    
    return { from: fromPart, to: toPart };
  };
  
  const { from, to } = getGradientColors();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className="mt-6 w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl opacity-0 transition-all duration-700"
      tabIndex="0"
    >
      <div className={`p-1 rounded-lg bg-gradient-to-r ${from} ${to}`}>
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-700 animate-shimmer">
            {aura.message}
          </h2>
          
          {aura.music && (
            <div className="mb-6">
              <AuraPlayer musicFile={aura.music} />
            </div>
          )}
          
          {aura.image && (
            <div className="mb-6 flex justify-center">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img 
                  ref={imageRef}
                  src={aura.image} 
                  alt={aura.message} 
                  className={`rounded-lg max-h-60 w-auto transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))',
                    aspectRatio: "1/1", 
                    objectFit: "cover"
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${from} ${to} rounded-lg ${imageLoaded ? 'opacity-0' : 'opacity-30 animate-pulse'}`}></div>
              </div>
            </div>
          )}
          
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {aura.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuraContent; 