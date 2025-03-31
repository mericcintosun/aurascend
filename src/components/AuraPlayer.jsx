import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function AuraPlayer({ musicFile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player when music file changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [musicFile]);

  useEffect(() => {
    // Event listeners for audio element
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);
    
    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback successfully started
            setIsPlaying(true);
          })
          .catch(error => {
            // Auto-play was prevented or other error
            console.error("Play error:", error);
            setIsPlaying(false);
          });
      }
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    
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

  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for background styling
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full rounded-lg bg-gradient-to-r from-purple-800 to-violet-900 p-4 text-white shadow-lg transition-all duration-300 relative z-50">
      <div className="flex flex-col w-full">
        <div className="mb-4">
          <h3 className="text-base font-medium text-center mb-2">Auranın Müziği</h3>
          
          {/* Zaman göstergesi */}
          <div className="text-center text-xs opacity-70 mb-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          {/* Oynatma kontrolleri */}
          <div className="flex items-center justify-center space-x-4 mb-3">
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-900 shadow-md hover:bg-gray-100 transition-colors relative z-50"
              aria-label={isPlaying ? "Pause" : "Play"}
              type="button"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-200 transition-colors p-1 relative z-50"
                aria-label={isMuted ? "Unmute" : "Mute"}
                type="button"
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
                className="h-2 w-20 sm:w-24 cursor-pointer appearance-none rounded-lg bg-white bg-opacity-30 relative z-50"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
        
        {/* İlerleme çubuğu */}
        <div className="relative w-full h-3 bg-purple-900 bg-opacity-50 rounded-full cursor-pointer group">
          <div 
            className="absolute top-0 left-0 h-full bg-white bg-opacity-70 rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <input
            ref={progressBarRef}
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto relative z-50"
            aria-label="Progress"
          />
          
          {/* Hover durumunda görünen zaman baloncuğu */}
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none">
            <div 
              className="absolute -top-7 px-2 py-1 rounded bg-purple-800 text-xs text-white transform -translate-x-1/2 relative z-50"
              style={{ left: `${progressPercentage}%` }}
            >
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} preload="metadata">
        <source src={musicFile} type="audio/mp3" />
        Tarayıcınız ses öğesini desteklemiyor.
      </audio>
    </div>
  );
} 