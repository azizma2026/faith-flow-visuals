
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, RotateCcw, Save, Plus, Minus, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface TasbeehPreset {
  id: string;
  name: string;
  target: number;
  description: string;
}

const presets: TasbeehPreset[] = [
  {
    id: "subhanallah",
    name: "Subhanallah",
    target: 33,
    description: "Glory be to Allah"
  },
  {
    id: "alhamdulillah",
    name: "Alhamdulillah",
    target: 33,
    description: "Praise be to Allah"
  },
  {
    id: "allahuakbar",
    name: "Allahu Akbar",
    target: 34,
    description: "Allah is the Greatest"
  },
  {
    id: "dhikr",
    name: "La ilaha illallah",
    target: 100,
    description: "There is no god but Allah"
  },
  {
    id: "istighfar",
    name: "Astaghfirullah",
    target: 100,
    description: "I seek forgiveness from Allah"
  }
];

const TasbeehModule: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [selectedPreset, setSelectedPreset] = useState<string>("subhanallah");
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedSessions, setSavedSessions] = useState<Array<{ date: string; preset: string; count: number }>>([]);
  const { toast } = useToast();

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('tasbeehSettings');
    if (savedSettings) {
      const { vibration, sound, lastPreset } = JSON.parse(savedSettings);
      setVibrationEnabled(vibration);
      setSoundEnabled(sound);
      if (lastPreset) {
        setSelectedPreset(lastPreset);
        const preset = presets.find(p => p.id === lastPreset);
        if (preset) setTarget(preset.target);
      }
    }

    const saved = localStorage.getItem('tasbeehSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('tasbeehSettings', JSON.stringify({
      vibration: vibrationEnabled,
      sound: soundEnabled,
      lastPreset: selectedPreset
    }));
  }, [vibrationEnabled, soundEnabled, selectedPreset]);

  // Handle preset change
  const handlePresetChange = (preset: TasbeehPreset) => {
    setSelectedPreset(preset.id);
    setTarget(preset.target);
    setCount(0);
    setIsCompleted(false);
  };

  // Increment count
  const increment = () => {
    if (isCompleted) return;
    
    const newCount = count + 1;
    setCount(newCount);
    
    // Provide feedback
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    
    if (soundEnabled) {
      const audio = new Audio('/click.mp3');
      audio.play().catch(error => {
        // Silently fail if audio can't be played
        console.error("Audio error:", error);
      });
    }
    
    // Check if target is reached
    if (newCount >= target) {
      setIsCompleted(true);
      toast({
        title: "Tasbeeh Completed!",
        description: `You have completed ${target} counts of ${presets.find(p => p.id === selectedPreset)?.name}.`,
      });
      
      // Optional: Play completion sound
      if (soundEnabled) {
        const completionAudio = new Audio('/completion.mp3');
        completionAudio.play().catch(error => {
          console.error("Audio error:", error);
        });
      }
    }
  };

  // Decrement count
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
      setIsCompleted(false);
      
      if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  // Reset count
  const reset = () => {
    setCount(0);
    setIsCompleted(false);
    
    toast({
      title: "Counter Reset",
      description: "Your tasbeeh counter has been reset.",
    });
  };

  // Save current session
  const saveSession = () => {
    const newSession = {
      date: new Date().toLocaleString(),
      preset: presets.find(p => p.id === selectedPreset)?.name || "",
      count: count
    };
    
    const updatedSessions = [newSession, ...savedSessions].slice(0, 10); // Keep only last 10 sessions
    setSavedSessions(updatedSessions);
    localStorage.setItem('tasbeehSessions', JSON.stringify(updatedSessions));
    
    toast({
      title: "Session Saved",
      description: "Your tasbeeh session has been saved.",
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
        <div className="bg-islamic-light-green rounded-xl p-3 mr-4">
          <Headphones className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Tasbeeh</h1>
      </div>
      
      <Tabs defaultValue="counter" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="counter">Counter</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="counter">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Select Dhikr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={selectedPreset === preset.id ? "default" : "outline"}
                    className={`justify-start ${selectedPreset === preset.id ? "bg-islamic-green hover:bg-islamic-green/90" : ""}`}
                    onClick={() => handlePresetChange(preset)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-xs opacity-70">{preset.description}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {preset.target}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-islamic-light-green/20 rounded-lg p-6 mb-6 text-center">
            <div className="text-5xl font-bold mb-2 text-islamic-green">{count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Target: {target} | Progress: {Math.floor((count / target) * 100)}%
            </div>
            
            {isCompleted && (
              <Badge className="mt-2 bg-islamic-gold">Completed!</Badge>
            )}
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-islamic-green h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.floor((count / target) * 100))}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button 
              variant="outline" 
              size="lg"
              onClick={decrement}
              className="flex-1"
            >
              <Minus className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="default" 
              size="lg"
              onClick={increment}
              className="flex-1 bg-islamic-green hover:bg-islamic-green/90 text-white"
            >
              <Plus className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={reset}
              className="flex-1"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`${vibrationEnabled ? "border-islamic-green text-islamic-green" : ""}`}
            >
              {vibrationEnabled ? "Vibration ON" : "Vibration OFF"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${soundEnabled ? "border-islamic-green text-islamic-green" : ""}`}
            >
              {soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
              {soundEnabled ? "Sound ON" : "Sound OFF"}
            </Button>
          </div>
          
          <Button 
            variant="default"
            className="w-full mt-6 bg-islamic-gold hover:bg-islamic-gold/90 text-white"
            onClick={saveSession}
            disabled={count === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Session
          </Button>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {savedSessions.length > 0 ? (
                <div className="space-y-4">
                  {savedSessions.map((session, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{session.preset}</div>
                        <div className="text-sm text-gray-500">{session.date}</div>
                      </div>
                      <Badge>{session.count} counts</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No saved sessions yet.</p>
                  <p className="text-sm mt-2">Complete and save a tasbeeh session to see it here.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSavedSessions([]);
                  localStorage.removeItem('tasbeehSessions');
                  toast({
                    title: "History Cleared",
                    description: "Your tasbeeh history has been cleared.",
                  });
                }}
                disabled={savedSessions.length === 0}
              >
                Clear History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TasbeehModule;
