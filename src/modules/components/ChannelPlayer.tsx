
import React, { useRef, useEffect, useState } from "react";
import type { Channel } from "../ChannelsModule";
import { AlertCircle, CheckCircle } from "lucide-react";

type ChannelPlayerProps = {
  channel: Channel;
  isError: boolean;
  attemptedFallback: boolean;
  onMediaError: () => void;
  onTryFallback: () => void;
  onChooseAnother: () => void;
};

const ChannelPlayer: React.FC<ChannelPlayerProps> = ({
  channel,
  isError,
  attemptedFallback,
  onMediaError,
  onTryFallback,
  onChooseAnother,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [streamStatus, setStreamStatus] = useState<"loading" | "playing" | "error">("loading");

  useEffect(() => {
    // Reset status when channel changes
    setStreamStatus("loading");
    
    const iframe = iframeRef.current;
    const audio = audioRef.current;
    
    if (iframe) {
      const handleIframeLoad = () => {
        console.log(`${channel.name} stream loaded successfully`);
        setStreamStatus("playing");
      };
      
      iframe.addEventListener('load', handleIframeLoad);
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
    
    if (audio) {
      const handleCanPlay = () => {
        console.log(`${channel.name} audio stream is ready to play`);
        setStreamStatus("playing");
      };
      
      const handleError = () => {
        console.error(`${channel.name} audio stream error`);
        setStreamStatus("error");
        onMediaError();
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [channel, onMediaError]);

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-islamic-blue/20 p-4 shadow-lg text-center">
      <h2 className="font-bold text-xl mb-3">{channel.name} Live</h2>
      
      {streamStatus === "playing" && !isError && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md p-2 mb-3 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Stream is playing</span>
        </div>
      )}
      
      {channel.type === "video" ? (
        <div className="aspect-w-16 aspect-h-9 w-full max-w-xl mx-auto mb-3">
          <iframe
            ref={iframeRef}
            src={channel.url}
            title={channel.name}
            className="rounded-lg w-full h-72 sm:h-96"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            onError={onMediaError}
          />
        </div>
      ) : (
        <audio
          ref={audioRef}
          src={channel.url}
          controls
          autoPlay
          className="w-full mb-3 rounded"
          onError={onMediaError}
        />
      )}
      
      {streamStatus === "loading" && !isError && (
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md p-3 mb-3">
          <p>Loading stream, please wait...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md p-3 mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            This stream is currently unavailable. Please try the fallback
            source or select another channel.
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{channel.description}</p>
      
      <div className="flex justify-center space-x-2 mt-2">
        <button
          className="text-sm text-islamic-gold underline"
          onClick={onChooseAnother}
        >
          Choose another channel
        </button>
        {channel.fallbackUrl && channel.url !== channel.fallbackUrl && (
          <button
            className="text-sm text-islamic-blue underline"
            onClick={onTryFallback}
          >
            Try alternative source
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelPlayer;
