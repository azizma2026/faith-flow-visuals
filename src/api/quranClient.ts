
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

export interface Reciter {
  id: string;
  name: string;
  arabicName?: string;
  style?: string;  // Murattal, Mujawwad, etc.
  description?: string;
  apiSource: string; // alquran, everyayah, etc.
  isNew?: boolean;
  hasOfflineContent?: boolean;
}

// Base URL for Al-Quran Cloud API (offers KFC translation)
const API_BASE_URL = "https://api.alquran.cloud/v1";
// Base URL for EveryAyah API (popular for recitations)
const EVERY_AYAH_BASE_URL = "https://everyayah.com/data";
// Base URL for MP3Quran.net
const MP3_QURAN_BASE_URL = "https://server8.mp3quran.net";

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

// Get audio URL for specific surah, ayah and reciter
export const getAudioUrl = (reciterId: string, surahNumber: number, ayahNumber: number): string => {
  // Format numbers with leading zeros
  const surahFormatted = surahNumber.toString().padStart(3, '0');
  const ayahFormatted = ayahNumber.toString().padStart(3, '0');
  
  // Find the reciter in our database
  const reciter = RECITERS_DATABASE.find(r => r.id === reciterId);
  
  if (!reciter) {
    console.error(`Reciter with ID ${reciterId} not found`);
    return '';
  }
  
  // Determine which API to use based on reciter's source
  switch (reciter.apiSource) {
    case 'everyayah':
      // EveryAyah follows the pattern: https://everyayah.com/data/ReciterID/SurahNumberAyahNumber.mp3
      return `${EVERY_AYAH_BASE_URL}/${reciterId}/${surahFormatted}${ayahFormatted}.mp3`;
      
    case 'mp3quran':
      // MP3Quran.net uses a different format:
      // Format is: https://server8.mp3quran.net/reciter_id/surah_number.mp3
      // Note: For MP3Quran, we need to use the surah number without leading zeros and full ayah reference
      const surahWithoutLeadingZeros = surahNumber.toString().padStart(3, '0');
      return `${MP3_QURAN_BASE_URL}/${reciterId}/${surahWithoutLeadingZeros}.mp3`;
      
    case 'alquran':
      // AlQuran.cloud API format
      return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${surahNumber}.mp3`;
      
    default:
      // Default to a commonly working format
      return `https://cdn.islamic.network/quran/audio/${reciterId}/${surahNumber}/${ayahNumber}.mp3`;
  }
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

// Database of famous Quran reciters, particularly from Masjid al-Haram
export const RECITERS_DATABASE: Reciter[] = [
  {
    id: "Abdul_Basit_Mujawwad",
    name: "Abdul Basit Abdul Samad (Mujawwad)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Mujawwad",
    description: "Classic recitation with melodious, measured pace",
    apiSource: "alquran",
    hasOfflineContent: true
  },
  {
    id: "Abdul_Basit_Murattal",
    name: "Abdul Basit Abdul Samad (Murattal)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal",
    description: "Clear recitation at a steady pace",
    apiSource: "alquran",
    hasOfflineContent: true
  },
  {
    id: "Abdurrahmaan_As-Sudais",
    name: "Abdul Rahman Al-Sudais",
    arabicName: "عبدالرحمن السديس",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "alquran",
    hasOfflineContent: true
  },
  {
    id: "Saood_ash-Shuraym",
    name: "Saud Al-Shuraim",
    arabicName: "سعود الشريم",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "alquran",
    hasOfflineContent: true
  },
  {
    id: "Maher_AlMuaiqly",
    name: "Maher Al Muaiqly",
    arabicName: "ماهر المعيقلي",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "alquran",
    hasOfflineContent: true
  },
  {
    id: "mahmoud_khaleel_al-husaree",
    name: "Mishari Rashid Al-Afasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal",
    description: "Renowned Kuwaiti reciter",
    apiSource: "alquran",
    hasOfflineContent: false
  },
  {
    id: "Husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal",
    description: "Classic recitation with strict adherence to tajweed rules",
    apiSource: "alquran",
    hasOfflineContent: false
  },
  {
    id: "yasseraldossari",
    name: "Yasser Ad-Dussary",
    arabicName: "ياسر الدوسري",
    style: "Murattal",
    description: "Emotional recitation style",
    apiSource: "alquran",
    isNew: true,
    hasOfflineContent: false
  },
  {
    id: "Abdullah_Basfar",
    name: "Abdullah Basfar",
    arabicName: "عبد الله بصفر",
    style: "Murattal",
    description: "Professor of Quranic studies",
    apiSource: "alquran",
    hasOfflineContent: false
  },
  {
    id: "bandar_baleela",
    name: "Bandar Baleela",
    arabicName: "بندر بليلة",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "alquran",
    isNew: true,
    hasOfflineContent: false
  },
  {
    id: "fares",
    name: "Fares Abbad",
    arabicName: "فارس عباد",
    style: "Murattal",
    description: "Imam in Madinah, known for his melodious voice",
    apiSource: "alquran",
    isNew: true,
    hasOfflineContent: false
  },
  {
    id: "Abdullah_AlJuhany",
    name: "Abdullah Al-Juhany",
    arabicName: "عبدالله الجهني",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "alquran",
    isNew: true,
    hasOfflineContent: false
  }
];
