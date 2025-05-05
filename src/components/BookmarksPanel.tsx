
import React from "react";
import { Bookmark, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookmarkedAyah } from "@/hooks/useQuranBookmarks";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookmarksPanelProps {
  bookmarks: BookmarkedAyah[];
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (surahNumber: number, ayahNumber: number) => void;
  onClose?: () => void;
}

const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ 
  bookmarks, 
  onSelectBookmark, 
  onRemoveBookmark,
  onClose
}) => {
  const isMobile = useIsMobile();
  
  if (bookmarks.length === 0) {
    return (
      <div className="text-center p-4 flex flex-col items-center justify-center min-h-[200px]">
        <Bookmark className="h-10 w-10 text-muted-foreground mb-2" />
        <p>No bookmarks yet</p>
        <p className="text-sm text-muted-foreground">Bookmarked verses will appear here</p>
        {onClose && (
          <Button variant="outline" className="mt-4" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Bookmark className="mr-2 h-5 w-5" />
          Your Bookmarks
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className={isMobile ? "h-[calc(100vh-300px)]" : "h-[400px]"}>
        <div className="space-y-2">
          {bookmarks
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((bookmark, index) => (
              <Card 
                key={`${bookmark.surahNumber}-${bookmark.ayahNumber}-${index}`} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <div className="font-medium">
                        {bookmark.englishName} ({bookmark.surahNumber}:{bookmark.ayahNumber})
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(bookmark.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(bookmark.surahNumber, bookmark.ayahNumber);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div 
                    className="text-right mb-2 quran-arabic-text" 
                    dir="rtl"
                    onClick={() => onSelectBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                  >
                    {bookmark.text.length > 100 
                      ? bookmark.text.substring(0, 100) + '...' 
                      : bookmark.text}
                  </div>
                  
                  <div 
                    className="text-sm quran-translation-text"
                    onClick={() => onSelectBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                  >
                    {bookmark.translation.length > 120 
                      ? bookmark.translation.substring(0, 120) + '...' 
                      : bookmark.translation}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookmarksPanel;
