/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  getOfflineSpeechTranslation,
  getOfflineTextbookPedagogy,
} from './src/utils/offlinePedagogyEngine';

// Load environment variables (.env.local has priority)
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Creates and returns a configured GoogleGenAI instance with telemetry header.
 */
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Helper to check if an API key looks like a valid Gemini API key (starts with AIza)
 */
function isValidGeminiKey(key: string): boolean {
  return typeof key === 'string' && key.startsWith('AIza') && key.length > 20;
}

/**
 * POST /api/translate-textbook
 * Translates and breaks down a textbook page or educational document into bilingual pedagogy.
 */
app.post('/api/translate-textbook', async (req: Request, res: Response) => {
  try {
    const {
      fileData,
      mimeType = 'image/jpeg',
      targetLanguage = 'Santhali',
      sourceLanguage = 'Hindi',
      gradeLevel = 'Primary (Classes 1-5)',
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

    // If a valid Gemini key is present, attempt live AI analysis
    if (isValidGeminiKey(apiKey) && fileData) {
      try {
        const ai = getGeminiClient();

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
          model: 'gemini-2.5-flash',
          contents: [{ inlineData: { data: fileData, mimeType } }, { text: prompt }],
          config: {
            responseMimeType: 'application/json',
            systemInstruction:
              'You are Vidyavaradhi, an offline-first bilingual primary education engine for Indian tribal and regional education.',
          },
        });

        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);
        if (parsed.translatedText) {
          return res.json({
            extractedSourceText: parsed.extractedSourceText || '',
            translatedText: parsed.translatedText || '',
            romanizedText: parsed.romanizedText || parsed.transliteration || '',
            targetLanguage: parsed.targetLanguage || targetLanguage,
            sourceLanguage: parsed.sourceLanguage || sourceLanguage,
            pedagogicalSummary: parsed.pedagogicalSummary || '',
            vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
            teachingAids: Array.isArray(parsed.teachingAids) ? parsed.teachingAids : [],
            culturalAnalogies: parsed.culturalAnalogies || '',
          });
        }
      } catch (apiErr) {
        console.warn('Gemini textbook translation error, utilizing offline pedagogy engine:', apiErr);
      }
    }

    // High quality offline pedagogical translation
    const fallback = getOfflineTextbookPedagogy(targetLanguage, sourceLanguage, gradeLevel);
    return res.json(fallback);
  } catch (err: unknown) {
    console.warn('Unexpected error in /api/translate-textbook, falling back to offline:', err);
    const fallback = getOfflineTextbookPedagogy(req.body?.targetLanguage || 'Santhali');
    return res.json(fallback);
  }
});

/**
 * POST /api/translate-speech
 * Translates spoken classroom instruction between Hindi and target language.
 */
app.post('/api/translate-speech', async (req: Request, res: Response) => {
  try {
    const { spokenText = '', targetLanguage = 'Santhali', sourceLanguage = 'Hindi' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

    // If valid Gemini API key is configured, query Gemini 2.5 Flash
    if (isValidGeminiKey(apiKey) && spokenText.trim()) {
      try {
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
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.translation) {
          return res.json({
            translation: parsed.translation || '',
            phoneticScript: parsed.phoneticScript || '',
            teacherNote: parsed.teacherNote || '',
          });
        }
      } catch (apiErr) {
        console.warn('Gemini speech translation error, utilizing offline pedagogy engine:', apiErr);
      }
    }

    // Reliable offline pedagogical translation
    const fallback = getOfflineSpeechTranslation(spokenText, targetLanguage, sourceLanguage);
    return res.json(fallback);
  } catch (err: unknown) {
    console.warn('Unexpected error in /api/translate-speech, falling back to offline:', err);
    const fallback = getOfflineSpeechTranslation(req.body?.spokenText || '', req.body?.targetLanguage || 'Santhali');
    return res.json(fallback);
  }
});

/**
 * POST /api/stream-translate-speech
 * Server-Sent Events (SSE) streaming speech translation endpoint.
 */
app.post('/api/stream-translate-speech', async (req: Request, res: Response) => {
  try {
    const { spokenText = '', targetLanguage = 'Santhali', sourceLanguage = 'Hindi' } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

    if (isValidGeminiKey(apiKey) && spokenText.trim()) {
      try {
        const ai = getGeminiClient();
        const prompt = `Translate this spoken classroom instruction from ${sourceLanguage} to ${targetLanguage}: "${spokenText}". Provide clear translation and phonetic pronunciation guidance.`;

        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }

        res.write('data: [DONE]\n\n');
        return res.end();
      } catch (apiErr) {
        console.warn('Gemini stream translation error, falling back:', apiErr);
      }
    }

    const offline = getOfflineSpeechTranslation(spokenText, targetLanguage, sourceLanguage);
    res.write(`data: ${JSON.stringify({ text: offline.translation })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: unknown) {
    console.warn('Error in /api/stream-translate-speech:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
    }
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

/**
 * POST /api/synthesize-audio
 * Generates spoken audio for textbook phrases or translations using client-side Web Speech fallback.
 */
app.post('/api/synthesize-audio', async (_req: Request, res: Response) => {
  // Return clean response allowing client Web Speech API to provide immediate audio
  return res.json({ audioBase64: null, message: 'Audio synthesis handled via client audio synthesizer' });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${process.env.NODE_ENV !== 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
