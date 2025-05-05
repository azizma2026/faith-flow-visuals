import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  BellOff, 
  Type,
  Globe,
  Wifi,
  WifiOff,
  CloudDownload,
  CloudOff
} from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/utils/languageUtils";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";

const SettingsModule: React.FC = () => {
  const { 
    highContrastMode, 
    toggleHighContrastMode, 
    fontSize, 
    setFontSize, 
    screenReaderMode,
    toggleScreenReaderMode 
  } = useAccessibility();
  
  const { currentLanguage, setLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    localStorage.getItem('notificationsEnabled') === 'true'
  );
  const [prayerNotifications, setPrayerNotifications] = useState<boolean>(
    localStorage.getItem('prayerNotifications') === 'true'
  );
  const [dailyVerseNotifications, setDailyVerseNotifications] = useState<boolean>(
    localStorage.getItem('dailyVerseNotifications') === 'true'
  );
  
  // Theme settings
  const [darkMode, setDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  const [selectedTheme, setSelectedTheme] = useState<string>(
    localStorage.getItem('selectedTheme') || 'default'
  );
  
  // Offline mode settings
  const [offlineMode, setOfflineMode] = useState<boolean>(
    localStorage.getItem('offlineMode') === 'true'
  );
  const [offlineContent, setOfflineContent] = useState<string[]>(
    JSON.parse(localStorage.getItem('offlineContent') || '[]')
  );

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    localStorage.setItem('prayerNotifications', prayerNotifications.toString());
    localStorage.setItem('dailyVerseNotifications', dailyVerseNotifications.toString());
  }, [notificationsEnabled, prayerNotifications, dailyVerseNotifications]);
  
  // Save theme settings to localStorage
  useEffect(() => {
    localStorage.setItem('selectedTheme', selectedTheme);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, selectedTheme]);
  
  // Save offline settings to localStorage
  useEffect(() => {
    localStorage.setItem('offlineMode', offlineMode.toString());
    localStorage.setItem('offlineContent', JSON.stringify(offlineContent));
  }, [offlineMode, offlineContent]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    toast({
      title: "Theme Changed",
      description: `Applied the ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`,
    });
  };
  
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    if (!newState) {
      setPrayerNotifications(false);
      setDailyVerseNotifications(false);
    }
  };
  
  const handleOfflineModeToggle = () => {
    const newState = !offlineMode;
    setOfflineMode(newState);
    toast({
      title: newState ? "Offline Mode Enabled" : "Offline Mode Disabled",
      description: newState 
        ? "Content will be cached for offline use" 
        : "Content will be fetched from the server",
    });
  };
  
  const toggleOfflineContent = (content: string) => {
    if (offlineContent.includes(content)) {
      setOfflineContent(offlineContent.filter(item => item !== content));
    } else {
      setOfflineContent([...offlineContent, content]);
      toast({
        title: "Content Will Be Available Offline",
        description: `${content} will be cached for offline use`,
      });
    }
  };
  
  const downloadAllContent = () => {
    setOfflineContent(['quran', 'prayerTimes', 'duas', 'hadith']);
    setOfflineMode(true);
    toast({
      title: "Downloading Content",
      description: "All content will be available offline",
    });
  };

  return (
    <motion.div 
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-light-blue rounded-xl p-3 mr-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="dark-mode">{darkMode ? "Dark Mode" : "Light Mode"}</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label className="mb-3 block">Theme Style</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Card 
                    className={`cursor-pointer border-2 ${selectedTheme === 'default' ? 'border-islamic-gold' : 'border-transparent'}`}
                    onClick={() => handleThemeChange('default')}
                  >
                    <CardContent className="p-4 flex justify-center items-center">
                      <div className="h-20 w-20 bg-gradient-to-br from-islamic-green to-islamic-light-green rounded-lg"></div>
                    </CardContent>
                    <CardFooter className="text-center pt-0">Default</CardFooter>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 ${selectedTheme === 'gold' ? 'border-islamic-gold' : 'border-transparent'}`}
                    onClick={() => handleThemeChange('gold')}
                  >
                    <CardContent className="p-4 flex justify-center items-center">
                      <div className="h-20 w-20 bg-gradient-to-br from-islamic-gold to-yellow-500 rounded-lg"></div>
                    </CardContent>
                    <CardFooter className="text-center pt-0">Gold</CardFooter>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 ${selectedTheme === 'blue' ? 'border-islamic-gold' : 'border-transparent'}`}
                    onClick={() => handleThemeChange('blue')}
                  >
                    <CardContent className="p-4 flex justify-center items-center">
                      <div className="h-20 w-20 bg-gradient-to-br from-islamic-blue to-blue-400 rounded-lg"></div>
                    </CardContent>
                    <CardFooter className="text-center pt-0">Ocean</CardFooter>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 ${selectedTheme === 'purple' ? 'border-islamic-gold' : 'border-transparent'}`}
                    onClick={() => handleThemeChange('purple')}
                  >
                    <CardContent className="p-4 flex justify-center items-center">
                      <div className="h-20 w-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg"></div>
                    </CardContent>
                    <CardFooter className="text-center pt-0">Royal</CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Settings</CardTitle>
              <CardDescription>
                Customize the app to fit your accessibility needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <Label htmlFor="font-size">Font Size</Label>
                </div>
                <ToggleGroup 
                  type="single" 
                  value={typeof fontSize === 'string' ? fontSize : fontSize.toString()}
                  onValueChange={(value) => {
                    if (value) setFontSize(value as any);
                  }}
                  className="justify-end"
                >
                  <ToggleGroupItem value="normal">A</ToggleGroupItem>
                  <ToggleGroupItem value="large">A+</ToggleGroupItem>
                  <ToggleGroupItem value="x-large">A++</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <Switch
                  id="high-contrast"
                  checked={highContrastMode}
                  onCheckedChange={toggleHighContrastMode}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Screen Reader Mode</Label>
                <Switch
                  id="screen-reader"
                  checked={screenReaderMode}
                  onCheckedChange={toggleScreenReaderMode}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label className="mb-3 block">Preferred Language</Label>
                <RadioGroup 
                  value={currentLanguage.code}
                  onValueChange={(value) => {
                    const selectedLanguage = languages.find(lang => lang.code === value);
                    if (selectedLanguage) {
                      setLanguage(selectedLanguage);
                    }
                  }}
                >
                  {languages.map((lang) => (
                    <div key={lang.code} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                      <Label htmlFor={`lang-${lang.code}`}>{lang.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                  <Label htmlFor="notifications">Notifications</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                />
              </div>
              
              {notificationsEnabled && (
                <>
                  <Separator />
                  
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prayer-notifications">Prayer Time Reminders</Label>
                      <Switch
                        id="prayer-notifications"
                        checked={prayerNotifications}
                        onCheckedChange={setPrayerNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="verse-notifications">Daily Verse Notifications</Label>
                      <Switch
                        id="verse-notifications"
                        checked={dailyVerseNotifications}
                        onCheckedChange={setDailyVerseNotifications}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offline Access</CardTitle>
              <CardDescription>
                Manage content for offline use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {offlineMode ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                  <Label htmlFor="offline-mode">Offline Mode</Label>
                </div>
                <Switch
                  id="offline-mode"
                  checked={offlineMode}
                  onCheckedChange={handleOfflineModeToggle}
                />
              </div>
              
              {offlineMode && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <Label className="block mb-2">Content Available Offline</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button 
                        variant={offlineContent.includes('quran') ? "default" : "outline"}
                        onClick={() => toggleOfflineContent('quran')}
                        className="justify-start"
                      >
                        <CloudDownload className="mr-2 h-4 w-4" />
                        Quran Text
                      </Button>
                      
                      <Button 
                        variant={offlineContent.includes('prayerTimes') ? "default" : "outline"}
                        onClick={() => toggleOfflineContent('prayerTimes')}
                        className="justify-start"
                      >
                        <CloudDownload className="mr-2 h-4 w-4" />
                        Prayer Times
                      </Button>
                      
                      <Button 
                        variant={offlineContent.includes('duas') ? "default" : "outline"}
                        onClick={() => toggleOfflineContent('duas')}
                        className="justify-start"
                      >
                        <CloudDownload className="mr-2 h-4 w-4" />
                        Duas Collection
                      </Button>
                      
                      <Button 
                        variant={offlineContent.includes('hadith') ? "default" : "outline"}
                        onClick={() => toggleOfflineContent('hadith')}
                        className="justify-start"
                      >
                        <CloudDownload className="mr-2 h-4 w-4" />
                        Hadith Collection
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={downloadAllContent}
                      className="w-full mt-4"
                    >
                      <CloudDownload className="mr-2 h-4 w-4" />
                      Download All Content
                    </Button>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Content will be stored on your device for offline access. 
                      This may use additional storage space.
                    </p>
                  </div>
                </>
              )}
              
              {!offlineMode && (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <CloudOff className="h-12 w-12 mb-4 opacity-50" />
                  <p>Enable offline mode to download content for offline access</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsModule;
