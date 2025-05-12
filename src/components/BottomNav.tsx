
import React from 'react';
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Compass, 
  Heart, 
  Home 
} from 'lucide-react';

const BottomNav: React.FC = () => {
  const { activeModule, setActiveModule } = useNavigationStore();
  
  const navItems = [
    { id: 'home' as ModuleType, icon: Home, label: 'Home' },
    { id: 'quran' as ModuleType, icon: BookOpen, label: 'Quran' },
    { id: 'prayerTimes' as ModuleType, icon: Clock, label: 'Prayer' },
    { id: 'qibla' as ModuleType, icon: Compass, label: 'Qibla' },
    { id: 'tasbeeh' as ModuleType, icon: Heart, label: 'Tasbeeh' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-islamic-dark-navy border-t border-gray-200 dark:border-islamic-dark-navy/50 shadow-lg z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full text-xs ${
              activeModule === item.id 
                ? 'text-islamic-gold' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
            
            {activeModule === item.id && (
              <motion.div 
                className="absolute bottom-0 w-12 h-0.5 bg-islamic-gold rounded-t-md"
                layoutId="bottomNavIndicator"
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;
