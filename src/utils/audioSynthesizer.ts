/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateSpokenAudio } from './geminiService';

let activeAudioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

/**
 * Plays synthesized spoken audio for Indian/tribal languages.
 * Attempts Gemini TTS model first, gracefully falling back to browser SpeechSynthesis.
 *
 * @param text The sentence or paragraph to speak aloud
 * @param languageCodeOrName Optional language name or ISO code for accent tuning
 */
export async function playIndianLanguageAudio(
  text: string,
  languageCodeOrName?: string
): Promise<void> {
  if (!text || !text.trim()) {
    return;
  }

  // Stop any active ongoing playback
  stopIndianLanguageAudio();

  try {
    const base64Audio = await generateSpokenAudio(text);
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!activeAudioContext || activeAudioContext.state === 'closed') {
        activeAudioContext = new AudioContextClass({ sampleRate: 24000 });
      }

      if (activeAudioContext.state === 'suspended') {
        await activeAudioContext.resume();
      }

      const audioBuffer = await activeAudioContext.decodeAudioData(bytes.buffer);
      const source = activeAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(activeAudioContext.destination);
      currentSourceNode = source;

      return new Promise<void>((resolve) => {
        source.onended = () => {
          currentSourceNode = null;
          resolve();
        };
        source.start();
      });
    }
  } catch (err) {
    console.warn('Gemini TTS playback fallback to Web Speech API:', err);
  }

  // Fallback to Web Speech API
  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slower cadence suitable for elementary language learners

      // Resolve approximate speech synthesis language
      if (languageCodeOrName) {
        const lang = languageCodeOrName.toLowerCase();
        if (lang.includes('hi') || lang.includes('hindi')) utterance.lang = 'hi-IN';
        else if (lang.includes('bn') || lang.includes('bengali')) utterance.lang = 'bn-IN';
        else if (lang.includes('ta') || lang.includes('tamil')) utterance.lang = 'ta-IN';
        else if (lang.includes('te') || lang.includes('telugu')) utterance.lang = 'te-IN';
        else if (lang.includes('mr') || lang.includes('marathi')) utterance.lang = 'mr-IN';
        else if (lang.includes('gu') || lang.includes('gujarati')) utterance.lang = 'gu-IN';
        else if (lang.includes('ur') || lang.includes('urdu')) utterance.lang = 'ur-IN';
        else if (lang.includes('pa') || lang.includes('punjabi')) utterance.lang = 'pa-IN';
        else utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
}

/**
 * Stops any actively playing audio synthesis.
 */
export function stopIndianLanguageAudio(): void {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {
      // Audio node already stopped
    }
    currentSourceNode = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
