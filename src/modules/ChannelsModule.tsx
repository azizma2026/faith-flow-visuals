
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Tv, Volume2, Youtube, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChannelsList from "./components/ChannelsList";
import ChannelPlayer from "./components/ChannelPlayer";

export type Channel = {
  id: string;
  name: string;
  type: "audio" | "video";
  url: string;
  fallbackUrl?: string;
  description: string;
  icon: React.ElementType;
};

export const channels: Channel[] = [
  {
    id: "makkah-live",
    name: "Makkah Live",
    type: "video",
    url: "https://www.youtube.com/embed/4_EGmXaBxmQ?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/_Zjv3KZQjo4?autoplay=1&mute=0",
    description: "24/7 live video from Masjid al-Haram (Makkah).",
    icon: Tv,
  },
  {
    id: "madinah-live",
    name: "Madinah Live",
    type: "video",
    url: "https://www.youtube.com/embed/LWtpDwZ1tgk?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/O1NGU5nKRKc?autoplay=1&mute=0",
    description: "24/7 live video from Masjid an-Nabawi (Madinah).",
    icon: Tv,
  },
  {
    id: "quran-radio",
    name: "Quran Radio",
    type: "audio",
    url: "https://backup.qurango.net/radio/ahmad_khader_altarabulsi",
    fallbackUrl: "https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad",
    description: "24/7 Quran recitation radio.",
    icon: Radio,
  },
  {
    id: "peace-tv",
    name: "Peace TV",
    type: "video",
    url: "https://www.youtube.com/embed/OreAXwJlVPU?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/S9GGlzbtzd0?autoplay=1&mute=0",
    description: "Islamic educational channel.",
    icon: Youtube,
  },
  {
    id: "guide-us-tv",
    name: "Guide Us TV",
    type: "video",
    url: "https://www.youtube.com/embed/Ria7NFzCY3c?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/hx1CRoBrwkY?autoplay=1&mute=0",
    description: "Islamic educational programs and lectures.",
    icon: Youtube,
  },
  {
    id: "islamic-network",
    name: "Islamic Network",
    type: "audio",
    url: "https://server03.quran.com.kw:7369/;",
    fallbackUrl: "https://backup.qurango.net/radio/tarateel",
    description: "Islamic talks and lectures.",
    icon: Volume2,
  },
  {
    id: "iqra-tv",
    name: "Iqra TV",
    type: "video",
    url: "https://www.youtube.com/embed/vLjdma-P-Tk?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/R8Z07X-d8tr?autoplay=1&mute=0", 
    description: "Educational Islamic channel with diverse programming.",
    icon: Globe,
  },
  {
    id: "dua-radio",
    name: "Dua & Dhikr Radio",
    type: "audio",
    url: "https://backup.qurango.net/radio/adkar",
    fallbackUrl: "https://backup.qurango.net/radio/tarateel",
    description: "Continuous streaming of Islamic supplications and remembrance.",
    icon: Volume2,
  }
];

const ChannelsModule: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      setIsLoading(true);
      setIsError(false);
      setAttemptedFallback(false);
      
      // Loading state only for a brief period to allow the stream to initialize
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedChannel]);

  const handleSelectChannel = (channel: Channel) => {
    if (channel.id !== selectedChannel?.id) {
      setSelectedChannel(channel);
    }
  };

  const handleMediaError = () => {
    setIsError(true);
    
    if (!attemptedFallback && selectedChannel?.fallbackUrl) {
      toast({
        title: "Stream Error",
        description: "Attempting to use backup stream source...",
      });
    } else {
      toast({
        title: "Stream Unavailable",
        description: "This stream is currently unavailable. Please try another channel.",
        variant: "destructive",
      });
    }
  };

  const handleTryFallback = () => {
    if (selectedChannel?.fallbackUrl && !attemptedFallback) {
      const updatedChannel = {
        ...selectedChannel,
        url: selectedChannel.fallbackUrl,
      };
      setSelectedChannel(updatedChannel);
      setAttemptedFallback(true);
      setIsError(false);
      
      toast({
        title: "Using Alternative Source",
        description: "Attempting to connect to backup stream...",
      });
    }
  };

  const handleChooseAnother = () => {
    const availableChannels = channels.filter(c => c.id !== selectedChannel?.id);
    if (availableChannels.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableChannels.length);
      setSelectedChannel(availableChannels[randomIndex]);
      
      toast({
        title: "Changed Channel",
        description: `Now playing ${availableChannels[randomIndex].name}`,
      });
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Radio className="mr-2 text-islamic-green" />
        Islamic Channels
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ChannelsList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelect={handleSelectChannel}
          />
        </div>

        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-islamic-blue/20 rounded-lg">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-16 w-16 mb-4"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2.5"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
              </div>
            </div>
          ) : selectedChannel ? (
            <ChannelPlayer
              channel={selectedChannel}
              isError={isError}
              attemptedFallback={attemptedFallback}
              onMediaError={handleMediaError}
              onTryFallback={handleTryFallback}
              onChooseAnother={handleChooseAnother}
            />
          ) : (
            <div className="text-center bg-gray-50 dark:bg-islamic-blue/20 p-6 rounded-lg">
              <p>Please select a channel to begin streaming.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelsModule;
