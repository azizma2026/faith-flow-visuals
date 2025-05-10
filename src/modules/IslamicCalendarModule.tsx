
import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getHijriDate } from "@/utils/dateUtils";

// Islamic holidays and events for 2024-2025
const islamicEvents = [
  { 
    date: "2024-04-09", 
    name: "Start of Ramadan", 
    description: "First day of fasting in the month of Ramadan",
    type: "major"
  },
  { 
    date: "2024-04-17", 
    name: "Laylat al-Qadr (estimated)", 
    description: "The Night of Power, commemorating the night when the Quran was first revealed",
    type: "major"
  },
  { 
    date: "2024-05-09", 
    name: "Eid al-Fitr", 
    description: "Festival marking the end of Ramadan",
    type: "major"
  },
  { 
    date: "2024-06-15", 
    name: "Day of Arafah", 
    description: "The holiest day in Islam, observed during Hajj",
    type: "major"
  },
  { 
    date: "2024-06-16", 
    name: "Eid al-Adha", 
    description: "Festival of the Sacrifice",
    type: "major"
  },
  { 
    date: "2024-07-07", 
    name: "Islamic New Year", 
    description: "First day of Muharram, marking the beginning of the Islamic year 1446",
    type: "major"
  },
  { 
    date: "2024-07-16", 
    name: "Day of Ashura", 
    description: "Day of fasting commemorating various significant events in Islamic history",
    type: "medium"
  },
  { 
    date: "2024-09-15", 
    name: "Mawlid al-Nabi", 
    description: "Observance of the birthday of Prophet Muhammad",
    type: "medium"
  },
  { 
    date: "2025-01-07", 
    name: "Laylat al-Mi'raj", 
    description: "Night Journey and Ascension of Prophet Muhammad",
    type: "medium"
  },
  { 
    date: "2025-01-26", 
    name: "15th of Sha'ban", 
    description: "Night of records, when destinies for the coming year are determined",
    type: "medium"
  },
  { 
    date: "2025-03-30", 
    name: "Start of Ramadan", 
    description: "First day of fasting in the month of Ramadan",
    type: "major"
  }
];

interface CalendarDayProps {
  date: Date;
  events: {
    date: string;
    name: string;
    description: string;
    type: "major" | "medium" | "minor";
  }[];
  onSelectDate: (date: Date) => void;
  isSelected: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, events, onSelectDate, isSelected }) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const dayEvents = events.filter(event => event.date === formattedDate);
  const hasEvent = dayEvents.length > 0;
  const isMajorEvent = dayEvents.some(event => event.type === "major");
  
  return (
    <div
      className={cn(
        "h-12 w-12 flex items-center justify-center rounded-full cursor-pointer relative",
        isSelected && "bg-islamic-gold text-white font-bold",
        !isSelected && hasEvent && "border-2 border-islamic-warm-beige",
        !isSelected && !hasEvent && "hover:bg-islamic-light-beige"
      )}
      onClick={() => onSelectDate(date)}
    >
      {format(date, "d")}
      {hasEvent && !isSelected && (
        <span
          className={cn(
            "absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full",
            isMajorEvent ? "bg-islamic-gold" : "bg-islamic-green"
          )}
        />
      )}
    </div>
  );
};

