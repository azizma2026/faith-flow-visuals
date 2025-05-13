
import { useQuery } from "@tanstack/react-query";

// Types for word-by-word translation data
export interface WordData {
  id: number;
  position: number;
  arabic_text: string;
  transliteration: string;
  translation: string;
  root?: string;
  part_of_speech?: string;
}

export interface AyahWords {
  ayahNumber: number;
  words: WordData[];
}

// Mock database of word-by-word translations for initial verses
// In a production app, this would come from an actual API
const mockWordByWordDatabase: Record<string, AyahWords[]> = {
  "1": [ // Surah Al-Fatiha
    {
      ayahNumber: 1,
      words: [
        {
          id: 1,
          position: 1,
          arabic_text: "بِسْمِ",
          transliteration: "Bismi",
          translation: "In the name",
          part_of_speech: "preposition",
        },
        {
          id: 2,
          position: 2,
          arabic_text: "اللَّهِ",
          transliteration: "Allahi",
          translation: "of Allah",
          part_of_speech: "proper noun",
        },
        {
          id: 3,
          position: 3,
          arabic_text: "الرَّحْمَٰنِ",
          transliteration: "ar-Rahmani",
          translation: "the Most Gracious",
          part_of_speech: "adjective",
        },
        {
          id: 4,
          position: 4,
          arabic_text: "الرَّحِيمِ",
          transliteration: "ar-Rahimi",
          translation: "the Most Merciful",
          part_of_speech: "adjective",
        }
      ]
    },
    {
      ayahNumber: 2,
      words: [
        {
          id: 5,
          position: 1,
          arabic_text: "الْحَمْدُ",
          transliteration: "Al-hamdu",
          translation: "All praise",
          part_of_speech: "noun",
        },
        {
          id: 6,
          position: 2,
          arabic_text: "لِلَّهِ",
          transliteration: "lillahi",
          translation: "is to Allah",
          part_of_speech: "preposition + noun",
        },
        {
          id: 7,
          position: 3,
          arabic_text: "رَبِّ",
          transliteration: "rabbi",
          translation: "Lord",
          part_of_speech: "noun",
        },
        {
          id: 8,
          position: 4,
          arabic_text: "الْعَالَمِينَ",
          transliteration: "al-'alamina",
          translation: "of the worlds",
          part_of_speech: "noun",
        }
      ]
    }
  ],
  "2": [ // First verse of Al-Baqarah
    {
      ayahNumber: 1,
      words: [
        {
          id: 1,
          position: 1,
          arabic_text: "الم",
          transliteration: "Alif-Lam-Mim",
          translation: "Alif Lam Mim",
          part_of_speech: "disjointed letters",
        }
      ]
    }
  ]
};

// Function to fetch word-by-word data for a specific surah and ayah
export const fetchWordByWordData = async (surahNumber: number, ayahNumber: number): Promise<WordData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const surahData = mockWordByWordDatabase[surahNumber.toString()] || [];
      const ayahData = surahData.find(a => a.ayahNumber === ayahNumber);
      resolve(ayahData?.words || []);
    }, 300); // Simulate network delay
  });
};

// React Query hook for fetching word data
export const useWordByWordData = (surahNumber: number, ayahNumber: number) => {
  return useQuery({
    queryKey: ['word-by-word', surahNumber, ayahNumber],
    queryFn: () => fetchWordByWordData(surahNumber, ayahNumber),
    enabled: !!surahNumber && !!ayahNumber,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

// Additional morphological data types
export interface MorphologyDetails {
  root: string;
  form: string;
  pos: string; // part of speech
  gender: string;
  number: string; // singular, dual, plural
  person: string;
  voice: string;
  state: string;
  type: string;
}

// This would be used in a real implementation to fetch detailed morphology
export const fetchMorphologyData = async (wordId: number): Promise<MorphologyDetails | null> => {
  // In a real app, this would be an API call to a morphology service
  return null;
};

// Export for convenience
export const isWordDataAvailable = (surahNumber: number): boolean => {
  return !!mockWordByWordDatabase[surahNumber.toString()];
};
