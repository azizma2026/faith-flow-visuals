
import { useState, useEffect } from "react";

// Define type for bookmarked Ayahs
export type BookmarkedAyah = {
  surahNumber: number;
  surahName: string;
  englishName: string;
  ayahNumber: number;
  text: string;
  translation: string;
  timestamp: number;
};

export const useQuranBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quran-bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error("Failed to parse bookmarks:", error);
        localStorage.removeItem("quran-bookmarks");
      }
    }
  }, []);

  // Add a bookmark
  const addBookmark = (bookmark: Omit<BookmarkedAyah, "timestamp">) => {
    const newBookmark = { ...bookmark, timestamp: Date.now() };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem("quran-bookmarks", JSON.stringify(updatedBookmarks));
    return true;
  };

  // Remove a bookmark
  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    const updatedBookmarks = bookmarks.filter(
      (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
    );
    setBookmarks(updatedBookmarks);
    localStorage.setItem("quran-bookmarks", JSON.stringify(updatedBookmarks));
  };

  // Check if an ayah is bookmarked
  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};

export default useQuranBookmarks;
