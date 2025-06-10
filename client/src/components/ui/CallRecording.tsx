import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';

interface CallRecordingProps {
    recordingUrl: string;
    duration: number;
    callId: string;
}

const CallRecording: React.FC<CallRecordingProps> = ({ recordingUrl, duration, callId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleDownload = () => {
        // Create a temporary link to download the recording
        const link = document.createElement('a');
        link.href = recordingUrl;
        link.download = `call_recording_${callId}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <audio
                ref={audioRef}
                src={recordingUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setCurrentTime(0);
                    }
                }}
            />

            <div className="flex items-center space-x-4">
                <button
                    onClick={handlePlayPause}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>

                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
                            }}
                        />
                        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
                    </div>
                </div>

                <button
                    onClick={handleMute}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>

                <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Download Recording"
                >
                    <Download className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default CallRecording;