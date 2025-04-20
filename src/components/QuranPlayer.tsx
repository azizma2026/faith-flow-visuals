
import React, { useState, useRef } from "react";
import { useCombinedSurah } from "@/api/quranClient";
import { getAudioUrl, RECITERS_DATABASE, TRANSLATION_MAP } from "@/api/quranClient";

interface QuranPlayerProps {
  surahNumber: number;
  defaultTranslation?: keyof typeof TRANSLATION_MAP;
  defaultReciterId?: string;
}

export const QuranPlayer: React.FC<QuranPlayerProps> = ({
  surahNumber,
  defaultTranslation = "en_kfc",
  defaultReciterId = "Sudais" // Correct case-sensitive match
}) => {
  const [ayahIndex, setAyahIndex] = useState(0);
  const [translationEdition, setTranslationEdition] = useState(TRANSLATION_MAP[defaultTranslation]);
  const [reciterId, setReciterId] = useState(defaultReciterId);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: surahData, isLoading, isError } = useCombinedSurah(surahNumber, translationEdition);

  const currentAyah = surahData?.ayahs[ayahIndex];
  const audioUrl = currentAyah ? getAudioUrl(reciterId, surahNumber, currentAyah.numberInSurah) : "";

  // Try playback and show error if it fails
  const handleAudioPlay = () => {
    setPlaybackError(null);
    if (audioRef.current) {
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          setPlaybackError(
            "Could not play audio. Try another reciter, or check your internet connection."
          );
        });
      }
    }
  };

  // Whenever reciter or ayah changes, play audio
  React.useEffect(() => {
    if (audioUrl && audioRef.current) {
      handleAudioPlay();
    }
    // eslint-disable-next-line
  }, [audioUrl, reciterId, ayahIndex]);

  if (isLoading) return <p>Loading Surah...</p>;
  if (isError || !surahData) return <p>Failed to load Surah data.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{surahData.name} ({surahData.englishName})</h2>
      <h4>{surahData.englishNameTranslation}</h4>

      <hr />

      <div>
        <h3>Ayah {currentAyah?.numberInSurah}</h3>
        <p style={{ fontSize: "24px", direction: "rtl" }}>{currentAyah?.text}</p>
        <p><strong>Translation:</strong> {currentAyah?.translation}</p>
        <audio
          key={audioUrl}
          src={audioUrl}
          ref={audioRef}
          autoPlay
          controls
          style={{ marginTop: "10px" }}
          onError={() =>
            setPlaybackError(
              "Could not play audio. Try another reciter, or check your internet connection."
            )
          }
        />

        {playbackError && (
          <div style={{
            color: "#c0392b", background: "#fdead7", borderRadius: 4, padding: 10, marginTop: 10
          }}>
            <strong>Audio Error:</strong> {playbackError}
            <div style={{ marginTop: 6 }}>
              Other reciters you can try:
              <ul style={{ marginTop: 6 }}>
                {RECITERS_DATABASE
                  .filter((rec) => rec.id !== reciterId)
                  .map((rec) => (
                    <li key={rec.id}>
                      <button
                        style={{
                          background: "#2ecc40",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          padding: "3px 8px",
                          marginRight: 4,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setReciterId(rec.id);
                          setPlaybackError(null);
                        }}
                      >
                        {rec.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginTop: "10px" }}>
          <button
            disabled={ayahIndex <= 0}
            onClick={() => setAyahIndex((i) => i - 1)}
          >
            ◀️ Previous
          </button>
          <button
            disabled={ayahIndex >= surahData.ayahs.length - 1}
            onClick={() => setAyahIndex((i) => i + 1)}
          >
            Next ▶️
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          <strong>Reciter:</strong>
        </label>
        <select
          value={reciterId}
          onChange={(e) => {
            setReciterId(e.target.value);
            setPlaybackError(null);
          }}
        >
          {RECITERS_DATABASE.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          <strong>Translation Language:</strong>
        </label>
        <select
          value={translationEdition}
          onChange={(e) => {
            setTranslationEdition(e.target.value);
            setAyahIndex(0); // Reset to first ayah when language changes
          }}
        >
          {Object.entries(TRANSLATION_MAP).map(([label, edition]) => (
            <option key={edition} value={edition}>
              {label.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuranPlayer;
