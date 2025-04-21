
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Tv } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChannelsList from "./components/ChannelsList";
import ChannelPlayer from "./components/ChannelPlayer";
import IconCarousel from "@/components/IconCarousel";

export type Channel = {
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
    url: "https://www.youtube.com/embed/Q9nZ8FZ8CFg?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/ew35HA9Pwr8?autoplay=1&mute=0",
    description: "24/7 live video from Masjid al-Haram (Makkah).",
    icon: Tv,
  },
  {
    id: "madinah-live",
    name: "Madinah Live",
    type: "video",
    url: "https://www.youtube.com/embed/hdGn2X8D8K4?autoplay=1&mute=0",
    fallbackUrl: "https://www.youtube.com/embed/zFHgBfEvOMg?autoplay=1&mute=0",
    description: "24/7 live video from Masjid an-Nabawi (Madinah).",
    icon: Tv,
  },
  {
    id: "quran-radio",
    name: "Quran Radio",
    type: "audio",
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

  // Toast & state reset when changing channels
  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsError(false);
    setAttemptedFallback(false);
    toast({
      title: `${channel.name} selected`,
      description: `Loading ${channel.type === "video" ? "stream" : "audio"}...`,
      duration: 2000,
    });
  };

  // Error handler for both players
  const handleMediaError = () => {
    setIsError(true);
    toast({
      title: "Stream unavailable",
      description: "The selected channel stream is currently unavailable.",
      duration: 5000,
    });
  };

  // Automatic fallback for iframe failures
  useEffect(() => {
    if (
      selectedChannel &&
      selectedChannel.type === "video" &&
      isError &&
      !attemptedFallback &&
      selectedChannel.fallbackUrl
    ) {
      const timer = setTimeout(() => {
        handleTryFallback();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedChannel, isError, attemptedFallback]);

  // Fallback logic
  const handleTryFallback = () => {
    if (
      selectedChannel?.fallbackUrl &&
      selectedChannel.url !== selectedChannel.fallbackUrl
    ) {
      toast({
        title: "Trying alternative source",
        description: "Switching to backup stream...",
        duration: 3000,
      });
      setSelectedChannel({
        ...selectedChannel,
        url: selectedChannel.fallbackUrl,
      });
      setIsError(false);
      setAttemptedFallback(true);
    }
  };

  const handleIconSelect = (index: number) => {
    // This function handles icon selection from the IconCarousel
    toast({
      title: "Feature selected",
      description: "Navigating to Islamic channels",
      duration: 2000,
    });
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
          <Tv className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Islamic Channels</h1>
      </div>

      <IconCarousel className="mb-8" onSelect={handleIconSelect} />

      <ChannelsList
        channels={ISLAMIC_CHANNELS}
        selectedChannel={selectedChannel}
        onSelect={handleChannelSelect}
      />

      {!selectedChannel && (
        <div className="text-center my-12 opacity-70">
          <p>
            Select an Islamic channel to watch or listen to the live broadcast.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Streams update periodically; if one is unavailable, try another
            channel.
          </p>
        </div>
      )}

      {selectedChannel && (
        <ChannelPlayer
          channel={selectedChannel}
          isError={isError}
          attemptedFallback={attemptedFallback}
          onMediaError={handleMediaError}
          onTryFallback={handleTryFallback}
          onChooseAnother={() => setSelectedChannel(null)}
        />
      )}
    </motion.div>
  );
};

export default ChannelsModule;
