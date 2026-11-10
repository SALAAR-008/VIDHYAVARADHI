/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as tts from '@mintplex-labs/piper-tts-web';
import * as ort from 'onnxruntime-web';

let currentAudio: HTMLAudioElement | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let isPiperModelReady = false;

// Standard Piper VITS medium neural voice cached in OPFS
const PIPER_VOICE_ID = 'en_US-hfc_female-medium';

/**
 * Configure onnxruntime-web safely for the sandboxed iframe environment:
 * 1. Single thread (numThreads = 1) to eliminate crossOriginIsolated & SharedArrayBuffer requirements.
 * 2. Enable SIMD acceleration where supported.
 * 3. Point wasmPaths to local node_modules dist rather than blocked external cdnjs.cloudflare.com.
 */
function configureOnnxEnv(): void {
  if (typeof window === 'undefined') return;
  try {
    if (ort && ort.env && ort.env.wasm) {
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;
      // Use local bundle path to avoid blocked CDN fetches
      ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/';
    }
  } catch (e) {
    // Gracefully handle any environment restriction
  }
}

// Initial configuration
configureOnnxEnv();

/**
 * Preloads and caches the Piper ONNX model locally in the browser's Origin Private File System.
 * Call this on app load so audio playback is instant without initial latency.
 */
export async function preloadPiperTTS(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    configureOnnxEnv();
    const stored = await tts.stored();
    if (!stored.includes(PIPER_VOICE_ID)) {
      console.log('Downloading Piper neural voice model (~25MB) for local pedagogy...');
      await tts.download(PIPER_VOICE_ID, (progress) => {
        if (progress.total > 0) {
          console.log(`Piper model cache: ${Math.round((progress.loaded * 100) / progress.total)}%`);
        }
      });
    }
    isPiperModelReady = true;
    console.log('Piper Neural TTS is ready for offline playback.');
  } catch (err) {
    console.warn('Piper model preload skipped or failed; will fallback to Web Speech:', err);
  }
}

/**
 * Stops any actively playing audio synthesis (both Piper audio and browser speech).
 */
export function stopIndianLanguageAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
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

/**
 * Plays synthesized spoken audio for Indian/tribal languages.
 * 1. Tries Piper neural ONNX model in WASM for human-like natural intonation.
 * 2. Gracefully falls back to browser SpeechSynthesis if WASM binary fails or is unavailable.
 */
export async function playIndianLanguageAudio(
  text: string,
  languageCodeOrName?: string
): Promise<void> {
  if (!text || !text.trim()) return;

  stopIndianLanguageAudio();

  // --- Option B: Piper Neural WASM Synthesis ---
  try {
    configureOnnxEnv();
    const wavBlob = await tts.predict({
      text: text,
      voiceId: PIPER_VOICE_ID,
    });

    if (wavBlob) {
      const audioUrl = URL.createObjectURL(wavBlob);
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      return new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudio = null;
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudio = null;
          resolve();
        };
        audio.play().catch(() => resolve());
      });
    }
  } catch (piperError) {
    console.warn('Piper neural synthesis skipped, using Web Speech fallback:', piperError);
  }

  // --- Fallback: Native Browser SpeechSynthesis with Enhanced Indian & Natural Voices ---
  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Measured primary-classroom rate for clear pronunciation and pedagogy
      utterance.rate = 0.82;
      utterance.pitch = 1.0;

      // Determine targeted BCP 47 language code
      let targetLang = 'hi-IN';
      if (languageCodeOrName) {
        const lang = languageCodeOrName.toLowerCase();
        if (lang.includes('hi') || lang.includes('hindi')) targetLang = 'hi-IN';
        else if (lang.includes('bn') || lang.includes('bengali')) targetLang = 'bn-IN';
        else if (lang.includes('ta') || lang.includes('tamil')) targetLang = 'ta-IN';
        else if (lang.includes('te') || lang.includes('telugu')) targetLang = 'te-IN';
        else if (lang.includes('mr') || lang.includes('marathi')) targetLang = 'mr-IN';
        else if (lang.includes('gu') || lang.includes('gujarati')) targetLang = 'gu-IN';
        else if (lang.includes('ur') || lang.includes('urdu')) targetLang = 'ur-IN';
        else if (lang.includes('pa') || lang.includes('punjabi')) targetLang = 'pa-IN';
        else if (lang.includes('kn') || lang.includes('kannada')) targetLang = 'kn-IN';
        else if (lang.includes('ml') || lang.includes('malayalam')) targetLang = 'ml-IN';
        else if (lang.includes('or') || lang.includes('odia')) targetLang = 'or-IN';
        else if (lang.includes('en') || lang.includes('english')) targetLang = 'en-IN';
        else targetLang = 'hi-IN';
      }
      utterance.lang = targetLang;

      // Select installed Google, Natural, or Indian neural voices
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          // Priority 1: Exact matching Indian voice (hi-IN, en-IN, etc.)
          const exactVoice = voices.find(
            (v) =>
              v.lang === targetLang ||
              v.lang.replace('_', '-').toLowerCase() === targetLang.toLowerCase()
          );

          // Priority 2: Natural or Google Indian English / Hindi voice
          const indianVoice = voices.find(
            (v) =>
              (v.name.includes('India') ||
                v.lang.endsWith('-IN') ||
                v.name.includes('Hindi') ||
                v.name.includes('Google हिन्दी')) &&
              !v.name.toLowerCase().includes('legacy')
          );

          // Priority 3: High quality Google or Natural voice
          const naturalVoice = voices.find(
            (v) =>
              v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Neural')
          );

          utterance.voice = exactVoice || indianVoice || naturalVoice || null;
        }
      } catch (voiceErr) {
        // Fall back to default voice without failing
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
}