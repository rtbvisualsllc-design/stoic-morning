import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  STREAK: "stoic_streak",
  LAST_COMPLETED: "stoic_last_completed",
  HISTORY: "stoic_history",
  AUDIO_ENABLED: "stoic_audio_enabled",
  TOTAL_COMPLETIONS: "stoic_total_completions",
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

export const useAppState = () => {
  const [streak, setStreak] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [history, setHistory] = useState([]);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [audioEnabled, setAudioEnabledState] = useState(true);

  useEffect(() => {
    // Load streak
    const savedStreak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || "0");
    const lastCompleted = localStorage.getItem(STORAGE_KEYS.LAST_COMPLETED);
    const today = getTodayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    setStreak(savedStreak);

    if (lastCompleted === today) {
      setTodayCompleted(true);
    } else if (lastCompleted !== yesterday && lastCompleted !== today && savedStreak > 0) {
      // Streak broken
      setStreak(0);
      localStorage.setItem(STORAGE_KEYS.STREAK, "0");
    }

    // Load history
    const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    setHistory(savedHistory);

    // Load total
    const savedTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_COMPLETIONS) || "0");
    setTotalCompletions(savedTotal);

    // Load audio preference
    const savedAudio = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    setAudioEnabledState(savedAudio === null ? true : savedAudio === "true");
  }, []);

  const saveAudioEnabled = useCallback((val) => {
    setAudioEnabledState(val);
    localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, String(val));
  }, []);

  const saveCompletion = useCallback(
    ({ battleReflection, intention, gratitude1, gratitude2, gratitude3 }) => {
      const today = getTodayKey();
      const lastCompleted = localStorage.getItem(STORAGE_KEYS.LAST_COMPLETED);
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let newStreak = streak;
      if (lastCompleted === yesterday) {
        newStreak = streak + 1;
      } else if (lastCompleted !== today) {
        newStreak = 1;
      }

      setStreak(newStreak);
      setTodayCompleted(true);
      localStorage.setItem(STORAGE_KEYS.STREAK, String(newStreak));
      localStorage.setItem(STORAGE_KEYS.LAST_COMPLETED, today);

      const newTotal = totalCompletions + 1;
      setTotalCompletions(newTotal);
      localStorage.setItem(STORAGE_KEYS.TOTAL_COMPLETIONS, String(newTotal));

      const entry = {
        date: today,
        displayDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        battleReflection,
        intention,
        gratitude: [gratitude1, gratitude2, gratitude3].filter(Boolean),
        streak: newStreak,
      };

      const updatedHistory = [entry, ...history].slice(0, 30);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

      return newStreak;
    },
    [streak, totalCompletions, history]
  );

  return {
    streak,
    totalCompletions,
    history,
    todayCompleted,
    audioEnabled,
    setAudioEnabled: saveAudioEnabled,
    saveCompletion,
  };
};
