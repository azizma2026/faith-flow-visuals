
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface ReadingLog {
  date: string; // ISO date string
  surah: number;
  fromAyah: number;
  toAyah: number;
  completed: boolean;
}

const DailyReadingSchedule: React.FC = () => {
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentProgress, setCurrentProgress] = useState(0);
  const { toast } = useToast();
  
  // Load reading logs from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('quranReadingLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);
  
  // Calculate overall Quran reading progress (simple example - in real app would be more sophisticated)
  useEffect(() => {
    // Total verses in the Quran is 6236
    const totalVerses = 6236;
    const completedVerses = logs
      .filter(log => log.completed)
      .reduce((sum, log) => sum + (log.toAyah - log.fromAyah + 1), 0);
    
    const progress = Math.min(Math.round((completedVerses / totalVerses) * 100), 100);
    setCurrentProgress(progress);
  }, [logs]);
  
  const markAsCompleted = (date: Date, surah: number = 1, fromAyah: number = 1, toAyah: number = 7) => {
    const dateStr = date.toISOString();
    
    // Check if we already have a log for this date
    const existingLogIndex = logs.findIndex(log => log.date.split('T')[0] === dateStr.split('T')[0]);
    
    if (existingLogIndex >= 0) {
      // Update existing log
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex].completed = true;
      setLogs(updatedLogs);
    } else {
      // Create new log
      const newLog: ReadingLog = {
        date: dateStr,
        surah,
        fromAyah,
        toAyah,
        completed: true
      };
      setLogs([...logs, newLog]);
    }
    
    toast({
      title: "Reading completed",
      description: `Surah ${surah}, Ayahs ${fromAyah}-${toAyah} marked as read for ${format(date, 'PPP')}`,
    });
  };
  
  // Save logs whenever they change
  useEffect(() => {
    localStorage.setItem('quranReadingLogs', JSON.stringify(logs));
  }, [logs]);
  
  // Find log for selected date
  const selectedDateLog = logs.find(
    log => new Date(log.date).toDateString() === selectedDate.toDateString()
  );
  
  // Function to determine which dates have logs
  const isDateLogged = (date: Date) => {
    return logs.some(log => new Date(log.date).toDateString() === date.toDateString());
  };
  
  // Function to determine if a date has completed reading
  const isDateCompleted = (date: Date) => {
    const log = logs.find(log => new Date(log.date).toDateString() === date.toDateString());
    return log?.completed || false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Reading Schedule</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{
                  completed: (date) => isDateCompleted(date),
                  logged: (date) => isDateLogged(date) && !isDateCompleted(date),
                }}
                modifiersStyles={{
                  completed: { backgroundColor: "#10b981", color: "white" },
                  logged: { border: "2px solid #10b981" }
                }}
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Overall progress</span>
            <span>{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        {selectedDateLog ? (
          <div className="space-y-2">
            <p>
              <strong>Today's reading:</strong> Surah {selectedDateLog.surah}, 
              Ayahs {selectedDateLog.fromAyah}-{selectedDateLog.toAyah}
            </p>
            {selectedDateLog.completed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </div>
            ) : (
              <Button 
                onClick={() => markAsCompleted(
                  selectedDate, 
                  selectedDateLog.surah,
                  selectedDateLog.fromAyah,
                  selectedDateLog.toAyah
                )}
                size="sm"
              >
                Mark as completed
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p>No reading scheduled for this day.</p>
            <p className="text-sm text-muted-foreground">Suggested: Surah Al-Fatihah (1:1-7)</p>
            <Button 
              onClick={() => markAsCompleted(selectedDate)}
              size="sm"
            >
              Mark as completed
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span>Completed days</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full border-2 border-green-500 mr-2"></div>
            <span>Planned days</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => {/* Navigate to Reading Plan */}}>
          Full Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyReadingSchedule;
