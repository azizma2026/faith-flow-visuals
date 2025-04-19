
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Book, Clock, Compass, BookOpen, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface IconCarouselProps {
  onSelect?: (index: number) => void;
  className?: string;
}

const ICONS = [
  { icon: Book, label: "Quran", color: "bg-islamic-green" },
  { icon: Clock, label: "Prayer Times", color: "bg-islamic-blue" },
  { icon: Compass, label: "Qibla", color: "bg-islamic-light-green" },
  { icon: BookOpen, label: "Hadith", color: "bg-islamic-light-blue" },
  { icon: Calendar, label: "Calendar", color: "bg-islamic-green" },
  { icon: Bell, label: "Notifications", color: "bg-islamic-blue" },
];

const IconCarousel: React.FC<IconCarouselProps> = ({ onSelect, className }) => {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className={cn("w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto px-4", className)}
    >
      <CarouselContent>
        {ICONS.map((item, index) => (
          <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect?.(index)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className={cn("rounded-full p-4", item.color)}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-islamic-dark-navy dark:text-white">
                {item.label}
              </span>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default IconCarousel;
