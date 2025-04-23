
import React, { useRef, useEffect } from "react";
import type { Channel } from "../ChannelsModule";

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

  useEffect(() => {
    // Reset error state when channel changes
    const iframe = iframeRef.current;
    if (iframe) {
      const handleIframeLoad = () => {
        console.log(`${channel.name} stream loaded successfully`);
      };
      
      iframe.addEventListener('load', handleIframeLoad);
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, [channel]);

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-islamic-blue/20 p-4 shadow-lg text-center">
      <h2 className="font-bold text-xl mb-3">{channel.name} Live</h2>
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

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md p-3 mb-3">
          <p>
            This stream is currently unavailable. Please try the fallback
            source or select another channel.
          </p>
        </div>
      )}
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
