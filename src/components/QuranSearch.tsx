
import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface QuranSearchResult {
  surah: number;
  ayah: number;
  text: string;
  translation: string;
  surahName: string;
  englishName: string;
}

interface QuranSearchProps {
  onSelect: (surah: number, ayah: number) => void;
}

const QuranSearch: React.FC<QuranSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuranSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Simple in-memory search function - in a real app, this would use an API
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      // This would be replaced with an API call in a real implementation
      // For now, we'll simulate an API call with setTimeout
      setTimeout(() => {
        // Mock search results based on the query
        // In a real app, this would come from an API
        const mockResults = [
          {
            surah: 2,
            ayah: 255,
            text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
            translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
            surahName: "البقرة",
            englishName: "Al-Baqarah"
          },
          {
            surah: 36,
            ayah: 1,
            text: "يس",
            translation: "Ya, Seen.",
            surahName: "يس",
            englishName: "Ya-Seen"
          }
        ].filter(item => 
          item.text.includes(query) || 
          item.translation.toLowerCase().includes(query.toLowerCase()) ||
          item.englishName.toLowerCase().includes(query.toLowerCase())
        );

        setResults(mockResults);
        
        if (mockResults.length === 0) {
          toast({
            title: "No results found",
            description: "Try a different search term",
          });
        }
        
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Could not complete the search. Try again later.",
      });
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Search the Quran..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isSearching} aria-label="Search">
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      
      {results.length > 0 && (
        <ScrollArea className="h-64 rounded-md border p-4">
          {results.map((result, index) => (
            <Card key={index} className="mb-2 cursor-pointer hover:bg-accent transition-colors" 
                  onClick={() => onSelect(result.surah, result.ayah)}>
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{result.englishName} ({result.surah}:{result.ayah})</span>
                </div>
                <p className="text-right text-lg mb-2" dir="rtl">{result.text}</p>
                <p className="text-sm">{result.translation}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default QuranSearch;