const IslamicCalendarModule: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const hijriDate = getHijriDate();

  // Generate days for the current month view
  const generateMonthDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const days = [];
    
    // Add previous month's days to fill the first week
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push(new Date(currentYear, currentMonth - 1, i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    // Add next month's days to complete the last week
    const daysNeeded = 42 - days.length; // 6 rows * 7 days = 42
    
    for (let i = 1; i <= daysNeeded; i++) {
      days.push(new Date(currentYear, currentMonth + 1, i));
    }
    
    return days;
  };

  const days = generateMonthDays();
  
  const navigateMonth = (direction: number) => {
    const newMonth = currentMonth + direction;
    
    if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return islamicEvents.filter(event => event.date === formattedDate);
  };
  
  const selectedDateEvents = getEventsForSelectedDate();
  
  // Generate weekly view
  const generateWeekView = () => {
    const day = selectedDate.getDay();
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      weekDays.push(currentDay);
    }
    
    return weekDays;
  };
  
  const weekDays = generateWeekView();
  
  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    
    return islamicEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextMonth;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-islamic-light-beige bg-islamic-pattern p-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 rounded-xl border-islamic-warm-beige bg-white/90 shadow-md overflow-hidden mb-8">
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            {/* Calendar side */}
            <div className="w-full md:w-3/5 space-y-6">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-islamic-text-brown">
                    {format(new Date(currentYear, currentMonth), "MMMM yyyy")}
                  </h2>
                  <p className="text-sm text-islamic-text-light-brown">
                    {hijriDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth(-1)}
                    className="h-9 w-9 border-islamic-warm-beige"
                  >
                    <ChevronLeft className="h-4 w-4 text-islamic-text-brown" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth(1)}
                    className="h-9 w-9 border-islamic-warm-beige"
                  >
                    <ChevronRight className="h-4 w-4 text-islamic-text-brown" />
                  </Button>
                </div>
              </div>

              {/* Calendar grid */}
              <div>
                {/* Day labels */}
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "text-center text-sm font-medium py-2",
                        i === 5 ? "text-islamic-green" : "text-islamic-text-light-brown" // Friday special
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {days.map((day, i) => (
                    <CalendarDay
                      key={i}
                      date={day}
                      events={islamicEvents}
                      onSelectDate={handleSelectDate}
                      isSelected={format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")}
                    />
                  ))}
                </div>
              </div>

              {/* Selected date information */}
              <div className="pt-4 border-t border-islamic-warm-beige">
                <h3 className="text-lg font-medium text-islamic-text-brown mb-2">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event, i) => (
                      <div 
                        key={i} 
                        className="p-3 bg-islamic-light-beige rounded-lg border border-islamic-warm-beige"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-islamic-text-brown">{event.name}</h4>
                          <Badge 
                            className={cn(
                              "text-white",
                              event.type === "major" ? "bg-islamic-gold" : 
                              event.type === "medium" ? "bg-islamic-green" : "bg-islamic-blue"
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-islamic-text-light-brown">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-islamic-text-light-brown">No Islamic events on this date.</p>
                )}
              </div>
            </div>
            
            {/* Upcoming events side */}
            <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-islamic-warm-beige pt-6 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-islamic-gold" />
                <h3 className="text-lg font-semibold text-islamic-text-brown">Upcoming Islamic Events</h3>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, i) => (
                    <div 
                      key={i} 
                      className="flex gap-3 p-3 bg-islamic-light-beige rounded-lg border border-islamic-warm-beige"
                    >
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="font-bold text-islamic-text-brown">{new Date(event.date).getDate()}</div>
                        <div className="text-xs text-islamic-text-light-brown">{format(new Date(event.date), "MMM")}</div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-islamic-text-brown">{event.name}</h4>
                        <p className="text-sm text-islamic-text-light-brown">{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-islamic-text-light-brown">No upcoming events in the next 30 days.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Week view */}
        <Card className="p-6 rounded-xl border-islamic-warm-beige bg-white/90 shadow-md overflow-hidden">
          <h3 className="text-lg font-semibold text-islamic-text-brown mb-4">Week at a Glance</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => {
              const formattedDate = format(day, "yyyy-MM-dd");
              const dayEvents = islamicEvents.filter(event => event.date === formattedDate);
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "p-2 rounded-lg text-center min-h-[100px]",
                    format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                      ? "bg-islamic-light-beige border-2 border-islamic-gold"
                      : "bg-islamic-light-beige/50 border border-islamic-warm-beige"
                  )}
                >
                  <div className="font-medium text-islamic-text-brown">
                    {format(day, "EEE")}
                  </div>
                  <div className="text-lg font-bold text-islamic-text-brown mb-1">
                    {format(day, "d")}
                  </div>
                  
                  {dayEvents.length > 0 ? (
                    <div className="mt-2">
                      {dayEvents.map((event, j) => (
                        <div 
                          key={j} 
                          className={cn(
                            "text-xs p-1 rounded mb-1 text-white",
                            event.type === "major" ? "bg-islamic-gold" : 
                            event.type === "medium" ? "bg-islamic-green" : "bg-islamic-blue"
                          )}
                        >
                          {event.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-islamic-text-light-brown mt-2">No events</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IslamicCalendarModule;
