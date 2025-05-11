
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, isToday } from "date-fns";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Define a type for Islamic events
type EventType = "major" | "medium" | "minor";

interface IslamicEvent {
  date: string; // Format: "YYYY-MM-DD"
  name: string;
  description: string;
  type: EventType;
}

// Sample Islamic events for 2024
const islamicEvents: IslamicEvent[] = [
  {
    date: "2024-03-10",
    name: "Start of Ramadan",
    description: "The holy month of fasting begins at Fajr.",
    type: "major"
  },
  {
    date: "2024-04-09",
    name: "Laylat al-Qadr (Night of Power)",
    description: "The night when the Quran was first revealed to Prophet Muhammad (PBUH).",
    type: "major"
  },
  {
    date: "2024-04-10",
    name: "Eid al-Fitr",
    description: "Festival of breaking the fast, marking the end of Ramadan.",
    type: "major"
  },
  {
    date: "2024-06-16",
    name: "Eid al-Adha",
    description: "Festival of sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son.",
    type: "major"
  },
  {
    date: "2024-07-07",
    name: "Islamic New Year",
    description: "The first day of Muharram, marking the beginning of the Islamic year 1446 AH.",
    type: "medium"
  },
  {
    date: "2024-07-16",
    name: "Day of Ashura",
    description: "The tenth day of Muharram, commemorating various significant events in Islamic history.",
    type: "medium"
  },
  {
    date: "2024-09-15",
    name: "Mawlid al-Nabi",
    description: "Birthday of Prophet Muhammad (PBUH).",
    type: "medium"
  },
  {
    date: "2024-02-24",
    name: "Laylat al-Mi'raj",
    description: "The night journey of Prophet Muhammad (PBUH) to Jerusalem and then to heaven.",
    type: "medium"
  },
  {
    date: "2024-02-15",
    name: "Laylat al-Bara'ah",
    description: "Night of Forgiveness, observed on the 15th of Sha'ban.",
    type: "medium"
  },
  {
    date: "2024-03-22",
    name: "First Fast of Ramadan",
    description: "The first day of fasting in the month of Ramadan.",
    type: "medium"
  },
  {
    date: "2024-04-08",
    name: "Last Day of Ramadan",
    description: "The final day of fasting before Eid al-Fitr.",
    type: "medium"
  },
  {
    date: "2024-06-06",
    name: "Day of Arafah",
    description: "The day when pilgrims gather on Mount Arafah during Hajj.",
    type: "medium"
  },
  {
    date: "2024-05-17",
    name: "Friday Prayer",
    description: "Special day for Muslims to gather for congregational prayer.",
    type: "minor"
  },
  {
    date: "2024-05-24",
    name: "Friday Prayer",
    description: "Special day for Muslims to gather for congregational prayer.",
    type: "minor"
  },
  {
    date: "2024-05-31",
    name: "Friday Prayer",
    description: "Special day for Muslims to gather for congregational prayer.",
    type: "minor"
  }
];

// Hijri month names
const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah"
];

// A simple function to convert Gregorian date to approximate Hijri date
// Note: This is a simplified calculation and may be off by 1-2 days
const getApproximateHijriDate = (gregorianDate: Date): { day: number; month: number; year: number } => {
  // This is a very simplified conversion - in a real app, use a proper Hijri calendar library
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth();
  const gregorianDay = gregorianDate.getDate();
  
  // Approximate conversion (this is not accurate but gives a general idea)
  // Real calculation involves lunar cycles and more complex math
  const hijriYear = Math.floor(gregorianYear - 622 + (gregorianMonth > 1 ? 0 : -1));
  const hijriMonth = (gregorianMonth + 1) % 12;
  const hijriDay = ((gregorianDay + 10) % 30) || 30;
  
  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear
  };
};

// Function to check if a date has an Islamic event
const getEventsForDate = (dateString: string): IslamicEvent[] => {
  return islamicEvents.filter(event => event.date === dateString);
};

// Function to get color based on event type
const getEventColor = (eventType: EventType): string => {
  switch(eventType) {
    case "major":
      return "bg-islamic-gold text-white";
    case "medium":
      return "bg-islamic-green text-white";
    case "minor":
      return "bg-islamic-light-blue text-white";
    default:
      return "bg-islamic-light-green text-white";
  }
};

