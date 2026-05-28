import { useState, useCallback, useRef, useEffect } from "react";

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const utteranceRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  const getVoice = useCallback(() => {
    const voices = synthRef.current.getVoices();
    // Prefer deep, calm male voices
    const preferred = [
      "Google UK English Male",
      "Microsoft David Desktop",
      "Alex",
      "Daniel",
      "Google US English",
    ];
    for (const name of preferred) {
      const found = voices.find((v) => v.name === name);
      if (found) return found;
    }
    return voices.find((v) => v.lang === "en-US") || voices[0];
  }, []);

  const speak = useCallback(
    (text, onEnd) => {
      if (!audioEnabled) return;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
      utterance.volume = 1;

      // Wait for voices to load
      const setVoiceAndSpeak = () => {
        utterance.voice = getVoice();
        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
      };

      if (synthRef.current.getVoices().length === 0) {
        synthRef.current.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    },
    [audioEnabled, getVoice]
  );

  const pause = useCallback(() => {
    if (synthRef.current.speaking) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const toggle = useCallback(() => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    }
  }, [isSpeaking, isPaused, pause, resume]);

  return {
    speak,
    stop,
    pause,
    resume,
    toggle,
    isSpeaking,
    isPaused,
    audioEnabled,
    setAudioEnabled,
  };
};

export default useSpeech;
