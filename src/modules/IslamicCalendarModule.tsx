
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

// Helper function to convert Gregorian to Hijri date
const convertToHijri = (date: Date) => {
  // This is a simplified conversion - in a real app, use a proper hijri date library
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // This is just a placeholder algorithm - not accurate
  const estimatedHijriYear = Math.floor((year - 622) * (33/32));
  const estimatedHijriMonth = (month + 1) % 12; // Just an example
  const estimatedHijriDay = ((day + 15) % 30) + 1; // Just an example
  
  const hijriMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", 
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];
  
  return {
    day: estimatedHijriDay,
    month: estimatedHijriMonth,
    monthName: hijriMonths[estimatedHijriMonth],
    year: estimatedHijriYear
  };
};

// Islamic events data
const islamicEvents = [
  {
    name: "Ramadan Start",
    gregorianDate: new Date(2024, 2, 11), // March 11, 2024
    hijriDate: "1 Ramadan 1445",
    description: "The holy month of fasting begins",
    importance: "major"
  },
  {
    name: "Laylat al-Qadr",
    gregorianDate: new Date(2024, 2, 27), // March 27, 2024
    hijriDate: "27 Ramadan 1445",
    description: "The Night of Power",
    importance: "major"
  },
  {
    name: "Eid al-Fitr",
    gregorianDate: new Date(2024, 3, 10), // April 10, 2024
    hijriDate: "1 Shawwal 1445",
    description: "Festival of Breaking the Fast",
    importance: "major"
  },
  {
    name: "Day of Arafah",
    gregorianDate: new Date(2024, 5, 15), // June 15, 2024
    hijriDate: "9 Dhu al-Hijjah 1445",
    description: "The day of standing on Mount Arafah during Hajj",
    importance: "major"
  },
  {
    name: "Eid al-Adha",
    gregorianDate: new Date(2024, 5, 16), // June 16, 2024
    hijriDate: "10 Dhu al-Hijjah 1445",
    description: "Festival of Sacrifice",
    importance: "major"
  },
  {
    name: "Islamic New Year",
    gregorianDate: new Date(2024, 6, 7), // July 7, 2024
    hijriDate: "1 Muharram 1446",
    description: "Beginning of Islamic Year 1446",
    importance: "major"
  },
  {
    name: "Ashura",
    gregorianDate: new Date(2024, 6, 16), // July 16, 2024
    hijriDate: "10 Muharram 1446",
    description: "Day of fasting, commemorates various events",
    importance: "major"
  },
  {
    name: "Mawlid al-Nabi",
    gregorianDate: new Date(2024, 8, 15), // September 15, 2024
    hijriDate: "12 Rabi' al-Awwal 1446",
    description: "Birth of Prophet Muhammad ﷺ",
    importance: "major"
  },
  {
    name: "Shab e-Barat",
    gregorianDate: new Date(2024, 1, 25), // February 25, 2024
    hijriDate: "15 Sha'ban 1445",
    description: "Night of Fortune and Forgiveness",
    importance: "minor"
  },
  {
    name: "Isra and Mi'raj",
    gregorianDate: new Date(2024, 0, 15), // January 15, 2024
    hijriDate: "27 Rajab 1445",
    description: "Night Journey and Ascension of Prophet Muhammad ﷺ",
    importance: "minor"
  }
];

type CalendarViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: typeof islamicEvents;
};

