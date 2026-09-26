import { GoogleGenAI, Type } from '@google/genai';

/**
 * Safely retrieves the Gemini API key without causing 'process is not defined'
 * in client-side Vite browser environments.
 */
export const getApiKey = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process?.env) {
    return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }
  return '';
};

/**
 * Returns a configured GoogleGenAI instance with telemetry headers.
 */
export const getGeminiClient = (): GoogleGenAI => {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

/**
 * Converts a browser File or Blob into inline base64 format for Gemini API multimodal input.
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
 * Translates and breaks down a textbook page or educational document into bilingual pedagogy.
 * Designed for primary education in tribal and Scheduled Indian Languages.
 */
export async function translateTextbookFile(
  file: File | Blob,
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  gradeLevel = 'Primary (Classes 1-5)'
): Promise<TextbookTranslationResult> {
  const ai = getGeminiClient();
  const filePart = await fileToGenerativePart(file);

  const prompt = `
You are an expert bilingual pedagogue for Indian primary education, specializing in bridging standard curricula (in Hindi/English) with 22+ Scheduled Indian Languages and indigenous/tribal mother tongues (e.g., Santhali with Ol Chiki script, Gondi, Ho with Warang Citi, Mundari, Bodo).

Analyze this textbook page or educational material:
1. Extract the main educational text in the source language (${sourceLanguage}).
2. Provide a faithful, culturally sensitive translation into ${targetLanguage}. If the target language has an indigenous script (like Ol Chiki for Santhali) provide both that script and Roman/Devanagari phonetics.
3. Provide a clear Romanized transliteration ("romanizedText") for the translated text so non-native teachers can read and pronounce it with accurate phonetics.
4. Formulate a simplified summary suitable for ${gradeLevel} students.
5. Extract 4-6 key curriculum vocabulary terms with pronunciation transliteration, translation, and localized context.
6. Provide 2-3 practical classroom activities or teaching aids for teachers using easily accessible rural/classroom items.
7. Provide a cultural analogy or familiar rural/forest/community reference that helps students grasp abstract concepts (like math, science, nature).

Respond strictly in valid JSON format matching this schema:
{
  "extractedSourceText": "string",
  "translatedText": "string",
  "romanizedText": "string",
  "targetLanguage": "${targetLanguage}",
  "sourceLanguage": "${sourceLanguage}",
  "pedagogicalSummary": "string",
  "vocabulary": [
    {
      "term": "string",
      "transliteration": "string",
      "translation": "string",
      "meaning": "string",
      "exampleSentence": "string"
    }
  ],
  "teachingAids": ["string", "string"],
  "culturalAnalogies": "string"
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: [filePart, { text: prompt }],
    },
    config: {
      responseMimeType: 'application/json',
      systemInstruction:
        'You are Vidyavaradhi, an offline-first bilingual primary education engine for Indian tribal and regional education.',
    },
  });

  const responseText = response.text || '{}';
  try {
    const parsed = JSON.parse(responseText);
    return {
      extractedSourceText: parsed.extractedSourceText || '',
      translatedText: parsed.translatedText || '',
      romanizedText: parsed.romanizedText || parsed.transliteration || '',
      targetLanguage: parsed.targetLanguage || targetLanguage,
      sourceLanguage: parsed.sourceLanguage || sourceLanguage,
      pedagogicalSummary: parsed.pedagogicalSummary || '',
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      teachingAids: Array.isArray(parsed.teachingAids) ? parsed.teachingAids : [],
      culturalAnalogies: parsed.culturalAnalogies || '',
    };
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', responseText, err);
    return {
      extractedSourceText: 'Extracted text',
      translatedText: responseText,
      romanizedText: '',
      targetLanguage,
      sourceLanguage,
      pedagogicalSummary: 'Translation processed',
      vocabulary: [],
      teachingAids: [],
      culturalAnalogies: '',
    };
  }
}

/**
 * Translates live speech transcript or spoken pedagogy between Hindi and indigenous/scheduled languages.
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
  const ai = getGeminiClient();

  const prompt = `
Translate this spoken classroom instruction from ${sourceLanguage} to ${targetLanguage}:
"${spokenText}"

Target audience: Primary school children in tribal / rural India.
Provide:
1. "translation": accurate translation in ${targetLanguage}.
2. "phoneticScript": phonetic reading in Roman English and Devanagari so the non-native teacher can pronounce it accurately.
3. "teacherNote": a 1-sentence note for encouraging student engagement.

Respond in JSON format:
{
  "translation": "...",
  "phoneticScript": "...",
  "teacherNote": "..."
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch {
    return {
      translation: response.text || '',
      phoneticScript: '',
      teacherNote: '',
    };
  }
}

/**
 * Generates audio speech for a translated passage using Gemini TTS.
 */
export async function generateSpokenAudio(text: string): Promise<string | null> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Gentle, friendly primary school teacher speaking clearly and warmly to young children',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (err) {
    console.warn('TTS generation fallback:', err);
    return null;
  }
}
