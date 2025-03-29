import React from 'react';
import AuraPlayer from './AuraPlayer';

const AuraContent = ({ aura }) => {
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
  
  return (
    <div className="mt-6 w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <div className={`p-1 rounded-lg bg-gradient-to-r ${from} ${to}`}>
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-700">
            {aura.message}
          </h2>
          
          {aura.music && (
            <div className="mb-6">
              <AuraPlayer musicFile={aura.music} />
            </div>
          )}
          
          {aura.image && (
            <div className="mb-6 flex justify-center">
              <img 
                src={aura.image} 
                alt={aura.message} 
                className="rounded-lg shadow-md max-h-60 w-auto"
              />
            </div>
          )}
          
          <p className="text-gray-700 whitespace-pre-wrap">
            {aura.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuraContent; 