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

// Set COOP and COEP headers for WASM / ONNX multi-threading with SharedArrayBuffer
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

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
 * Helper to check if an API key is available and configured
 */
function isValidGeminiKey(key?: string): boolean {
  return typeof key === 'string' && key.trim().length > 5;
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
You are an expert bilingual pedagogue for Indian primary education, specializing in bridging standard curricula (in Hindi/English) with 22+ Scheduled Indian Languages and indigenous/tribal mother tongues (e.g., Telugu, Bengali, Tamil, Odia, Marathi, Santhali with Ol Chiki script, Gondi, Ho with Warang Citi, Mundari, Bodo).

Analyze this textbook page or educational document comprehensively:
1. Complete Line-by-Line OCR Extraction: Perform a meticulous, exhaustive OCR extraction of ALL visible text from the textbook image or document without skipping, summarizing, or truncating any paragraphs, questions, headings, or sidebars ("extractedSourceText"). If the image contains a title like "पाठ ४: नदियाँ और हमारे जंगल", transcribe the full text verbatim.
2. Full Faithful Translation in Native Script: Translate the entire extracted content faithfully into ${targetLanguage} ("translatedText"), preserving paragraph structure, questions, and formatting.
   CRITICAL SCRIPT & LANGUAGE RULES:
   - Use the authentic native script of ${targetLanguage}.
   - If ${targetLanguage} is Telugu, output strictly in Telugu script (e.g., "నీరు మన జీవితానికి ఆధారం...").
   - If ${targetLanguage} is Bengali, output strictly in Bengali script.
   - If ${targetLanguage} is Tamil, output strictly in Tamil script.
   - If ${targetLanguage} is Odia, output strictly in Odia script.
   - If ${targetLanguage} is Marathi, Hindi, or Gondi, output in Devanagari script.
   - Strictly ONLY use Ol Chiki script if ${targetLanguage} === 'Santhali'.
   - Strictly ONLY use Warang Citi script if ${targetLanguage} === 'Ho'.
   - NEVER use Ol Chiki script or Santhali vocabulary if ${targetLanguage} is NOT Santhali!
3. Complete Romanized Transliteration: Generate an accurate, complete Romanized phonetic transliteration ("romanizedText") matching ${targetLanguage} phonetics (NOT Santhali), so non-native teachers can read and pronounce ${targetLanguage} accurately (e.g. for Telugu: "Neeru mana jeevithaniki aadhaaram...").
4. Simplified Pedagogical Summary: Formulate a clear, structured summary suitable for ${gradeLevel} students and teachers.
5. Exhaustive Vocabulary List (10 to 15 terms): Extract an exhaustive list of 10 to 15 key conceptual vocabulary terms, technical concepts, and classroom keywords found across the document. For each term, provide:
   - "term": original term in ${sourceLanguage}
   - "transliteration": native script representation in ${targetLanguage} (or phonetic guide)
   - "translation": definition / translation in ${targetLanguage} or English
   - "meaning": pedagogical explanation in simple language
   - "exampleSentence": contextual example sentence in ${targetLanguage}
6. Practical Classroom Activities & Teaching Aids: Provide 3-4 hands-on teaching aids using easily accessible rural/classroom items.
7. Cultural Analogy: Provide a cultural analogy or familiar rural/forest/community reference that helps students grasp abstract concepts.

Respond strictly in valid JSON format matching this schema:
{
  "extractedSourceText": "string (entire document transcribed line-by-line)",
  "translatedText": "string (entire document translated comprehensively in ${targetLanguage} script)",
  "romanizedText": "string (full Romanized transliteration for ${targetLanguage} pronunciation)",
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
  "teachingAids": ["string", "string", "string"],
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
Translate this spoken classroom instruction directly from ${sourceLanguage} to ${targetLanguage}:
"${spokenText}"

Target audience: Primary school children in tribal / rural India.
CRITICAL SCRIPT & TRANSLATION RULES:
1. "translation": Output the accurate, direct translation STRICTLY in ${targetLanguage}'s authentic native script.
   - When translating "हाथ उठाइए" (or "हाथ उठाओ") to Telugu, output "చేతులు పైకి ఎత్తండి" (or "చేతులు ఎత్తండి") with phoneticScript "Chethulu paiki etthandi".
   - NEVER prepend greetings like "నమస్కారం పిల్లలు" (Namaskaram pillalu), "Hello", "Namaste", or any salutation unless explicitly present in the original input.
   - If ${targetLanguage} is Telugu, output strictly in Telugu script (e.g. అందరికీ ఈ పాఠం అర్థమైందా?).
   - If ${targetLanguage} is Bengali, output strictly in Bengali script.
   - If ${targetLanguage} is Tamil, output strictly in Tamil script.
   - If ${targetLanguage} is Odia, output strictly in Odia script.
   - If ${targetLanguage} is Marathi, Hindi, or Gondi, output in Devanagari script.
   - ONLY use Ol Chiki script if ${targetLanguage} is Santhali.
   - ONLY use Warang Citi script if ${targetLanguage} is Ho.
   - NEVER use Ol Chiki or Santhali text if ${targetLanguage} is not Santhali!
2. "phoneticScript": Provide the accurate Romanized phonetic reading corresponding directly to the ${targetLanguage} translation so non-native teachers can read and pronounce it accurately (e.g. for Telugu: Chethulu paiki etthandi).
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
 * POST /api/live-translate-speech
 * Real-time Live API translation endpoint for audio or text chunks.
 */
app.post('/api/live-translate-speech', async (req: Request, res: Response) => {
  try {
    const { audioChunk, spokenText = '', targetLanguage = 'Telugu', sourceLanguage = 'Hindi' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

    if (isValidGeminiKey(apiKey)) {
      try {
        const ai = getGeminiClient();
        const contents = audioChunk
          ? [
              { inlineData: { data: audioChunk, mimeType: 'audio/pcm;rate=16000' } },
              {
                text: `Translate any spoken classroom instruction from ${sourceLanguage} directly into ${targetLanguage}.
Respond in JSON format: {"translation": "in native script", "phoneticScript": "Romanized phonetic", "teacherNote": "tip"}`,
              },
            ]
          : [
              `Translate directly from ${sourceLanguage} to ${targetLanguage}: "${spokenText}".
Respond in JSON format: {"translation": "in native script", "phoneticScript": "Romanized phonetic", "teacherNote": "tip"}`,
            ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.translation) {
          return res.json({
            translation: parsed.translation,
            phoneticScript: parsed.phoneticScript || '',
            teacherNote: parsed.teacherNote || '',
          });
        }
      } catch (liveErr) {
        console.warn('Gemini live translate error, utilizing offline engine:', liveErr);
      }
    }

    const fallback = getOfflineSpeechTranslation(spokenText, targetLanguage, sourceLanguage);
    return res.json(fallback);
  } catch (err: unknown) {
    console.warn('Error in /api/live-translate-speech:', err);
    const fallback = getOfflineSpeechTranslation(req.body?.spokenText || '', req.body?.targetLanguage || 'Telugu');
    return res.json(fallback);
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
        hmr: false,
        watch: null,
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
