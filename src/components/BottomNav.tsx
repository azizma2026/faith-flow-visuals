
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
    { id: 'home' as ModuleType, icon: Home, label: 'الرئيسية' },
    { id: 'quran' as ModuleType, icon: BookOpen, label: 'القرآن' },
    { id: 'prayerTimes' as ModuleType, icon: Clock, label: 'الصلاة' },
    { id: 'qibla' as ModuleType, icon: Compass, label: 'القبلة' },
    { id: 'tasbeeh' as ModuleType, icon: Heart, label: 'الأذكار' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 rounded-t-3xl"
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
                ? 'text-islamic-green' 
                : 'text-gray-600'
            }`}
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="font-arabic">{item.label}</span>
            
            {activeModule === item.id && (
              <motion.div 
                className="absolute bottom-0 w-12 h-0.5 bg-islamic-green rounded-t-md"
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
