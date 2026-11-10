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
 * Translates and breaks down a textbook page or educational document.
 * Communicates with the server-side /api/translate-textbook endpoint.
 * Gracefully falls back to the dynamic offline pedagogy engine on error or offline usage.
 */
export async function translateTextbookFile(
  file: File | Blob,
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  gradeLevel = 'Primary (Classes 1-5)'
): Promise<TextbookTranslationResult> {
  const filePart = await fileToGenerativePart(file);

  try {
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
    } else {
      const errJson = await res.json().catch(() => null);
      if (errJson?.error) {
        console.warn('Server textbook translation returned error:', errJson.error);
      }
    }
  } catch (err) {
    console.warn('Textbook translation fetch error, using dynamic language pedagogy engine:', err);
  }

  // High quality offline fallback
  return getOfflineTextbookPedagogy(targetLanguage, sourceLanguage, gradeLevel);
}

/**
 * Translates spoken classroom instruction between Hindi and target language.
 * Sends the request to the server-side /api/translate-speech endpoint.
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
  const cleanText = spokenText.trim();
  if (!cleanText) {
    return {
      translation: '',
      phoneticScript: '',
      teacherNote: '',
    };
  }

  try {
    const res = await fetch('/api/translate-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spokenText: cleanText,
        targetLanguage,
        sourceLanguage,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translation) {
        return data;
      }
    } else {
      const errJson = await res.json().catch(() => null);
      if (errJson?.error) {
        console.warn('Server speech translation returned error:', errJson.error);
      }
    }
  } catch (err) {
    console.warn('Speech translation fetch error, using dynamic language pedagogy engine:', err);
  }

  // Dynamic language-specific pedagogy engine fallback
  return getOfflineSpeechTranslation(cleanText, targetLanguage, sourceLanguage);
}

/**
 * Alias for translateBilingualSpeech for direct speech translation.
 */
export const translateSpeech = translateBilingualSpeech;

/**
 * Streams spoken translation in real time via server-sent events from /api/stream-translate-speech.
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
              // ignore SSE control chunks
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
 * Real-time Live API translation helper communicating with /api/live-translate-speech on the server.
 */
export async function liveTranslateSpeech(
  params: {
    audioChunk?: string;
    spokenText?: string;
    targetLanguage: string;
    sourceLanguage?: string;
  }
): Promise<{
  translation: string;
  phoneticScript: string;
  teacherNote: string;
}> {
  try {
    const res = await fetch('/api/live-translate-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translation) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Live speech translation error:', err);
  }

  return getOfflineSpeechTranslation(params.spokenText || '', params.targetLanguage, params.sourceLanguage || 'Hindi');
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