
import React from "react";
import { Play } from "lucide-react";
import type { Channel } from "../ChannelsModule";

type ChannelsListProps = {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelect: (channel: Channel) => void;
};

const ChannelsList: React.FC<ChannelsListProps> = ({
  channels,
  selectedChannel,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onSelect(channel)}
          className={`flex flex-col bg-white dark:bg-islamic-dark-navy border rounded-xl shadow hover:shadow-lg p-4 transition ring-2 ring-transparent hover:ring-islamic-blue ${
            selectedChannel?.id === channel.id ? "ring-islamic-gold" : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <channel.icon className="h-6 w-6 text-islamic-blue mr-3" />
            <span className="text-lg font-semibold">{channel.name}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {channel.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default ChannelsList;
