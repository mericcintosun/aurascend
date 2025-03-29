import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa';

const AuraPlayer = ({ musicSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!musicSrc) return;
    
    // Müzik değiştiğinde sıfırla
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [musicSrc]);

  const togglePlay = () => {
    if (!audioRef.current || !musicSrc) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  if (!musicSrc) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg shadow-sm w-full max-w-md mx-auto mb-4 border border-purple-200">
      <audio ref={audioRef} src={musicSrc} loop />
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={togglePlay} 
          className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <span className="text-sm font-medium text-purple-800">
          Aura Müziği
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleMute} 
          className="text-purple-700 hover:text-purple-900"
        >
          {getVolumeIcon()}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AuraPlayer; 