const IslamicCalendarModule: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<IslamicEvent[]>([]);
  const [displayMode, setDisplayMode] = useState<"monthly" | "yearly">("monthly");
  
  const hijriDate = getApproximateHijriDate(date);
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = selectedDate;
      setDate(newDate);
      const formattedSelectedDate = format(newDate, 'yyyy-MM-dd');
      const events = getEventsForDate(formattedSelectedDate);
      setSelectedDateEvents(events);
    }
  };
  
  const nextMonth = () => {
    setCalendarDate(addMonths(calendarDate, 1));
  };
  
  const previousMonth = () => {
    setCalendarDate(subMonths(calendarDate, 1));
  };

  return (
    <div className="min-h-screen bg-islamic-light-beige bg-islamic-pattern p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 border-islamic-warm-beige bg-white/90">
            <CardHeader className="border-b border-islamic-warm-beige bg-gradient-to-r from-islamic-light-beige to-islamic-medium-beige">
              <CardTitle className="text-islamic-text-brown text-2xl flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-islamic-gold" />
                Islamic Calendar
              </CardTitle>
              <CardDescription className="text-islamic-text-light-brown">
                View Islamic dates, events and holidays
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="calendar" className="text-islamic-text-brown">Calendar</TabsTrigger>
                  <TabsTrigger value="events" className="text-islamic-text-brown">Upcoming Events</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-islamic-text-brown">
                        {format(calendarDate, 'MMMM yyyy')}
                      </h2>
                      <p className="text-sm text-islamic-text-light-brown">
                        {hijriMonths[hijriDate.month - 1]} {hijriDate.year} AH
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={previousMonth}
                        className="border-islamic-warm-beige hover:bg-islamic-light-beige text-islamic-text-brown"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextMonth}
                        className="border-islamic-warm-beige hover:bg-islamic-light-beige text-islamic-text-brown"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-islamic-warm-beige overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      month={calendarDate}
                      className="bg-white"
                      classNames={{
                        day_selected: "bg-islamic-gold text-white hover:bg-islamic-gold hover:text-white focus:bg-islamic-gold focus:text-white",
                        day_today: "bg-islamic-light-beige text-islamic-text-brown border border-islamic-warm-beige",
                        day: "hover:bg-islamic-light-beige hover:text-islamic-text-brown focus:bg-islamic-light-beige focus:text-islamic-text-brown"
                      }}
                      components={{
                        day: ({ date, ...props }) => {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          const events = getEventsForDate(formattedDate);
                          const hasEvent = events.length > 0;
                          const eventType = hasEvent ? events[0].type : undefined;
                          const isCurrentDay = isToday(date);
                          
                          return (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={cn(
                                      "relative w-full h-full flex items-center justify-center",
                                      isCurrentDay && "font-bold"
                                    )}
                                    {...props}
                                  >
                                    {hasEvent && (
                                      <div 
                                        className={cn(
                                          "absolute top-0 right-0 w-2 h-2 rounded-full",
                                          eventType === "major" ? "bg-islamic-gold" : 
                                          eventType === "medium" ? "bg-islamic-green" : 
                                          "bg-islamic-light-blue"
                                        )}
                                      ></div>
                                    )}
                                    {date.getDate()}
                                  </div>
                                </TooltipTrigger>
                                {hasEvent && (
                                  <TooltipContent className="p-2 max-w-xs">
                                    <div className="space-y-1">
                                      {events.map((event, index) => (
                                        <div key={index}>
                                          <p className="font-medium">{event.name}</p>
                                          <p className="text-xs">{event.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          );
                        },
                      }}
                    />
                  </div>
                  
                  {selectedDateEvents.length > 0 && (
                    <Card className="border-islamic-warm-beige">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-islamic-text-brown text-lg">
                          Events on {format(date, 'MMMM d, yyyy')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedDateEvents.map((event, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Badge className={getEventColor(event.type)} variant="outline">
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </Badge>
                              <div>
                                <h4 className="font-medium text-islamic-text-brown">{event.name}</h4>
                                <p className="text-sm text-islamic-text-light-brown">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="events" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-islamic-text-brown">Upcoming Islamic Events</h3>
                    <div className="flex items-center text-xs text-islamic-text-light-brown gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-islamic-gold"></span>
                        <span>Major</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-islamic-green"></span>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-islamic-light-blue"></span>
                        <span>Minor</span>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[400px] rounded-md border border-islamic-warm-beige p-4 bg-white">
                    <div className="space-y-4">
                      {islamicEvents
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="flex items-start gap-3 p-3 rounded-lg border border-islamic-warm-beige hover:bg-islamic-light-beige transition-colors"
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-md flex flex-col items-center justify-center",
                              getEventColor(event.type)
                            )}>
                              <span className="text-xs">{format(new Date(event.date), 'MMM')}</span>
                              <span className="text-lg font-bold">{format(new Date(event.date), 'd')}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-islamic-text-brown">{event.name}</h4>
                                <Badge variant="outline" className="text-xs text-islamic-text-light-brown border-islamic-warm-beige">
                                  {format(new Date(event.date), 'yyyy')}
                                </Badge>
                              </div>
                              <p className="text-sm text-islamic-text-light-brown mt-1">{event.description}</p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="border-islamic-warm-beige bg-white/90">
            <CardHeader className="border-b border-islamic-warm-beige bg-gradient-to-r from-islamic-light-beige to-islamic-medium-beige">
              <CardTitle className="text-islamic-text-brown text-xl flex items-center">
                <Info className="w-5 h-5 mr-2 text-islamic-gold" />
                Islamic Calendar Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-islamic-text-brown">
              <div className="space-y-4">
                <p>
                  The Islamic calendar (Hijri calendar) is a lunar calendar consisting of 12 months in a year of 354 or 355 days.
                  It is used to determine Islamic holidays and rituals, such as the annual period of fasting and the proper time for the Hajj.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 text-islamic-gold">Hijri Months</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-islamic-text-light-brown">
                      {hijriMonths.map((month, index) => (
                        <li key={index}>{month}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-islamic-gold">Important Islamic Days</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-islamic-text-light-brown">
                      <li>Ramadan - Month of fasting</li>
                      <li>Eid al-Fitr - Festival of breaking the fast</li>
                      <li>Eid al-Adha - Festival of sacrifice</li>
                      <li>Laylat al-Qadr - Night of Power</li>
                      <li>Islamic New Year - First of Muharram</li>
                      <li>Day of Ashura - 10th of Muharram</li>
                      <li>Mawlid al-Nabi - Birthday of Prophet Muhammad (PBUH)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IslamicCalendarModule;
