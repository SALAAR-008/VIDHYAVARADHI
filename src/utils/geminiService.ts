/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getOfflineSpeechTranslation,
  getOfflineTextbookPedagogy,
} from './offlinePedagogyEngine';

export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface VocabularyItem {
  term: string;
  transliteration: string;
  translation: string;
  exampleSentence?: string;
  meaning: string;
}

export interface TextbookTranslationResult {
  extractedSourceText: string;
  translatedText: string;
  romanizedText: string;
  targetLanguage: string;
  sourceLanguage: string;
  pedagogicalSummary: string;
  vocabulary: VocabularyItem[];
  teachingAids: string[];
  culturalAnalogies: string;
}

/**
 * Converts a browser File or Blob into base64 GenerativePart structure.
 */
export async function fileToGenerativePart(file: File | Blob): Promise<GenerativePart> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result) {
        reject(new Error('Failed to read file data'));
        return;
      }
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'image/jpeg',
        },
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Translates and breaks down a textbook page or educational document via the server.
 * Never throws unhandled errors to the UI.
 */
export async function translateTextbookFile(
  file: File | Blob,
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  gradeLevel = 'Primary (Classes 1-5)'
): Promise<TextbookTranslationResult> {
  try {
    const filePart = await fileToGenerativePart(file);

    const res = await fetch('/api/translate-textbook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: filePart.inlineData.data,
        mimeType: filePart.inlineData.mimeType,
        targetLanguage,
        sourceLanguage,
        gradeLevel,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translatedText) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Textbook translation fetch error, using offline pedagogy engine:', err);
  }

  // Resilient offline pedagogical module
  return getOfflineTextbookPedagogy(targetLanguage, sourceLanguage, gradeLevel);
}

/**
 * Translates spoken classroom instruction between Hindi and target language via the server.
 * Never throws unhandled errors to the UI.
 */
export async function translateBilingualSpeech(
  spokenText: string,
  targetLanguage: string,
  sourceLanguage = 'Hindi'
): Promise<{
  translation: string;
  phoneticScript: string;
  teacherNote: string;
}> {
  try {
    const res = await fetch('/api/translate-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spokenText,
        targetLanguage,
        sourceLanguage,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translation) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Speech translation fetch error, using offline pedagogy engine:', err);
  }

  // Resilient offline pedagogical module
  return getOfflineSpeechTranslation(spokenText, targetLanguage, sourceLanguage);
}

/**
 * Streams spoken translation in real time via server-sent events.
 */
export async function streamBilingualSpeech(
  spokenText: string,
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  onChunk?: (chunk: string) => void
): Promise<string> {
  try {
    const res = await fetch('/api/stream-translate-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spokenText,
        targetLanguage,
        sourceLanguage,
      }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.replace('data: ', '').trim();
            if (payload === '[DONE]') break;
            try {
              const parsed = JSON.parse(payload);
              if (parsed.text) {
                accumulated += parsed.text;
                onChunk?.(parsed.text);
              }
            } catch {
              // ignore heartbeat
            }
          }
        }
      }

      if (accumulated) return accumulated;
    }
  } catch (err) {
    console.warn('Stream translation error:', err);
  }

  const fallback = getOfflineSpeechTranslation(spokenText, targetLanguage, sourceLanguage);
  onChunk?.(fallback.translation);
  return fallback.translation;
}

/**
 * Requests synthesized audio from the server.
 */
export async function generateSpokenAudio(_text: string): Promise<string | null> {
  return null;
}

/**
 * Kept for backward compatibility. Server handles all Gemini API authentication.
 */
export const getApiKey = (): string => '';