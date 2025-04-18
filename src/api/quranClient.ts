
// Quran API client for fetching Quran text, translations, and related data
import { useQuery } from "@tanstack/react-query";

// Types for Quran API responses
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface Translation {
  id: number;
  name: string;
  languageCode: string;
  translatorName?: string;
  source?: string;
  year?: string;
}

export interface TranslatedAyah {
  number: number;
  text: string;
  translation: string;
  translationSource: string;
  tafsir?: string;
}

// Base URL for Al-Quran Cloud API (offers KFC translation)
const API_BASE_URL = "https://api.alquran.cloud/v1";

// Fetch list of all surahs
export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/surah`);
      if (!response.ok) {
        throw new Error("Failed to fetch surahs");
      }
      const data = await response.json();
      return data.data as Surah[];
    },
  });
};

// Fetch a specific surah with Arabic text
export const useSurahArabic = (surahNumber: number) => {
  return useQuery({
    queryKey: ["surah", "arabic", surahNumber],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch surah ${surahNumber}`);
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!surahNumber,
  });
};

// Fetch a specific surah with King Fahd Complex translation
export const useSurahTranslation = (surahNumber: number, edition = "en.asad") => {
  return useQuery({
    queryKey: ["surah", "translation", surahNumber, edition],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${edition}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch translation for surah ${surahNumber}`);
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!surahNumber,
  });
};

// Get available translations
export const useAvailableTranslations = () => {
  return useQuery({
    queryKey: ["translations"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/edition/type/translation`);
      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }
      const data = await response.json();
      return data.data;
    },
  });
};

// Combine Arabic and translation for a surah
export const useCombinedSurah = (surahNumber: number, translationEdition = "en.asad") => {
  const arabicQuery = useSurahArabic(surahNumber);
  const translationQuery = useSurahTranslation(surahNumber, translationEdition);
  
  const isLoading = arabicQuery.isLoading || translationQuery.isLoading;
  const isError = arabicQuery.isError || translationQuery.isError;
  const error = arabicQuery.error || translationQuery.error;
  
  // Combine the Arabic and translation data
  let combinedData = null;
  if (!isLoading && !isError && arabicQuery.data && translationQuery.data) {
    const arabicAyahs = arabicQuery.data.ayahs;
    const translationAyahs = translationQuery.data.ayahs;
    
    // Get metadata
    const surahInfo = {
      number: arabicQuery.data.number,
      name: arabicQuery.data.name,
      englishName: arabicQuery.data.englishName,
      englishNameTranslation: arabicQuery.data.englishNameTranslation,
      numberOfAyahs: arabicQuery.data.numberOfAyahs,
      translation: {
        source: translationQuery.data.edition.name,
        language: translationQuery.data.edition.language,
        name: translationQuery.data.edition.englishName,
      }
    };
    
    // Combine ayahs
    const combinedAyahs = arabicAyahs.map((ayah, index) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translationAyahs[index]?.text || "",
      translationSource: translationQuery.data.edition.name,
      juz: ayah.juz,
      page: ayah.page,
    }));
    
    combinedData = {
      ...surahInfo,
      ayahs: combinedAyahs,
    };
  }
  
  return {
    data: combinedData,
    isLoading,
    isError,
    error,
  };
};

// Get available tafsirs
export const useAvailableTafsirs = () => {
  return useQuery({
    queryKey: ["tafsirs"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/edition/type/tafsir`);
      if (!response.ok) {
        throw new Error("Failed to fetch tafsirs");
      }
      const data = await response.json();
      return data.data;
    },
  });
};

// Map translation identifiers to their full API identifiers
export const TRANSLATION_MAP = {
  "en_kfc": "en.asad", // Muhammad Asad's translation, widely respected
  "en_sahih": "en.sahih", // Sahih International
  "en_pickthall": "en.pickthall", // Pickthall translation
  "ur_jalandhry": "ur.jalandhry", // Urdu - Jalandhry
  "tr_diyanet": "tr.diyanet", // Turkish - Diyanet
  "fr_hamidullah": "fr.hamidullah", // French - Hamidullah
};

// Map tafsir identifiers to their full API identifiers
export const TAFSIR_MAP = {
  "taqi_usmani": "en.maududi", // English Maududi Tafsir
  "ibn_kathir": "en.ibnkathir", // Ibn Kathir in English
  "jalalayn": "en.jalalayn", // Jalalayn in English
  "maariful": "ur.maududi", // Maariful Quran (Urdu)
};
