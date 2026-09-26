/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileText,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Compass,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import {
  translateTextbookFile,
  TextbookTranslationResult,
  fileToGenerativePart,
} from '../utils/geminiService';
import {
  playIndianLanguageAudio,
  stopIndianLanguageAudio,
} from '../utils/audioSynthesizer';

export interface TextbookUploadViewProps {
  selectedLanguageId: string;
}

export const TextbookUploadView: React.FC<TextbookUploadViewProps> = ({
  selectedLanguageId: propLanguageId,
}) => {
  const selectedLanguageId =
    !propLanguageId || propLanguageId === '{selectedLanguageId}'
      ? (typeof window !== 'undefined' &&
          (window as unknown as { __SELECTED_LANGUAGE_ID?: string })
            .__SELECTED_LANGUAGE_ID) ||
        'Santhali'
      : propLanguageId;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [translationResult, setTranslationResult] =
    useState<TextbookTranslationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);

    const isPdfFile =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setIsPdf(isPdfFile);

    if (isPdfFile) {
      setFilePreviewUrl(null);
    } else {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleTranslate = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or upload a PDF or image file first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Validate that file can be converted to generative part
      await fileToGenerativePart(selectedFile);

      // Call Gemini multimodal textbook translation
      const result = await translateTextbookFile(
        selectedFile,
        selectedLanguageId,
        'Hindi',
        'Primary Elementary (Grades 1-5)'
      );

      setTranslationResult(result);
    } catch (err) {
      console.error('Error during textbook translation:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to process textbook file. Please verify network and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudio = async (textToPlay: string) => {
    if (isPlayingAudio) {
      stopIndianLanguageAudio();
      setIsPlayingAudio(false);
      return;
    }

    if (!textToPlay || !textToPlay.trim()) return;

    setIsPlayingAudio(true);
    try {
      await playIndianLanguageAudio(textToPlay, selectedLanguageId);
    } catch (err) {
      console.error('Audio playback error:', err);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setIsPdf(false);
    setTranslationResult(null);
    setErrorMessage(null);
    stopIndianLanguageAudio();
    setIsPlayingAudio(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Demo fallback loader for instant evaluation
  const handleLoadSamplePage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 700, 450);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px serif';
      ctx.fillText('पाठ ४: नदियाँ और हमारे जंगल', 50, 60);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '16px sans-serif';
      ctx.fillText('हमारे देश में नदियाँ जीवनदायिनी हैं।', 50, 110);
      ctx.fillText('जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं।', 50, 140);
      ctx.fillText('हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।', 50, 170);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 14px sans-serif';
      ctx.fillText('कक्षा ३ - पर्यावरण अध्ययन (NCERT)', 50, 220);
    }
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'NCERT_Paryavaran_Class3.png', {
          type: 'image/png',
        });
        handleFileProcess(file);
      }
    }, 'image/png');
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload & Controller Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Textbook Page & Primer Document Translator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload NCERT or State Board PDF pages & textbook scans to generate bilingual pedagogy for{' '}
              <span className="text-amber-300 font-semibold">{selectedLanguageId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSamplePage}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Load Sample Lesson
            </button>
            {selectedFile && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Drag and Drop Box with Input */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-700/80 hover:border-amber-500/60 bg-slate-950/40'
          }`}
        >
          {/* Hidden Required input[type="file"] allowing PDFs and images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="w-full flex flex-col items-center">
              {isPdf ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xs uppercase">
                    PDF
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white truncate max-w-xs md:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Document Ready
                    </p>
                  </div>
                </div>
              ) : filePreviewUrl ? (
                <div className="relative group max-w-md w-full rounded-xl overflow-hidden border border-slate-700 shadow-md">
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded textbook preview"
                    className="w-full max-h-60 object-contain bg-slate-950"
                  />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs text-white">
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Click to choose a different page
                    </p>
                  </div>
                </div>
              ) : null}

              <span className="mt-3 text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                File selected: {selectedFile.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Click or drag & drop textbook PDF or image here
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Supports scanned pages, photographs, worksheets, and PDF documents (PDF, PNG, JPG, WEBP)
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Trigger Button */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={!selectedFile || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating to {selectedLanguageId}...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Translate Textbook File ({selectedLanguageId})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section: Original Text, Translated Text, Romanized Text, and Audio Button */}
      {translationResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Header & Global Audio Synthesizer Button */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold">
                Multimodal Translation Output
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Hindi</span>
                <span className="text-slate-500 text-sm">→</span>
                <span className="text-amber-300">{translationResult.targetLanguage}</span>
              </h3>
            </div>

            {/* Play Indian Language Audio Button */}
            <button
              type="button"
              onClick={() =>
                handleToggleAudio(
                  translationResult.translatedText || translationResult.romanizedText
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Speech Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Play {selectedLanguageId} Audio</span>
                </>
              )}
            </button>
          </div>

          {/* Three Core Panels: Original, Translated, and Romanized */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Original Text */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Original Text
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(translationResult.extractedSourceText, 'source')}
                    className="text-slate-400 hover:text-slate-200 p-1"
                    title="Copy Original Text"
                  >
                    {copiedSection === 'source' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {translationResult.extractedSourceText || 'No source text extracted.'}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                Source: {translationResult.sourceLanguage || 'Hindi'}
              </div>
            </div>

            {/* 2. Translated Text */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    Translated Text ({translationResult.targetLanguage})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(translationResult.translatedText, 'translated')
                    }
                    className="text-amber-400/80 hover:text-amber-300 p-1"
                    title="Copy Translated Text"
                  >
                    {copiedSection === 'translated' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-amber-100 font-serif leading-relaxed whitespace-pre-wrap">
                  {translationResult.translatedText}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-500/20 text-[10px] text-amber-400/80 font-mono">
                Native / Regional Script
              </div>
            </div>

            {/* 3. Romanized Text */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    Romanized Text (Phonetics)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(translationResult.romanizedText, 'romanized')
                    }
                    className="text-indigo-400/80 hover:text-indigo-300 p-1"
                    title="Copy Romanized Text"
                  >
                    {copiedSection === 'romanized' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-indigo-100 font-mono leading-relaxed whitespace-pre-wrap">
                  {translationResult.romanizedText ||
                    'Phonetic romanization automatically formatted for teachers.'}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-indigo-500/20 text-[10px] text-indigo-400/80 font-mono">
                Phonetic Guide for Non-Native Teachers
              </div>
            </div>
          </div>

          {/* Pedagogical Summary & Cultural Analogy */}
          {translationResult.pedagogicalSummary && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pedagogical Adaptation Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {translationResult.pedagogicalSummary}
              </p>
            </div>
          )}

          {/* Vocabulary Matrix */}
          {translationResult.vocabulary && translationResult.vocabulary.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>Classroom Lexicon & Pronunciation Keys</span>
                <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">
                  {translationResult.vocabulary.length} terms
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {translationResult.vocabulary.map((vocab, index) => (
                  <div
                    key={index}
                    className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-white">{vocab.term}</span>
                        <button
                          type="button"
                          onClick={() =>
                            playIndianLanguageAudio(
                              vocab.transliteration || vocab.translation,
                              selectedLanguageId
                            )
                          }
                          className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                          title="Speak word"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-serif text-amber-300 mt-1">
                        {vocab.transliteration}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Meaning: <span className="text-slate-200">{vocab.translation}</span>
                      </p>
                      {vocab.meaning && (
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          {vocab.meaning}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low-cost Teaching Aids (TLMs) */}
          {translationResult.teachingAids && translationResult.teachingAids.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Teaching Learning Materials (TLMs) for Primary Classrooms
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {translationResult.teachingAids.map((aid, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-950/50 border border-slate-800/60 p-2.5 rounded-lg flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{aid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextbookUploadView;
