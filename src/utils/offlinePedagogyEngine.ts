/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpeechTranslationResult {
  translation: string;
  phoneticScript: string;
  teacherNote: string;
}

export interface TextbookPedagogyResult {
  extractedSourceText: string;
  translatedText: string;
  romanizedText: string;
  targetLanguage: string;
  sourceLanguage: string;
  pedagogicalSummary: string;
  vocabulary: Array<{
    term: string;
    transliteration: string;
    translation: string;
    meaning: string;
    exampleSentence?: string;
  }>;
  teachingAids: string[];
  culturalAnalogies: string;
}

/**
 * Offline-first translation database for common primary classroom pedagogical commands and dialogue.
 */
const CLASSROOM_PHRASE_DICTIONARY: Record<
  string,
  Record<
    string,
    {
      translation: string;
      phonetic: string;
      note: string;
    }
  >
> = {
  // Phrase 1: Open books to page 5
  books_page_5: {
    Santhali: {
      translation: 'ᱜᱤᱫᱽᱨᱟᱹ, ᱟᱯᱮᱭᱟᱜ ᱯᱩᱛᱷᱤ ᱠᱷᱩᱞᱟᱹᱣ ᱢᱮ ᱟᱨ ᱥᱟᱦᱴᱟ ᱢᱚᱬᱮ ᱨᱮ ᱫᱷᱮᱭᱟᱱ ᱮᱢ ᱢᱮ᱾',
      phonetic: 'Gidra, apeyag puthi khulaw me aar sahta mone re dhiyan em me.',
      note: 'Hold up page 5 in your textbook so children can visually match the illustration.',
    },
    Gondi: {
      translation: 'पिलेर, मीवा पोथी उखेड़ा अते पान पाँच ते ध्यान सीम।',
      phonetic: 'Piler, meewa pothi ukheda ate paan paanch te dhyan seem.',
      note: 'Point to the numeral 5 on the blackboard while pronouncing the phrase.',
    },
    Ho: {
      translation: 'ᱦᱚᱯᱚᱱ ᱠᱚ, ᱟᱯᱮᱭᱟᱜ ᱯᱩᱛᱷᱤ ᱠᱩᱞᱟᱹᱭ ᱯᱮ ᱟᱨ ᱥᱟᱠᱟᱢ ᱢᱚᱬᱮ ᱨᱮ ᱱᱮᱞ ᱯᱮ᱾',
      phonetic: 'Hopon ko, apeyag puthi kulay pe aar sakam mone re nel pe.',
      note: 'Use a gentle rising tone to keep the attention of young learners.',
    },
    Mundari: {
      translation: 'ᱦᱚᱯᱚᱱ ᱠᱚ, ᱟᱯᱮᱭᱟᱜ ᱠᱤᱛᱟᱹᱵᱽ ᱠᱩᱞᱟᱹᱭ ᱯᱮ ᱟᱨ ᱯᱟᱱᱟ ᱢᱚᱬᱮ ᱨᱮ ᱫᱷᱮᱭᱟᱱ ᱮᱢ ᱯᱮ᱾',
      phonetic: 'Hopon ko, apeyag kitab kulay pe aar paana mone re dhyan em pe.',
      note: 'Allow students 15 seconds to locate the page with their peer partners.',
    },
    Bodo: {
      translation: "गथ'फोर, नोंसोरनि बिजाबखौ खुलि आरो बिलाइ बा याव गोसो हो।",
      phonetic: "Goth'for, nonsorni bijabkhou khuli aro bilai ba yaw goso ho.",
      note: 'Smile warmly and encourage children to help their desk partners.',
    },
    Odia: {
      translation: 'ପିଲାମାନେ, ନିଜ ବହି ଖୋଲ ଏବଂ ପୃଷ୍ଠା ପାଞ୍ଚକୁ ଧ୍ୟାନ ଦିଅ।',
      phonetic: 'Pilamane, nija bahi khola ebam prushta paanchaku dhyana dia.',
      note: 'Ensure all students are on the correct page before starting reading.',
    },
    Bengali: {
      translation: 'বাচ্চারা, তোমাদের বই খোল এবং পাঁচ নম্বর পৃষ্ঠায় মনোযোগ দাও।',
      phonetic: 'Bacchara, tomader boi kholo ebong paach nombor prishtay monojog dao.',
      note: 'Encourage students to follow lines with their index finger.',
    },
    Telugu: {
      translation: 'పిల్లలు, మీ పుస్తకాలు తెరవండి మరియు ఐదవ పేజీపై దృష్టి పెట్టండి.',
      phonetic: 'Pillalu, mee pustakalu teravandi mariyu aidava pagepai drushti pettandi.',
      note: 'Encourage children to follow along by tracing the printed letters.',
    },
  },

  // Phrase 2: All children please be quiet and look here
  quiet_look_here: {
    Santhali: {
      translation: 'ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱯᱮ ᱟᱨ ᱱᱚᱸᱰᱮ ᱠᱚᱭᱚᱜᱽ ᱯᱮ᱾',
      phonetic: 'Joto gidra thir tahen pe aar nonde koyog pe.',
      note: 'Raise a single palm gently rather than shouting to regain attention.',
    },
    Gondi: {
      translation: 'सब्बोर पिलेर गुप्प वाटा अते इगा चूड़ा।',
      phonetic: 'Sabbor piler gupp vaata ate iga chooda.',
      note: 'Use eye contact and a low, calm voice to soothe noisy learners.',
    },
    Ho: {
      translation: 'ᱥᱚᱵᱮ ᱦᱚᱯᱚᱱ ᱠᱚ ᱛᱷᱤᱨ ᱞᱮᱱ ᱯᱮ ᱟᱨ ᱱᱮᱸᱫᱟ ᱱᱮᱞ ᱯᱮ᱾',
      phonetic: 'Sobe hopon ko thir len pe aar nenda nel pe.',
      note: 'Tap twice gently on the blackboard frame to draw focus.',
    },
    Mundari: {
      translation: 'ᱥᱚᱵᱮᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱯᱮ ᱟᱨ ᱱᱮᱸᱛᱟ ᱱᱮᱞ ᱯᱮ᱾',
      phonetic: 'Soben gidra thir tahen pe aar nenta nel pe.',
      note: 'Pause for 3 seconds after speaking the phrase for silence to set in.',
    },
    Bodo: {
      translation: "गासै गथ'फोरा सिरि था आरो बेयाव नाय।",
      phonetic: "Gasai goth'fora siri tha aro beyaw nai.",
      note: 'Praise the first row that becomes quiet to motivate others.',
    },
  },

  // Phrase 3: Did everyone understand this lesson?
  understood_lesson: {
    Santhali: {
      translation: 'ᱪᱮᱫ ᱡᱚᱛᱚ ᱦᱚᱲ ᱱᱚᱣᱟ ᱯᱟᱲᱦᱟᱣ ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ?',
      phonetic: 'Ched joto hor nowa parhaw bujhaw ena?',
      note: 'Ask for thumbs-up or thumbs-down signs so shy children can answer comfortably.',
    },
    Gondi: {
      translation: 'बती सब्बोरकुन ईद पाठ समझ मातु?',
      phonetic: 'Bati sabbor-kun eed path samajh maatu?',
      note: 'Invite one confident student to explain the core idea in mother tongue.',
    },
    Ho: {
      translation: 'ᱪᱮᱫ ᱥᱚᱵᱮ ᱠᱚ ᱱᱮᱱ ᱯᱟᱲᱦᱟᱣ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱟ?',
      phonetic: 'Ched sobe ko nen parhaw bujhaw keda?',
      note: 'Re-explain key words if any child tilts their head uncertainly.',
    },
    Mundari: {
      translation: 'ᱪᱮᱫ ᱥᱚᱵᱮᱱ ᱦᱚᱲ ᱱᱮᱱ ᱯᱟᱲᱦᱟᱣ ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ?',
      phonetic: 'Ched soben hor nen parhaw bujhaw ena?',
      note: 'Celebrate curiosity by encouraging students to ask any question.',
    },
    Bodo: {
      translation: "गासैयाबो बे फराखौ बुजिना मोनबाय ना?",
      phonetic: "Gasaiyabo be forakhou bujina monbai na?",
      note: 'Ask a quick checking question rather than just accepting a nod.',
    },
  },

  // Phrase 4: Write numbers up to 3
  write_numbers: {
    Santhali: {
      translation: 'ᱟᱯᱱᱟᱨ ᱠᱷᱟᱛᱟ ᱨᱮ ᱯᱮ (᱑, ᱒, ᱓) ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱚᱞ ᱯᱮ᱾',
      phonetic: 'Apnar khata re pe (mid, bar, pe - 1, 2, 3) habij lekha ol pe.',
      note: 'Draw 3 mangoes or trees on the board to illustrate quantity alongside numerals.',
    },
    Gondi: {
      translation: 'मीवा कापी ते मूंद (उंदी, रंड, मूंद) ताका गिनती लहा।',
      phonetic: 'Meewa copy te moond (undi, rand, moond - 1, 2, 3) taka ginti laha.',
      note: 'Have students tap their fingers 3 times while chanting the numbers.',
    },
    Ho: {
      translation: "ᱟᱯᱮᱭᱟᱜ ᱠᱟᱯᱤ ᱨᱮ ᱟᱯᱤ (ᱢᱤ', ᱵᱟᱨ, ᱟᱯᱤ) ᱡᱟᱹᱠᱮᱫ ᱞᱮᱠᱷᱟ ᱚᱞ ᱯᱮ᱾",
      phonetic: "Apeyag copy re api (mi, bar, api - 1, 2, 3) jaked lekha ol pe.",
      note: 'Use pebbles or tamarind seeds on desks for tactile counting.',
    },
    Bodo: {
      translation: 'नोंसोरनि खातायाव थाम (से, नै, थाम) सिम सानजिमा लिर।',
      phonetic: 'Nonsorni khatayaw tham (se, noi, tham - 1, 2, 3) sim sanjima lir.',
      note: 'Guide finger grip on pencils while moving around the benches.',
    },
  },

  // Phrase 5: Wash hands and line up for mid-day meal
  mid_day_meal: {
    Santhali: {
      translation: 'ᱛᱤ ᱟᱹᱨᱩᱵ ᱠᱟᱛᱮ ᱛᱤᱠᱤᱱ ᱡᱚᱢᱟ (Mid-Day Meal) ᱞᱟᱹᱭᱤᱱ ᱨᱮ ᱦᱤᱡᱩᱜ ᱯᱮ᱾',
      phonetic: 'Ti aarub kate tikin joma line re hijug pe.',
      note: 'Sing a 20-second hand-washing rhyming verse to reinforce hygiene.',
    },
    Gondi: {
      translation: 'कई नोड़े कीसी मध्याह्न भोजन ता लाइन ते वारा।',
      phonetic: 'Kai nodey keesi madhyahn bhojan ta line te vaara.',
      note: 'Designate student line-captains to ensure orderly queuing.',
    },
    Ho: {
      translation: 'ᱛᱤ ᱟᱹᱵᱩ ᱠᱮᱛᱮ ᱢᱤᱰ-ᱰᱮ ᱢᱤᱞ ᱛᱟᱹᱨᱤ ᱨᱮ ᱦᱤᱡᱩᱜ ᱯᱮ᱾',
      phonetic: 'Ti aabu kete mid-day meal line re hijug pe.',
      note: 'Encourage polite hand-to-chest gratitude gesture before eating.',
    },
    Bodo: {
      translation: 'आखाब सुनानै सानजौफुनि संनाय जामुंनि सारियाव फै।',
      phonetic: 'Akhab sunanai sanjoufuni songnay jamungni sariyaw foi.',
      note: 'Ensure clean drinking water tumblers are set up before the meal starts.',
    },
  },
};

