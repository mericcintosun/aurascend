import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const AuraPlayer = ({ musicFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player when music file changes
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [musicFile]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    // If volume is set to 0, mute the audio
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      // If volume is increased and audio was muted, unmute it
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  return (
    <div className="w-full rounded-lg bg-gradient-to-r from-purple-800 to-violet-900 p-3 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={togglePlay}
            className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-900 shadow-md hover:bg-gray-100"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div>
            <p className="text-sm font-medium">Auranın Müziği</p>
            <p className="text-xs opacity-70">10 saniye</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={toggleMute}
            className="mr-2 text-white hover:text-gray-200"
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="h-2 w-20 cursor-pointer appearance-none rounded-lg bg-white bg-opacity-30"
          />
        </div>
      </div>
      
      <audio ref={audioRef} preload="metadata">
        <source src={musicFile} type="audio/mp3" />
        Tarayıcınız ses öğesini desteklemiyor.
      </audio>
    </div>
  );
};

export default AuraPlayer; 