// Component for Gregorian Calendar View
const GregorianCalendarView: React.FC<CalendarViewProps> = ({ 
  selectedDate, 
  setSelectedDate,
  events 
}) => {
  // Function to check if a date has an event
  const dateHasEvent = (date: Date) => {
    return events.some(event => 
      event.gregorianDate.getDate() === date.getDate() &&
      event.gregorianDate.getMonth() === date.getMonth() &&
      event.gregorianDate.getFullYear() === date.getFullYear()
    );
  };

  // Function to get event for a specific date
  const getEventForDate = (date: Date) => {
    return events.find(event => 
      event.gregorianDate.getDate() === date.getDate() &&
      event.gregorianDate.getMonth() === date.getMonth() &&
      event.gregorianDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
        components={{
          Day: ({ date, ...props }) => {
            const isSelected = 
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
              
            const hasEvent = dateHasEvent(date);
            const event = hasEvent ? getEventForDate(date) : null;
            
            return (
              <div
                {...props}
                className={cn(
                  props.className,
                  "relative",
                  isSelected && "bg-islamic-green text-white hover:bg-islamic-green hover:text-white",
                  hasEvent && !isSelected && "bg-islamic-gold/20 font-semibold"
                )}
              >
                {format(date, "d")}
                {hasEvent && (
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      event?.importance === "major" ? "bg-islamic-green" : "bg-islamic-gold"
                    }`}
                  />
                )}
              </div>
            );
          }
        }}
      />
      {/* Event details for selected date */}
      <EventDetails selectedDate={selectedDate} events={events} />
    </div>
  );
};

// Component for Hijri Calendar View
const HijriCalendarView: React.FC<CalendarViewProps> = ({ 
  selectedDate, 
  setSelectedDate,
  events 
}) => {
  const hijriDate = convertToHijri(selectedDate);
  
  // Navigate through hijri months
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 bg-islamic-light-beige rounded-lg">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousMonth}
          className="flex items-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <h3 className="font-semibold">{hijriDate.monthName} {hijriDate.year}</h3>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, "MMMM yyyy")} (Gregorian)
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextMonth}
          className="flex items-center"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Simplified Hijri calendar view */}
      <div className="grid grid-cols-7 text-center gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2 font-medium text-sm bg-islamic-light-beige rounded">
            {day}
          </div>
        ))}
        {/* Generate month days */}
        {Array.from({ length: 30 }, (_, i) => {
          const dayNumber = i + 1;
          const isSelectedDay = dayNumber === hijriDate.day;
          
          // Check for events on this day
          const hasEvent = events.some(event => 
            event.hijriDate.includes(`${dayNumber} ${hijriDate.monthName}`)
          );
          
          return (
            <div 
              key={`hijri-day-${i}`} 
              className={cn(
                "p-3 rounded-md cursor-pointer transition-all",
                isSelectedDay ? "bg-islamic-green text-white" : "hover:bg-islamic-light-beige",
                hasEvent && !isSelectedDay && "bg-islamic-gold/20 font-semibold"
              )}
              onClick={() => {
                // This is simplified - in reality, you'd need proper hijri-to-gregorian conversion
                const newDate = new Date(selectedDate);
                newDate.setDate(dayNumber);
                setSelectedDate(newDate);
              }}
            >
              {dayNumber}
              {hasEvent && (
                <div className="w-1.5 h-1.5 bg-islamic-gold rounded-full mx-auto mt-1" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Event details for selected date */}
      <EventDetails selectedDate={selectedDate} events={events} />
    </div>
  );
};

// Component for displaying event details
const EventDetails: React.FC<{ selectedDate: Date, events: typeof islamicEvents }> = ({ 
  selectedDate, 
  events 
}) => {
  // Get events for the selected date
  const eventsForDate = events.filter(event => 
    event.gregorianDate.getDate() === selectedDate.getDate() &&
    event.gregorianDate.getMonth() === selectedDate.getMonth() &&
    event.gregorianDate.getFullYear() === selectedDate.getFullYear()
  );
  
  if (eventsForDate.length === 0) {
    const hijriDate = convertToHijri(selectedDate);
    
    return (
      <div className="p-4 bg-islamic-light-beige bg-opacity-40 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
            <p className="text-sm text-muted-foreground">
              {hijriDate.day} {hijriDate.monthName} {hijriDate.year} (Hijri)
            </p>
          </div>
          <div className="flex space-x-2">
            <Sun className="h-5 w-5 text-islamic-gold" />
            <Moon className="h-5 w-5 text-islamic-dark-navy" />
          </div>
        </div>
        <p className="mt-3 text-sm">No Islamic events on this date</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {eventsForDate.map((event, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            event.importance === "major" 
              ? "bg-islamic-green/10 border-islamic-green" 
              : "bg-islamic-gold/10 border-islamic-gold"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className={`h-5 w-5 ${
                event.importance === "major" ? "text-islamic-green" : "text-islamic-gold"
              } mr-2`} />
              <h3 className="font-semibold">{event.name}</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              {event.hijriDate}
            </div>
          </div>
          <p className="mt-2 text-sm">{event.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

const IslamicCalendarModule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarType, setCalendarType] = useState<"gregorian" | "hijri">("gregorian");
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(true);
  
  // Get upcoming events (next 30 days)
  const upcomingEvents = islamicEvents
    .filter(event => {
      const today = new Date();
      const eventDate = new Date(event.gregorianDate);
      const differenceInDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return differenceInDays >= 0 && differenceInDays <= 30;
    })
    .sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime());

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex items-center mb-6">
        <div className="bg-islamic-green rounded-xl p-3 mr-4">
          <CalendarIcon className="h-8 w-8 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold">Islamic Calendar</h1>
          <p className="text-sm text-gray-500">
            Track Islamic dates and important events
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Tabs 
                value={calendarType} 
                onValueChange={(value) => setCalendarType(value as "gregorian" | "hijri")}
                className="mb-4"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                  <TabsTrigger value="hijri">Hijri</TabsTrigger>
                </TabsList>

                <TabsContent value="gregorian">
                  <GregorianCalendarView 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                    events={islamicEvents}
                  />
                </TabsContent>

                <TabsContent value="hijri">
                  <HijriCalendarView 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                    events={islamicEvents}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Upcoming Events</h3>
              </div>
              
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground p-6">
                  No upcoming Islamic events in the next 30 days
                </p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {upcomingEvents.map((event, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        event.importance === "major" 
                          ? "border-islamic-green/30 bg-islamic-green/5" 
                          : "border-islamic-gold/30 bg-islamic-gold/5"
                      }`}
                      onClick={() => setSelectedDate(new Date(event.gregorianDate))}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-islamic-light-beige">
                          {format(event.gregorianDate, "MMM d")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.hijriDate}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IslamicCalendarModule;