/**
 * Resolves an authentic classroom speech translation with script, romanization, and pedagogy note.
 */
export function getOfflineSpeechTranslation(
  spokenText: string,
  targetLanguage: string,
  _sourceLanguage = 'Hindi'
): SpeechTranslationResult {
  const norm = spokenText.toLowerCase().trim();

  let phraseKey = '';
  if (norm.includes('किताब') || norm.includes('पृष्ठ') || norm.includes('खोलो') || norm.includes('पांच') || norm.includes('५')) {
    phraseKey = 'books_page_5';
  } else if (norm.includes('चुप') || norm.includes('शांत') || norm.includes('यहाँ देख') || norm.includes('ध्यान')) {
    phraseKey = 'quiet_look_here';
  } else if (norm.includes('समझ') || norm.includes('पाठ') || norm.includes('मालूम')) {
    phraseKey = 'understood_lesson';
  } else if (norm.includes('गिनती') || norm.includes('गिन') || norm.includes('तीन') || norm.includes('कॉपी')) {
    phraseKey = 'write_numbers';
  } else if (norm.includes('हाथ') || norm.includes('भोजन') || norm.includes('खाना') || norm.includes('पंक्ति') || norm.includes('लाइन')) {
    phraseKey = 'mid_day_meal';
  }

  // Lookup in predefined dictionary
  if (phraseKey && CLASSROOM_PHRASE_DICTIONARY[phraseKey]) {
    const langDict = CLASSROOM_PHRASE_DICTIONARY[phraseKey];
    if (langDict[targetLanguage]) {
      const match = langDict[targetLanguage];
      return {
        translation: match.translation,
        phoneticScript: match.phonetic,
        teacherNote: match.note,
      };
    }
    // Fallback to Santhali if specific language not in dict entry
    if (langDict.Santhali) {
      const match = langDict.Santhali;
      return {
        translation: match.translation,
        phoneticScript: match.phonetic,
        teacherNote: match.note,
      };
    }
  }

  // Generic dynamic adaptation for custom teacher speech
  const greetings: Record<string, { trans: string; phon: string }> = {
    Santhali: { trans: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', phon: 'Johar gidra ko' },
    Gondi: { trans: 'सेवा जोहार पिलेर', phon: 'Seva johar piler' },
    Ho: { trans: 'ᱡᱚᱦᱟᱨ ᱦᱚᱯᱚᱱ ᱠᱚ', phon: 'Johar hopon ko' },
    Mundari: { trans: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', phon: 'Johar gidra ko' },
    Bodo: { trans: 'खुलुमबाय गथफोर', phon: 'Khulumbai gothofor' },
    Odia: { trans: 'ନମସ୍କାର ପିଲାମାନେ', phon: 'Namaskar pilamane' },
    Bengali: { trans: 'নমস্কার বাচ্চারা', phon: 'Nomoshkar bacchara' },
    Telugu: { trans: 'నమస్కారం పిల్లలు', phon: 'Namaskaram pillalu' },
    Marathi: { trans: 'नमस्कार मुलांनो', phon: 'Namaskar mulanno' },
  };

  const greeting = greetings[targetLanguage] || { trans: `[${targetLanguage}] ${spokenText}`, phon: spokenText };

  return {
    translation: `${greeting.trans}: ${spokenText}`,
    phoneticScript: `${greeting.phon} (${targetLanguage} classroom guide for non-native educators)`,
    teacherNote: 'Speak in a calm, welcoming tone and gesture towards visual classroom posters to support comprehension.',
  };
}

/**
 * Offline-first textbook page pedagogy breakdown.
 */
export function getOfflineTextbookPedagogy(
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  gradeLevel = 'Primary (Classes 1-5)'
): TextbookPedagogyResult {
  return {
    extractedSourceText:
      'जल हमारे जीवन का आधार है। हमें पानी को व्यर्थ नहीं बहाना चाहिए। कुएं, नदियाँ और बावड़ियां हमारे प्राकृतिक जल स्रोत हैं। पेड़ वर्षा लाते हैं और मिट्टी को बांधते हैं।',
    translatedText:
      'ᱫᱟᱜ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱡᱤᱣᱤ ᱨᱮᱭᱟᱜ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ ᱠᱟᱱᱟ᱾ ᱫᱟᱜ ᱫᱚ ᱵᱟᱝ ᱠᱷᱟᱨᱟᱵᱽ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱠᱩᱸᱧ, ᱜᱟᱰᱟ ᱟᱨ ᱵᱟᱣᱲᱤ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱥᱤᱨᱡᱚᱱ ᱫᱟᱜ ᱡᱷᱟᱨᱱᱟ ᱠᱟᱱᱟ᱾ ᱫᱟᱨᱮ ᱫᱚ ᱫᱟᱜ-ᱡᱟᱹᱲᱤ ᱟᱹᱜᱩᱭᱟ ᱟᱨ ᱦᱟᱥᱟ ᱫᱚᱦᱚᱭᱟ᱾',
    romanizedText:
      'Daag do abowag jiwi reyag buniyaad kana. Daag do baang kharab laktiya. Kunj, gada aar bawdi do abowag sirjon daag jharna kana. Dare do daag-jadi aaguya aar hasa dohoya.',
    targetLanguage,
    sourceLanguage,
    pedagogicalSummary: `Primary bilingual module adapted for ${gradeLevel} students, linking core environmental concepts with indigenous village conservation knowledge.`,
    vocabulary: [
      {
        term: 'जल / पानी (Jal / Paani)',
        transliteration: 'ᱫᱟᱜ (Daag)',
        translation: 'Water',
        meaning: 'Life-sustaining water from perennial mountain springs and community ponds.',
        exampleSentence: 'ᱫᱟᱜ ᱫᱚ ᱡᱤᱣᱤ ᱠᱟᱱᱟ (Water is life).',
      },
      {
        term: 'जीवन (Jeevan)',
        transliteration: 'ᱡᱤᱣᱤ (Jiwi)',
        translation: 'Life / Spirit',
        meaning: 'Breath and vitality shared across plants, animals, and children.',
        exampleSentence: 'ᱟᱵᱚᱣᱟᱜ ᱡᱤᱣᱤ ᱫᱟᱨᱮ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾',
      },
      {
        term: 'नदियाँ (Nadiyan)',
        transliteration: 'ᱜᱟᱰᱟ (Gada)',
        translation: 'Rivers / Streams',
        meaning: 'Flowing forest water bodies that nourish village paddy terraces.',
        exampleSentence: 'ᱜᱟᱰᱟ ᱨᱮ ᱫᱟᱜ ᱞᱤᱸᱜᱤᱱ ᱠᱟᱱᱟ᱾',
      },
      {
        term: 'प्राकृतिक स्रोत (Prakritik Srot)',
        transliteration: 'ᱥᱤᱨᱡᱚᱱ ᱡᱷᱟᱨᱱᱟ (Sirjon Jharna)',
        translation: 'Natural Spring',
        meaning: 'Pure mountain springs and sacred streams safeguarded by elders.',
        exampleSentence: 'ᱡᱷᱟᱨᱱᱟ ᱫᱟᱜ ᱫᱚ ᱥᱟᱯᱷᱟ ᱜᱮᱭᱟ᱾',
      },
    ],
    teachingAids: [
      'Take students to observe rain puddles or clay drinking pots to explain liquid volume and conservation.',
      'Use dried seeds (sal/tamarind) and small stones for counting water streams and trees.',
      'Engage learners with traditional folk rain chants (Daha Sereng) in mother tongue.',
    ],
    culturalAnalogies:
      'In tribal communities, village ponds (Pukhri) and mountain springs (Dharis) are sacred community treasures. Teach children how their ancestors protected watershed groves (Jaher Than / Sarna) to ensure perennial water.',
  };
}
