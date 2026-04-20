import { useState, useRef, useCallback } from 'react';

const CONFIDENCE_THRESHOLD = 0.5;

export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const recognitionRef = useRef(null);

  const start = useCallback((expectedText, onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // fallback: auto-succeed after delay (for devices without STT)
      setTimeout(() => onResult({ success: true, transcript: expectedText, fallback: true }), 1500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let bestMatch = false;
      const expected = expectedText.toLowerCase().trim();

      for (let i = 0; i < event.results[0].length; i++) {
        const alt = event.results[0][i];
        const transcript = alt.transcript.toLowerCase().trim();
        const confidence = alt.confidence;

        // "kind" algorithm: match if similar or confidence ok
        const matches = transcript === expected
          || transcript.includes(expected)
          || expected.includes(transcript)
          || confidence >= CONFIDENCE_THRESHOLD;

        if (matches) {
          bestMatch = true;
          break;
        }
      }

      const transcript = event.results[0][0].transcript;
      setResult({ success: bestMatch, transcript });
      onResult({ success: bestMatch, transcript });
    };

    recognition.onerror = () => {
      setListening(false);
      // on error be kind — let the child succeed
      onResult({ success: true, transcript: expectedText, error: true });
    };

    recognition.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, result, start, stop };
}
