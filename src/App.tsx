import React, { useState, useRef, useEffect } from 'react';
import { TextbookUploadView } from './components/TextbookUploadView';
import {
  BookOpen,
  Languages,
  Mic,
  MicOff,
  Volume2,
  Bookmark,
  Globe,
  Award,
  ChevronRight,
  Loader2,
  Compass,
} from 'lucide-react';
import {
  translateBilingualSpeech,
  TextbookTranslationResult,
} from './utils/geminiService';
import { playIndianLanguageAudio } from './utils/audioSynthesizer';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  family: 'Tribal Indigenous' | 'Scheduled 8th Schedule';
  script: string;
  region: string;
}

const LANGUAGES: LanguageOption[] = [
  // Tribal languages
  { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', family: 'Tribal Indigenous', script: 'Ol Chiki / Devanagari', region: 'Jharkhand, Odisha, West Bengal, Assam' },
  { code: 'gon', name: 'Gondi', nativeName: 'गोंडी', family: 'Tribal Indigenous', script: 'Gunjala Gondi / Devanagari', region: 'Madhya Pradesh, Chhattisgarh, Maharashtra' },
  { code: 'hoc', name: 'Ho', nativeName: 'ᱦᱳ / हो', family: 'Tribal Indigenous', script: 'Warang Citi / Devanagari', region: 'Jharkhand, Odisha' },
  { code: 'unr', name: 'Mundari', nativeName: 'मुंडारी', family: 'Tribal Indigenous', script: 'Mundari Bani / Devanagari', region: 'Jharkhand, Odisha, West Bengal' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', family: 'Tribal Indigenous', script: 'Devanagari', region: 'Assam, Bodoland' },
  // Scheduled Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', family: 'Scheduled 8th Schedule', script: 'Devanagari', region: 'Northern & Central India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', family: 'Scheduled 8th Schedule', script: 'Odia', region: 'Odisha' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', family: 'Scheduled 8th Schedule', script: 'Bengali', region: 'West Bengal, Tripura, Assam' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', family: 'Scheduled 8th Schedule', script: 'Telugu', region: 'Andhra Pradesh, Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', family: 'Scheduled 8th Schedule', script: 'Devanagari', region: 'Maharashtra' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', family: 'Scheduled 8th Schedule', script: 'Tamil', region: 'Tamil Nadu, Puducherry' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', family: 'Scheduled 8th Schedule', script: 'Gujarati', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', family: 'Scheduled 8th Schedule', script: 'Kannada', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', family: 'Scheduled 8th Schedule', script: 'Malayalam', region: 'Kerala, Lakshadweep' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', family: 'Scheduled 8th Schedule', script: 'Gurmukhi', region: 'Punjab, Haryana' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', family: 'Scheduled 8th Schedule', script: 'Bengali-Assamese', region: 'Assam' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', family: 'Scheduled 8th Schedule', script: 'Devanagari / Mithilakshar', region: 'Bihar, Jharkhand' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', family: 'Scheduled 8th Schedule', script: 'Devanagari', region: 'Pan-Indian Classical' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', family: 'Scheduled 8th Schedule', script: 'Perso-Arabic (Nastaliq)', region: 'Pan-Indian' },
];

interface SampleLesson {
  id: string;
  title: string;
  subject: string;
  grade: string;
  hindiText: string;
  targetLang: string;
  previewImageUrl: string;
}

const SAMPLE_LESSONS: SampleLesson[] = [
  {
    id: 'sample-1',
    title: 'पाठ ३: जल ही जीवन है (Water is Life)',
    subject: 'Environmental Studies / पर्यावरण',
    grade: 'Grade 3 (कक्षा ३)',
    hindiText: 'जल हमारे जीवन का आधार है। हमें पानी को व्यर्थ नहीं बहाना चाहिए। कुएं, नदियाँ और बावड़ियां हमारे प्राकृतिक जल स्रोत हैं।',
    targetLang: 'Santhali',
    previewImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-2',
    title: 'पाठ ५: हमारे मित्र वृक्ष (Our Friends the Trees)',
    subject: 'Science & Ecology / विज्ञान',
    grade: 'Grade 2 (कक्षा २)',
    hindiText: 'पेड़ हमें ताज़ी हवा, फल और औषधियाँ देते हैं। जंगल हमारे जीवन के रक्षक हैं। हम सबको मिलकर पेड़ लगाना चाहिए।',
    targetLang: 'Gondi',
    previewImageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-3',
    title: 'पाठ २: पहाड़ों का जीवन (Mountain & Forest Life)',
    subject: 'Social Science / सामाजिक अध्ययन',
    grade: 'Grade 4 (कक्षा ४)',
    hindiText: 'पहाड़ी क्षेत्रों में ढलानदार खेतों पर सीढ़ीदार खेती होती है। यहाँ के लोग प्रकृति के नियमों का सम्मान करते हैं।',
    targetLang: 'Ho',
    previewImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('textbook-upload');
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('Santhali');
  const selectedLanguage = selectedLanguageId;
  const setSelectedLanguage = setSelectedLanguageId;
  const [sourceLanguage] = useState<string>('Hindi');

  const [translationResult, setTranslationResult] = useState<TextbookTranslationResult | null>(null);
  const [, setSavedLessons] = useState<TextbookTranslationResult[]>([]);

  // Speech Translation states
  const [spokenPrompt, setSpokenPrompt] = useState<string>('बच्चों, अपनी किताबें खोलो और पृष्ठ संख्या पाँच पर ध्यान दो।');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeechTranslating, setIsSpeechTranslating] = useState<boolean>(false);
  const [speechResult, setSpeechResult] = useState<{
    translation: string;
    phoneticScript: string;
    teacherNote: string;
  } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Initialize demo data from sample on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __SELECTED_LANGUAGE_ID?: string }).__SELECTED_LANGUAGE_ID = selectedLanguageId;
    }

    // Pre-populate with initial educational payload
    setTranslationResult({
      extractedSourceText: SAMPLE_LESSONS[0].hindiText,
      translatedText: 'ᱫᱟᱜ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱡᱤᱣᱤ ᱨᱮᱭᱟᱜ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ ᱠᱟᱱᱟ (Daag do abowag jiwi reyag buniyaad kana)᱾ ᱫᱟᱜ ᱫᱚ ᱵᱟᱝ ᱠᱷᱟᱨᱟᱵᱽ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱠᱩᱸᱧ, ᱜᱟᱰᱟ ᱟᱨ ᱵᱟᱣᱲᱤ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱥᱤᱨᱡᱚᱱ ᱫᱟᱜ ᱡᱷᱟᱨᱱᱟ ᱠᱟᱱᱟ᱾',
      romanizedText: 'Daag do abowag jiwi reyag buniyaad kana. Daag do baang kharab laktiya. Kunj, gada aar bawdi do abowag sirjon daag jharna kana.',
      targetLanguage: 'Santhali',
      sourceLanguage: 'Hindi',
      pedagogicalSummary: 'Students learn water conservation using indigenous Santal traditional water harvest methods (bandh and jhora).',
      vocabulary: [
        { term: 'जल (Jal)', transliteration: 'ᱫᱟᱜ (Daag)', translation: 'Water', meaning: 'The elixir essential for humans, crops, and sacred groves (Jaher Than).' },
        { term: 'जीवन (Jeevan)', transliteration: 'ᱡᱤᱣᱤ (Jiwi)', translation: 'Life / Spirit', meaning: 'Breathing vitality in all living beings.' },
        { term: 'नदियाँ (Nadiyan)', transliteration: 'ᱜᱟᱰᱟ (Gada)', translation: 'Rivers', meaning: 'Living seasonal and perennial streams flowing from the hills.' },
        { term: 'प्राकृतिक स्रोत (Prakritik Srot)', transliteration: 'ᱥᱤᱨᱡᱚᱱ ᱡᱷᱟᱨᱱᱟ (Sirjon Jharna)', translation: 'Natural Spring', meaning: 'Untouched forest springs providing clean drinking water.' },
      ],
      teachingAids: [
        'Use clay cups or local leaf plates (patravali) to explain measuring water volume.',
        'Draw a traditional village pond diagram with sand and stones in the courtyard.',
        'Encourage students to sing a folk rain chant (Daha Sereng) together.'
      ],
      culturalAnalogies: 'In tribal communities, community ponds (Pukhri) and forest springs (Dharis) are sacred public goods guarded by village elders (Manjhi Haram). Explain how preserving water today ensures green forests for tomorrow.'
    });
  }, [selectedLanguageId]);

  const handleSpeechTranslate = async () => {
    if (!spokenPrompt.trim()) return;
    setIsSpeechTranslating(true);
    try {
      const res = await translateBilingualSpeech(spokenPrompt, selectedLanguage, sourceLanguage);
      setSpeechResult(res);
    } catch (err) {
      console.error('Speech translation failed:', err);
    } finally {
      setIsSpeechTranslating(false);
    }
  };

  const handlePlayAudio = async (textToSpeak: string) => {
    setIsPlayingAudio(true);
    try {
      await playIndianLanguageAudio(textToSpeak, selectedLanguage);
    } catch (e) {
      console.warn('Playback error:', e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const currentLangMeta = LANGUAGES.find((l) => l.name === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Vidyavaradhi <span className="text-amber-400 font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">विद्यावारधि</span>
              </h1>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Offline Tribal & Pan-Indian Pedagogy
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Hindi to 22+ Scheduled Indian Languages & Indigenous Dialects for Primary Classrooms
            </p>
          </div>
        </div>

        {/* Global Controls & Language Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl p-1 text-xs">
            <span className="px-2.5 py-1 text-slate-400 font-medium">Source:</span>
            <span className="px-2.5 py-1 bg-slate-700 rounded-lg text-amber-300 font-semibold">Hindi (हिन्दी)</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <optgroup label="Indigenous Tribal Languages">
                {LANGUAGES.filter((l) => l.family === 'Tribal Indigenous').map((l) => (
                  <option key={l.code} value={l.name} className="bg-slate-900 text-slate-100">
                    {l.name} ({l.nativeName}) - {l.script}
                  </option>
                ))}
              </optgroup>
              <optgroup label="22 Scheduled Languages">
                {LANGUAGES.filter((l) => l.family === 'Scheduled 8th Schedule').map((l) => (
                  <option key={l.code} value={l.name} className="bg-slate-900 text-slate-100">
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Region: {currentLangMeta.region}</span>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setCurrentTab('textbook-upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'textbook-upload'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Textbook Page Translatron
          </button>
          <button
            onClick={() => setCurrentTab('speech')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'speech'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Live Classroom Voice Engine
          </button>
          <button
            onClick={() => setCurrentTab('dictionary')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'dictionary'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Offline Vocabulary & Flashcards ({translationResult?.vocabulary?.length || 0})
          </button>
          <button
            onClick={() => setCurrentTab('pedagogy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'pedagogy'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Tribal Pedagogy Framework
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Engine: Gemini 3.8 Bilingual Multimodal</span>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {currentTab === 'textbook-upload' && <TextbookUploadView selectedLanguageId="{selectedLanguageId}"/>}

        {/* TAB 2: LIVE CLASSROOM VOICE ENGINE */}
        {currentTab === 'speech' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    Bilingual Voice Translation for Teachers
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speak or enter Hindi classroom instructions to pronounce them in {selectedLanguage}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Mother Tongue</span>
                  <span className="text-xs font-bold text-amber-300">{selectedLanguage}</span>
                </div>
              </div>

              {/* Spoken Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Teacher Spoken Command (Hindi):
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={spokenPrompt}
                    onChange={(e) => setSpokenPrompt(e.target.value)}
                    placeholder="जैसे: बच्चों, आज हम नदियों और वनों के बारे में पढ़ेंगे..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                        const SpeechRecognition = (window as unknown as { SpeechRecognition: unknown; webkitSpeechRecognition: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;
                        // @ts-ignore
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'hi-IN';
                        recognition.onstart = () => setIsRecording(true);
                        recognition.onend = () => setIsRecording(false);
                        // @ts-ignore
                        recognition.onresult = (event) => {
                          const transcript = event.results[0][0].transcript;
                          setSpokenPrompt(transcript);
                        };
                        recognition.start();
                      } else {
                        alert('Speech recognition is not supported in this browser. Please type the instruction.');
                      }
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg border transition-all ${
                      isRecording
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Click to speak in Hindi"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Classroom Phrases Chips */}
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                  Frequently Used Rural Classroom Phrases:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'सभी बच्चे चुप हो जाएँ और यहाँ देखें।',
                    'क्या सबको यह पाठ समझ में आया?',
                    'अपनी-अपनी कॉपियों में तीन तक गिनती लिखो।',
                    'हाथ धोकर मध्याह्न भोजन (Mid-Day Meal) की पंक्ति में आओ।',
                  ].map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => setSpokenPrompt(phrase)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60 transition-colors"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translate Action */}
              <button
                onClick={handleSpeechTranslate}
                disabled={isSpeechTranslating}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isSpeechTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Phonetic Speech in {selectedLanguage}...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    Translate Spoken Instruction
                  </>
                )}
              </button>

              {/* Translation Output Card */}
              {speechResult && (
                <div className="mt-6 bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Teacher Guide & Pronunciation Helper
                    </span>
                    <button
                      onClick={() => handlePlayAudio(speechResult.translation)}
                      disabled={isPlayingAudio}
                      className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Speaking...' : 'Play Audio'}</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">
                      Native Script ({selectedLanguage})
                    </span>
                    <p className="text-base font-serif text-white font-semibold mt-1">
                      {speechResult.translation}
                    </p>
                  </div>

                  {speechResult.phoneticScript && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-mono">
                        Phonetic Reading Guide for Non-Native Teachers
                      </span>
                      <p className="text-xs font-mono text-amber-200 mt-1">
                        {speechResult.phoneticScript}
                      </p>
                    </div>
                  )}

                  {speechResult.teacherNote && (
                    <p className="text-[11px] text-slate-400 italic">
                      💡 Tip for Teacher: {speechResult.teacherNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFLINE VOCABULARY & FLASHCARDS */}
        {currentTab === 'dictionary' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  Offline Bilingual Flashcards & Lexicon
                </h2>
                <p className="text-xs text-slate-400">
                  Cached vocabulary for multigrade primary classrooms without cellular connectivity
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filtered by:</span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-amber-300">
                  {selectedLanguage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {translationResult?.vocabulary?.map((vocab, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-md group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-bold text-white">{vocab.term}</span>
                      <button
                        onClick={() => handlePlayAudio(vocab.transliteration)}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Pronounce"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg px-2.5 py-1.5 my-2">
                      <span className="text-[10px] text-amber-400 font-mono block">Mother Tongue</span>
                      <span className="text-sm font-serif font-semibold text-amber-200">{vocab.transliteration}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium">
                      Mean: {vocab.translation}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-3">
                      {vocab.meaning}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5 mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Vidyavaradhi Lexicon</span>
                    <span className="text-emerald-400 font-mono">Offline Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PEDAGOGY FRAMEWORK */}
        {currentTab === 'pedagogy' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-widest">
                  Mother-Tongue Based Multilingual Education (MTB-MLE)
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  National Education Policy (NEP 2020) Indigenous Pedagogy Architecture
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Bridging the gap between tribal children's home language and school textbook language
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Ol Chiki & Indigenous Scripts</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Santhali utilizes the Ol Chiki script developed by Pandit Raghunath Murmu. Our engine renders both authentic glyphs and phonetic Roman/Devanagari keys.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Cultural Anchor Pedagogies</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Abstract arithmetic and natural sciences are grounded in familiar forest ecologies, sacred groves (Sarna/Jaher), and seasonal harvest cycles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Non-Native Teacher Enabler</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Government school teachers assigned to scheduled tribal areas can pronounce local greetings, mathematical terms, and hygiene instructions accurately.
                  </p>
                </div>
              </div>

              {/* Supported Languages Matrix */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Covered Indigenous & Scheduled Linguistic Communities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setCurrentTab('textbook-upload');
                      }}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-200 block text-[11px]">{lang.name}</span>
                        <span className="text-[10px] text-amber-400 font-serif">{lang.nativeName}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">{lang.script.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Vidyavaradhi Pedagogy Engine</span>
          <span>•</span>
          <span>Bilingual Primary Education for 22+ Scheduled & Indigenous Languages</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-600">Zero 'process.env' Crash Safe</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Gemini 3.8 Bilingual Vision & Speech</span>
        </div>
      </footer>
    </div>
  );
}
