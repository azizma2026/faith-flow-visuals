
import React from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface TafsirProps {
  surahNumber: number;
  ayahNumber: number;
  tafsirSource: string;
  isLoading?: boolean;
}

const QuranTafsir: React.FC<TafsirProps> = ({ 
  surahNumber, 
  ayahNumber, 
  tafsirSource, 
  isLoading = false 
}) => {
  // In a real app, you would fetch tafsir data from an API
  // For now, we'll simulate loading and show mock data
  const tafsirText = `This is a sample tafsir explanation for Surah ${surahNumber}, Ayah ${ayahNumber} 
  from ${tafsirSource}. In a complete implementation, this would contain the actual 
  scholarly explanation of the verse, its context, and deeper meanings according to 
  Islamic scholars. The tafsir would vary based on the source selected by the user.`;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Tafsir: {tafsirSource}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-islamic-green" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-4">
              <p className="text-sm">{tafsirText}</p>
              <p className="text-xs text-muted-foreground">
                Source: {tafsirSource} - Surah {surahNumber}, Ayah {ayahNumber}
              </p>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default QuranTafsir;
