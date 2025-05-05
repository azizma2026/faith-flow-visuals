
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Type, Contrast } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AccessibilitySettings: React.FC = () => {
  const { 
    highContrastMode, 
    toggleHighContrastMode,
    fontSize,
    setFontSize,
    screenReaderMode,
    toggleScreenReaderMode
  } = useAccessibility();

  const fontSizeValue = typeof fontSize === 'string' ? fontSize : fontSize.toString();

  return (
    <motion.div
      className="p-4 bg-card rounded-lg shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost" 
            className="w-full flex items-center justify-between mb-2 focus:outline-2 focus:outline-islamic-gold"
            aria-label="Toggle accessibility settings"
          >
            <span className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Accessibility Settings
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-5 w-5" />
                <Label htmlFor="high-contrast-mode" className="font-medium">
                  High Contrast Mode
                </Label>
              </div>
              <Switch
                id="high-contrast-mode"
                checked={highContrastMode}
                onCheckedChange={toggleHighContrastMode}
                aria-label="Toggle high contrast mode"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <Label className="font-medium">Font Size</Label>
              </div>
              <RadioGroup 
                value={fontSizeValue}
                onValueChange={(value) => setFontSize(value as 'normal' | 'large' | 'x-large')}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="normal" 
                    id="normal" 
                    aria-label="Normal font size"
                  />
                  <Label htmlFor="normal" className="text-size-normal">Normal Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="large" 
                    id="large"
                    aria-label="Large font size" 
                  />
                  <Label htmlFor="large" className="text-size-large">Large Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="x-large" 
                    id="x-large"
                    aria-label="Extra large font size" 
                  />
                  <Label htmlFor="x-large" className="text-size-x-large">Extra Large Text</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <Label htmlFor="screen-reader-mode" className="font-medium">
                  Screen Reader Optimized
                </Label>
              </div>
              <Switch
                id="screen-reader-mode"
                checked={screenReaderMode}
                onCheckedChange={toggleScreenReaderMode}
                aria-label="Toggle screen reader optimization"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default AccessibilitySettings;
