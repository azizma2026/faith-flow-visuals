import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Tv, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Channel = {
  id: string;
  name: string;
  type: "video" | "audio";
  url: string;
  fallbackUrl?: string;
  description: string;
  icon: React.ElementType;
};

const ISLAMIC_CHANNELS: Channel[] = [
  {
    id: "makkah-live",
    name: "Makkah Live",
    type: "video",
    // Updated to more reliable Makkah live stream
    url: "https://www.youtube.com/embed/Q9nZ8FZ8CFg?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/ew35HA9Pwr8?autoplay=1&mute=0",
    description: "24/7 live video from Masjid al-Haram (Makkah).",
    icon: Tv,
  },
  {
    id: "madinah-live",
    name: "Madinah Live",
    type: "video",
    // Updated to more reliable Madinah live stream
    url: "https://www.youtube.com/embed/hdGn2X8D8K4?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/zFHgBfEvOMg?autoplay=1&mute=0",
    description: "24/7 live video from Masjid an-Nabawi (Madinah).",
    icon: Tv,
  },
  {
    id: "quran-radio",
    name: "Quran Radio",
    type: "audio",
    // Updated to more reliable Quran radio stream
    url: "https://backup.qurango.net/radio/mix",
    fallbackUrl: "https://backup.qurango.net/radio/tarateel",
    description: "Live Quran recitation radio from Saudi Arabia.",
    icon: Radio,
  },
  {
    id: "peace-tv",
    name: "Peace TV",
    type: "video",
    url: "https://www.youtube.com/embed/BuVUd9C6tks?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/g7R3U6wS4Og?autoplay=1&mute=0",
    description: "Islamic educational content and lectures.",
    icon: Tv,
  },
];

const ChannelsModule: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isError, setIsError] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsError(false);
    setAttemptedFallback(false);
    
    // Show toast notification when channel is selected
    toast({
      title: `${channel.name} selected`,
      description: `Loading ${channel.type === "video" ? "stream" : "audio"}...`,
      duration: 2000,
    });
  };

  // Function to check if YouTube iframe is actually loading content
  useEffect(() => {
    const checkYouTubeAvailability = () => {
      if (selectedChannel?.type === "video" && iframeRef.current) {
        // Set a timeout to check if iframe loaded properly
        const timeoutId = setTimeout(() => {
          // If we still have an error state after 5 seconds, iframe likely didn't load
          if (isError && !attemptedFallback && selectedChannel.fallbackUrl) {
            handleTryFallback();
          }
        }, 5000);
        
        return () => clearTimeout(timeoutId);
      }
    };
    
    checkYouTubeAvailability();
  }, [selectedChannel, isError]);
  
  // Handle errors for both audio and video streams
  const handleMediaError = () => {
    setIsError(true);
    
    toast({
      title: "Stream unavailable",
      description: "The selected channel stream is currently unavailable.",
      duration: 5000,
    });
  };
  
  // Try fallback source when available
  const handleTryFallback = () => {
    if (selectedChannel?.fallbackUrl && selectedChannel.url !== selectedChannel.fallbackUrl) {
      toast({
        title: "Trying alternative source",
        description: "Switching to backup stream...",
        duration: 3000,
      });
      
      const updatedChannel = {
        ...selectedChannel,
        url: selectedChannel.fallbackUrl
      };
      
      setSelectedChannel(updatedChannel);
      setIsError(false);
      setAttemptedFallback(true);
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-light-blue rounded-xl p-3 mr-4">
          <Play className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Islamic Channels</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        {ISLAMIC_CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelSelect(channel)}
            className={`flex flex-col bg-white dark:bg-islamic-dark-navy border rounded-xl shadow hover:shadow-lg p-4 transition ring-2 ring-transparent hover:ring-islamic-blue ${
              selectedChannel?.id === channel.id ? "ring-islamic-gold" : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <channel.icon className="h-6 w-6 text-islamic-blue mr-3" />
              <span className="text-lg font-semibold">{channel.name}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{channel.description}</p>
          </button>
        ))}
      </div>

      {!selectedChannel && (
        <div className="text-center my-12 opacity-70">
          <p>Select an Islamic channel to watch or listen to the live broadcast.</p>
          <p className="text-sm text-gray-500 mt-2">Streams update periodically; if one is unavailable, try another channel.</p>
        </div>
      )}

      {selectedChannel && (
        <div className="rounded-lg bg-gray-50 dark:bg-islamic-blue/20 p-4 shadow-lg text-center">
          <h2 className="font-bold text-xl mb-3">{selectedChannel.name} Live</h2>
          {selectedChannel.type === "video" ? (
            <div className="aspect-w-16 aspect-h-9 w-full max-w-xl mx-auto mb-3">
              <iframe
                ref={iframeRef}
                src={selectedChannel.url}
                title={selectedChannel.name}
                className="rounded-lg w-full h-72 sm:h-96"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                onError={handleMediaError}
              />
            </div>
          ) : (
            <audio 
              ref={audioRef}
              src={selectedChannel.url} 
              controls 
              autoPlay 
              className="w-full mb-3 rounded" 
              onError={handleMediaError}
            />
          )}
          
          {isError && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md p-3 mb-3">
              <p>This stream is currently unavailable. Please try the fallback source or select another channel.</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-2 mt-2">
            <button
              className="text-sm text-islamic-gold underline"
              onClick={() => setSelectedChannel(null)}
            >
              Choose another channel
            </button>
            {selectedChannel.fallbackUrl && selectedChannel.url !== selectedChannel.fallbackUrl && (
              <button
                className="text-sm text-islamic-blue underline"
                onClick={handleTryFallback}
              >
                Try alternative source
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChannelsModule;
