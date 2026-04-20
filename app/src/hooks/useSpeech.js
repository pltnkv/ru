import { useCallback, useRef } from 'react';

const CHILD_NAME = 'Майя';

export function useSpeech() {
  const utteranceRef = useRef(null);

  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(String(text).toLowerCase());
    utterance.lang = 'ru-RU';
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.1;
    utterance.volume = 1;

    // prefer a Russian female voice
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(v => v.lang.startsWith('ru') && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang.startsWith('ru'));
    if (ruVoice) utterance.voice = ruVoice;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return utterance;
  }, []);

  // speaks a single letter as its SOUND (not alphabet name)
  const speakLetter = useCallback((letter) => {
    // map letter to its phonetic sound for the child
    const phonetics = {
      'А': 'А', 'О': 'О', 'У': 'У', 'И': 'И', 'Ы': 'Ы',
      'Е': 'Е', 'Ё': 'Ё', 'Ю': 'Ю', 'Я': 'Я',
      'М': 'М-м-м', 'С': 'С-с-с', 'Н': 'Н-н-н', 'Р': 'Р-р-р',
      'Л': 'Л-л-л', 'В': 'В-в-в', 'Х': 'Х-х-х', 'Ж': 'Ж-ж-ж',
      'Ш': 'Ш-ш-ш', 'З': 'З-з-з',
      'П': 'П', 'Б': 'Б', 'Т': 'Т', 'Д': 'Д',
      'К': 'К', 'Г': 'Г', 'Ч': 'Ч', 'Щ': 'Щ', 'Ц': 'Ц',
      'Й': 'Й', 'Ь': 'мягкий знак', 'Ъ': 'твёрдый знак',
    };
    speak(phonetics[letter] || letter, { rate: 0.7 });
  }, [speak]);

  const sayInstruction = useCallback((text) => {
    speak(text, { rate: 0.8 });
  }, [speak]);

  const sayWithName = useCallback((template) => {
    speak(template.replace('{name}', CHILD_NAME), { rate: 0.8 });
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, speakLetter, sayInstruction, sayWithName, stop };
}
