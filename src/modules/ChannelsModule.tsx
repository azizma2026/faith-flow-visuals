
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Tv } from "lucide-react";

type Channel = {
  id: string;
  name: string;
  type: "video" | "audio";
  url: string;
  description: string;
  icon: React.ElementType;
};

const ISLAMIC_CHANNELS: Channel[] = [
  {
    id: "makkah-live",
    name: "Makkah Live",
    type: "video",
    // Official Makkah live stream (Saudi TV / YouTube stream, public, widely used)
    url: "https://www.youtube.com/embed/5P2LkqNSSqA?autoplay=1&mute=0",
    description: "24/7 live video from Masjid al-Haram (Makkah).",
    icon: Tv,
  },
  {
    id: "madinah-live",
    name: "Madinah Live",
    type: "video",
    // Official Madinah live stream (Saudi TV / YouTube, public, widely used)
    url: "https://www.youtube.com/embed/1bU2MlG1V1g?autoplay=1&mute=0",
    description: "24/7 live video from Masjid an-Nabawi (Madinah).",
    icon: Tv,
  },
  {
    id: "quran-radio",
    name: "Quran Radio",
    type: "audio",
    // Saudi Quran Radio publicly listed
    url: "https://stream.quran.com.sa:8008/live.mp3",
    description: "Live Quran recitation radio from Saudi Arabia.",
    icon: Radio,
  },
];

const ChannelsModule: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-light-blue rounded-xl p-3 mr-4">
          <Radio className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Islamic Channels</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        {ISLAMIC_CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel)}
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
          <p className="text-sm text-gray-500 mt-2">Makkah and Madinah streams provided by official Saudi TV networks.</p>
        </div>
      )}

      {selectedChannel && (
        <div className="rounded-lg bg-gray-50 dark:bg-islamic-blue/20 p-4 shadow-lg text-center">
          <h2 className="font-bold text-xl mb-3">{selectedChannel.name} Live</h2>
          {selectedChannel.type === "video" ? (
            <div className="aspect-w-16 aspect-h-9 w-full max-w-xl mx-auto mb-3">
              <iframe
                src={selectedChannel.url}
                title={selectedChannel.name}
                className="rounded-lg w-full h-72 sm:h-96"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <audio src={selectedChannel.url} controls autoPlay className="w-full mb-3 rounded" />
          )}
          <button
            className="mt-2 text-sm text-islamic-gold underline"
            onClick={() => setSelectedChannel(null)}
          >
            Choose another channel
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ChannelsModule;
