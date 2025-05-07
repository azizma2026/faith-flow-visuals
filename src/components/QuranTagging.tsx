
import React, { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Tag {
  id: string;
  text: string;
  color: string;
}

interface QuranTaggingProps {
  surahNumber: number;
  ayahNumber: number;
  onTagsUpdate?: (tags: Tag[]) => void;
}

// Predefined tag colors for users to choose from
const TAG_COLORS = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-purple-100 text-purple-800 border-purple-200",
];

const QuranTagging: React.FC<QuranTaggingProps> = ({ 
  surahNumber, 
  ayahNumber,
  onTagsUpdate 
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagText, setNewTagText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  
  // Load saved tags from localStorage
  useEffect(() => {
    const key = `quranTags_${surahNumber}_${ayahNumber}`;
    const savedTags = localStorage.getItem(key);
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, [surahNumber, ayahNumber]);
  
  // Save tags to localStorage whenever they change
  useEffect(() => {
    if (tags.length > 0) {
      const key = `quranTags_${surahNumber}_${ayahNumber}`;
      localStorage.setItem(key, JSON.stringify(tags));
    }
    
    if (onTagsUpdate) {
      onTagsUpdate(tags);
    }
  }, [tags, surahNumber, ayahNumber, onTagsUpdate]);

  const addTag = () => {
    if (newTagText.trim() === '') return;
    
    // Create new tag with random color from our palette
    const newTag: Tag = {
      id: Date.now().toString(),
      text: newTagText.trim(),
      color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
    };
    
    setTags([...tags, newTag]);
    setNewTagText('');
    setIsAdding(false);
    
    toast({
      title: "Tag added",
      description: `Added "${newTagText}" tag to Surah ${surahNumber}, Ayah ${ayahNumber}`
    });
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="mt-4">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <div 
              key={tag.id} 
              className={`px-2 py-1 rounded-full text-xs flex items-center border ${tag.color}`}
            >
              <span>{tag.text}</span>
              <button 
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {isAdding ? (
        <div className="flex items-center gap-2">
          <Input
            value={newTagText}
            onChange={(e) => setNewTagText(e.target.value)}
            placeholder="Enter tag name..."
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            autoFocus
          />
          <Button size="sm" onClick={addTag}>Add</Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="text-xs"
        >
          <Tag className="h-3 w-3 mr-1" />
          Add Tag
        </Button>
      )}
    </div>
  );
};

export default QuranTagging;
