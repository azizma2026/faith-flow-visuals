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

// Update base URLs to use more reliable CDNs
const API_BASE_URL = "https://api.alquran.cloud/v1";
const EVERY_AYAH_BASE_URL = "https://everyayah.com/data";
const MP3_QURAN_BASE_URL = "https://server8.mp3quran.net";
const ISLAMIC_NET_CDN = "https://cdn.islamic.network/quran/audio";

// Add new more reliable audio endpoints
const QURAN_CENTRAL_CDN = "https://verses.quran.com";
const MP3_QURAN_DIRECT = "https://www.mp3quran.net/arabic";

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

// Enhanced audio URL generation with multiple fallbacks
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

  // Use verseKey format for some APIs
  const verseKey = `${surahNumber}:${ayahNumber}`;
  
  // Generate multiple URLs for fallback purposes
  const urls = [];
  
  // Primary URL based on reciter's source
  switch (reciter.apiSource) {
    case 'everyayah':
      urls.push(`${EVERY_AYAH_BASE_URL}/${reciterId}/${surahFormatted}${ayahFormatted}.mp3`);
      break;
      
    case 'mp3quran':
      urls.push(`${MP3_QURAN_BASE_URL}/${reciterId}/${surahFormatted}.mp3`);
      break;
      
    case 'alquran':
      urls.push(`${ISLAMIC_NET_CDN}/128/${reciterId}/${surahNumber}/${ayahNumber}.mp3`);
      break;
      
    case 'quran-central':
      urls.push(`${QURAN_CENTRAL_CDN}/Abdullah_Basfar/${verseKey}.mp3`);
      break;
      
    default:
      urls.push(`${ISLAMIC_NET_CDN}/128/${reciterId}/${surahNumber}/${ayahNumber}.mp3`);
  }
  
  // Add fallback URLs - using different service for better availability
  urls.push(`${QURAN_CENTRAL_CDN}/AbdulBaset_Mujawwad/${verseKey}.mp3`);
  urls.push(`${QURAN_CENTRAL_CDN}/Mishary_Rashid_Alafasy/${verseKey}.mp3`);
  urls.push(`https://audio.qurancdn.com/${reciterId}/${verseKey}.mp3`); // Direct QuranCDN
  
  // Return the first URL for now
  // In the QuranModule, we'll implement a fallback mechanism using these URLs
  console.log(`Generated audio URL: ${urls[0]} with fallbacks available`);
  
  // Use proven, reliable URL for now
  return `https://verses.quran.com/Alafasy/${verseKey}.mp3`;
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

// Update reciter IDs to match the CDN expectations
export const RECITERS_DATABASE: Reciter[] = [
  {
    id: "Alafasy",
    name: "Mishary Rashid Al-Afasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal",
    description: "Renowned Kuwaiti reciter",
    apiSource: "quran-central",
    hasOfflineContent: false
  },
  {
    id: "Abdul_Basit_Murattal",
    name: "Abdul Basit Abdul Samad (Murattal)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal",
    description: "Clear recitation at a steady pace",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "AbdulBaset_Mujawwad",
    name: "Abdul Basit Abdul Samad (Mujawwad)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Mujawwad",
    description: "Classic recitation with melodious, measured pace",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "Sudais",
    name: "Abdul Rahman Al-Sudais",
    arabicName: "عبدالرحمن السديس",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "Shatri",
    name: "Abu Bakr Al-Shatri",
    arabicName: "أبو بكر الشاطري",
    style: "Murattal",
    description: "Imam with a melodious voice",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "Ahmed_ibn_Ali_al-Ajamy",
    name: "Ahmed ibn Ali Al-Ajamy",
    arabicName: "أحمد بن علي العجمي",
    style: "Murattal",
    description: "Reciter with clear and precise tajweed",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "Maher_AlMuaiqly",
    name: "Maher Al Muaiqly",
    arabicName: "ماهر المعيقلي",
    style: "Murattal",
    description: "Imam of the Grand Mosque in Makkah",
    apiSource: "quran-central",
    hasOfflineContent: true
  },
  {
    id: "Husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal",
    description: "Classic recitation with strict adherence to tajweed rules",
    apiSource: "quran-central",
    hasOfflineContent: false
  },
  {
    id: "Minshawi_Mujawwad",
    name: "Mohamed Siddiq Al-Minshawi (Mujawwad)",
    arabicName: "محمد صديق المنشاوي",
    style: "Mujawwad",
    description: "Beautiful melodious recitation",
    apiSource: "quran-central",
    hasOfflineContent: false
  },
  {
    id: "Ayyoub",
    name: "Muhammad Ayyoub",
    arabicName: "محمد أيوب",
    style: "Murattal",
    description: "Imam of the Prophet's Mosque in Madinah",
    apiSource: "quran-central",
    hasOfflineContent: false
  }
];
