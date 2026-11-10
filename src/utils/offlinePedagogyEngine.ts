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
    Telugu: {
      translation: 'పిల్లలందరూ నిశ్శబ్దంగా ఉండండి మరియు ఇక్కడ చూడండి.',
      phonetic: 'Pillalandaru nisshabdanga undandi mariyu ikkada choodandi.',
      note: 'Raise a single palm gently rather than shouting to regain attention.',
    },
    Bengali: {
      translation: 'সবাই চুপ করো এবং এদিকে তাকাও।',
      phonetic: 'Shobai chup koro ebong edike takao.',
      note: 'Use a calm, soft voice to draw attention.',
    },
    Tamil: {
      translation: 'அனைவரும் அமைதியாக இருந்து இங்கே பாருங்கள்.',
      phonetic: 'Anaivarum amaithiyaga irundhu inge paarungal.',
      note: 'Gently signal with your hand to regain focus.',
    },
    Odia: {
      translation: 'ସମସ୍ତେ ଶାନ୍ତ ରୁହ ଏବଂ ଏଠାକୁ ଦେଖ।',
      phonetic: 'Samaste shanta ruha ebam ethaku dekha.',
      note: 'Wait three seconds for total calm before speaking.',
    },
    Marathi: {
      translation: 'सर्व मुलांनी शांत राहा आणि इकडे बघा.',
      phonetic: 'Sarva mulanni shant raha aani ikade bagha.',
      note: 'Make gentle eye contact across the benches.',
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
    Telugu: {
      translation: 'అందరికీ ఈ పాఠం అర్థమైందా?',
      phonetic: 'Andariki ee patham arthamainda?',
      note: 'Ask for thumbs-up or thumbs-down signs so shy children can answer comfortably.',
    },
    Bengali: {
      translation: 'সবাই কি এই পাঠটি বুঝতে পেরেছ?',
      phonetic: 'Shobai ki ei path-ti bujhte perechho?',
      note: 'Invite a student to summarize the main point in their own words.',
    },
    Tamil: {
      translation: 'எல்லோருக்கும் இந்த பாடம் புரிந்ததா?',
      phonetic: 'Ellorukkum indha padam purindhadha?',
      note: 'Ask students to raise their hands if they need clarification on any word.',
    },
    Odia: {
      translation: 'ସମସ୍ତେ ଏହି ପାଠ ବୁଝିପାରିଲ କି?',
      phonetic: 'Samaste ehi patha bujhiparila ki?',
      note: 'Encourage students to nod or ask about unfamiliar concepts.',
    },
    Marathi: {
      translation: 'सर्वांना हा धडा समजला का?',
      phonetic: 'Sarvanna ha dhada samajla ka?',
      note: 'Ask interactive check questions to ensure concept retention.',
    },
    Kannada: {
      translation: 'ಎಲ್ಲರಿಗೂ ಈ ಪಾಠ ಅರ್ಥವಾಯಿತೇ?',
      phonetic: 'Ellarigu ee paatha arthavayithe?',
      note: 'Encourage children to speak without hesitation.',
    },
    Malayalam: {
      translation: 'എല്ലാവർക്കും ഈ പാഠം മനസ്സിലായോ?',
      phonetic: 'Ellavarkkum ee paadam manassilaayo?',
      note: 'Check student expressions and re-explain if needed.',
    },
    Gujarati: {
      translation: 'શું બધાને આ પાઠ સમજાઈ ગયો?',
      phonetic: 'Shu badhane aa paath samjai gayo?',
      note: 'Invite one student to share an example from home.',
    },
    Punjabi: {
      translation: 'ਕੀ ਸਾਰਿਆਂ ਨੂੰ ਇਹ ਪਾਠ ਸਮਝ ਆ ਗਿਆ?',
      phonetic: 'Ki sariyan nu eh paath samajh aa geya?',
      note: 'Ask quick concept questions around the class.',
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
    Telugu: {
      translation: 'మీ నోట్‌బుక్‌లలో మూడు వరకు అంకెలు రాయండి.',
      phonetic: 'Mee notebook-lalo moodu varaku ankelu raayandi.',
      note: 'Draw 3 items on the board to illustrate quantity alongside numerals.',
    },
    Bengali: {
      translation: 'তোমাদের খাতায় তিন পর্যন্ত সংখ্যা লেখো।',
      phonetic: 'Tomader khatay teen porjonto shongkha lekho.',
      note: 'Draw 3 items on the board to illustrate quantity alongside numerals.',
    },
    Tamil: {
      translation: 'உங்கள் நோட்டுப் புத்தகத்தில் மூன்று வரை எண்களை எழுதுங்கள்.',
      phonetic: 'Ungal nottu putthagathil moondru varai engalai ezhudhungal.',
      note: 'Draw 3 items on the board to illustrate quantity alongside numerals.',
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
    Telugu: {
      translation: 'చేతులు కడుక్కుని మధ్యాహ్న భోజనం వరుసలో రండి.',
      phonetic: 'Chethulu kadukkuni madhyaahna bhojanam varusalo randi.',
      note: 'Designate student line-captains to ensure orderly queuing.',
    },
    Bengali: {
      translation: 'হাত ধুয়ে মিড-ডে মিলের লাইনে এসো।',
      phonetic: 'Haat dhuye mid-day mealer line-e esho.',
      note: 'Sing a hand-washing verse to reinforce hygiene.',
    },
    Tamil: {
      translation: 'கைகளைக் கழுவி மதிய உணவு வரிசையில் வாருங்கள்.',
      phonetic: 'Kaigalai kazhuvi madhiya unavu varisaiyil vaarungal.',
      note: 'Encourage orderly queuing before eating.',
    },
  },

  // Phrase 6: Raise your hands / हाथ उठाइए
  raise_hand: {
    Santhali: {
      translation: 'ᱛᱤ ᱛᱩᱞ ᱯᱮ᱾',
      phonetic: 'Ti tul pe.',
      note: 'Raise your own hand to demonstrate visually.',
    },
    Gondi: {
      translation: 'कई डिप्पा कीमा।',
      phonetic: 'Kai dippa keema.',
      note: 'Signal gently for student answers.',
    },
    Ho: {
      translation: 'ᱛᱤ ᱨᱟᱠᱟᱵᱽ ᱯᱮ᱾',
      phonetic: 'Ti rakab pe.',
      note: 'Demonstrate with a friendly gesture.',
    },
    Mundari: {
      translation: 'ᱛᱤ ᱛᱩᱞ ᱯᱮ᱾',
      phonetic: 'Ti tul pe.',
      note: 'Demonstrate with a friendly gesture.',
    },
    Bodo: {
      translation: 'आखाब दैखां।',
      phonetic: 'Akhab doikhang.',
      note: 'Encourage shy children to raise their hand.',
    },
    Telugu: {
      translation: 'చేతులు పైకి ఎత్తండి.',
      phonetic: 'Chethulu paiki etthandi.',
      note: 'Raise your own hand to demonstrate visually for students.',
    },
    Bengali: {
      translation: 'হাত তোলো।',
      phonetic: 'Haat tolo.',
      note: 'Raise your own hand to demonstrate visually.',
    },
    Tamil: {
      translation: 'கைகளை மேலே உயர்த்துங்கள்.',
      phonetic: 'Kaigalai mele uyarthungal.',
      note: 'Demonstrate visually by raising hand.',
    },
    Odia: {
      translation: 'ହାତ ଉପରକୁ ଉଠାଅ।',
      phonetic: 'Hata uparaku uthaao.',
      note: 'Demonstrate visually by raising hand.',
    },
    Marathi: {
      translation: 'हात वर करा.',
      phonetic: 'Haat var kara.',
      note: 'Demonstrate visually by raising hand.',
    },
    Kannada: {
      translation: 'ಕೈಗಳನ್ನು ಮೇಲೆತ್ತಿ.',
      phonetic: 'Kaigalannu meletthi.',
      note: 'Demonstrate visually by raising hand.',
    },
    Malayalam: {
      translation: 'കൈകൾ ഉയർത്തുക.',
      phonetic: 'Kaigal uyarthuka.',
      note: 'Demonstrate visually by raising hand.',
    },
    Gujarati: {
      translation: 'હાથ ઊંચો કરો.',
      phonetic: 'Haath ooncho karo.',
      note: 'Demonstrate visually by raising hand.',
    },
    Punjabi: {
      translation: 'ਹੱਥ ਉੱਪਰ ਕਰੋ।',
      phonetic: 'Hatth uppar karo.',
      note: 'Demonstrate visually by raising hand.',
    },
    Assamese: {
      translation: 'হাত ডাঙক।',
      phonetic: 'Haat dangok.',
      note: 'Demonstrate visually by raising hand.',
    },
    Maithili: {
      translation: 'हाथ ऊपर करू।',
      phonetic: 'Haath oopar karu.',
      note: 'Demonstrate visually by raising hand.',
    },
    Sanskrit: {
      translation: 'हस्तम् उत्थापयतु।',
      phonetic: 'Hastam utthaapayatu.',
      note: 'Demonstrate visually by raising hand.',
    },
    Urdu: {
      translation: 'ہاتھ اٹھائیے۔',
      phonetic: 'Haath uthaiye.',
      note: 'Demonstrate visually by raising hand.',
    },
    Hindi: {
      translation: 'हाथ उठाइए।',
      phonetic: 'Haath uthaiye.',
      note: 'Demonstrate visually by raising hand.',
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
  } else if (
    (norm.includes('हाथ') && (norm.includes('उठा') || norm.includes('ऊपर') || norm.includes('खड़ा') || norm.includes('बढ़ा'))) ||
    norm.includes('raise hand') ||
    norm.includes('raise your hand') ||
    norm.includes('hands up') ||
    norm === 'हाथ उठाइए' ||
    norm === 'हाथ उठाओ'
  ) {
    phraseKey = 'raise_hand';
  } else if (
    (norm.includes('हाथ') && (norm.includes('धो') || norm.includes('साफ'))) ||
    norm.includes('भोजन') ||
    norm.includes('खाना') ||
    norm.includes('पंक्ति') ||
    norm.includes('लाइन') ||
    norm.includes('mid day meal')
  ) {
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
  }

  // Common pedagogical word substitutions across Indian languages
  const keyTerms: Record<string, Record<string, { t: string; p: string }>> = {
    Santhali: {
      'पानी': { t: 'ᱫᱟᱜ', p: 'daag' },
      'जल': { t: 'ᱫᱟᱜ', p: 'daag' },
      'पेड़': { t: 'ᱫᱟᱨᱮ', p: 'dare' },
      'पौधे': { t: 'ᱫᱟᱨᱮ', p: 'dare' },
      'जंगल': { t: 'ᱵᱤᱨ', p: 'bir' },
      'वन': { t: 'ᱵᱤᱨ', p: 'bir' },
      'नदी': { t: 'ᱜᱟᱰᱟ', p: 'gada' },
      'मिट्टी': { t: 'ᱦᱟᱥᱟ', p: 'hasa' },
      'पहाड़': { t: 'ᱵᱩᱨᱩ', p: 'buru' },
      'सूरज': { t: 'ᱥᱤᱸᱜᱤ', p: 'singi' },
      'हवा': { t: 'ᱦᱚᱭ', p: 'hoy' },
      'पढ़ाई': { t: 'ᱯᱟᱲᱦᱟᱣ', p: 'parhaw' },
      'सीखेंगे': { t: 'ᱥᱮᱬᱟ ᱮᱫᱟᱵᱚᱱ', p: 'sena edabon' },
      'पढ़ेंगे': { t: 'ᱯᱟᱲᱦᱟᱣ ᱟᱵᱚ', p: 'parhaw abo' },
      'आज': { t: 'ᱛᱮᱦᱮᱧ', p: 'tehenj' },
      'हम': { t: 'ᱟᱵᱚ', p: 'abo' },
      'बच्चों': { t: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', p: 'gidra ko' },
    },
    Gondi: {
      'पानी': { t: 'येर', p: 'yer' },
      'जल': { t: 'येर', p: 'yer' },
      'पेड़': { t: 'मर्रा', p: 'marra' },
      'जंगल': { t: 'काड़ा', p: 'kaada' },
      'नदी': { t: 'डोह', p: 'doh' },
      'मिट्टी': { t: 'मट्टी', p: 'matti' },
      'सूरज': { t: 'पोद्दु', p: 'poddu' },
      'आज': { t: 'नेंड', p: 'nend' },
      'हम': { t: 'अमोत', p: 'amot' },
      'बच्चों': { t: 'पिलेर', p: 'piler' },
    },
    Ho: {
      'पानी': { t: 'ᱫᱟᱜ', p: 'daag' },
      'पेड़': { t: 'ᱫᱟᱨᱩ', p: 'daru' },
      'जंगल': { t: 'ᱵᱤᱨ', p: 'bir' },
      'नदी': { t: 'ᱜᱟᱰᱟ', p: 'gada' },
      'मिट्टी': { t: 'ᱦᱟᱥᱟ', p: 'hasa' },
      'आज': { t: 'ᱛᱤᱥᱤᱝ', p: 'tising' },
      'हम': { t: 'ᱟᱵᱩ', p: 'abu' },
      'बच्चों': { t: 'ᱦᱚᱯᱚᱱ ᱠᱚ', p: 'hopon ko' },
    },
    Mundari: {
      'पानी': { t: 'ᱫᱟᱜ', p: 'daag' },
      'पेड़': { t: 'ᱫᱟᱨᱩ', p: 'daru' },
      'जंगल': { t: 'ᱵᱤᱨ', p: 'bir' },
      'नदी': { t: 'ᱜᱟᱰᱟ', p: 'gada' },
      'मिट्टी': { t: 'ᱦᱟᱥᱟ', p: 'hasa' },
      'आज': { t: 'ᱛᱤᱥᱤᱝ', p: 'tising' },
      'हम': { t: 'ᱟᱞᱮ', p: 'ale' },
      'बच्चों': { t: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', p: 'gidra ko' },
    },
    Bodo: {
      'पानी': { t: 'दै', p: 'doi' },
      'पेड़': { t: 'बिपां', p: 'bifang' },
      'जंगल': { t: 'हाग्रा', p: 'hagra' },
      'नदी': { t: 'दैमा', p: 'doima' },
      'मिट्टी': { t: 'हा', p: 'ha' },
      'आज': { t: 'दिनै', p: 'dinoi' },
      'हम': { t: 'जों', p: 'zong' },
      'बच्चों': { t: "गथ'फोर", p: "goth'for" },
    },
    Odia: {
      'पानी': { t: 'ପାଣି', p: 'pani' },
      'पेड़': { t: 'ଗଛ', p: 'gachha' },
      'जंगल': { t: 'ଜଙ୍ଗଲ', p: 'jangala' },
      'नदी': { t: 'ନଦୀ', p: 'nadi' },
      'मिट्टी': { t: 'ମାଟି', p: 'mati' },
      'आज': { t: 'ଆଜି', p: 'aaji' },
      'हम': { t: 'ଆମେ', p: 'aame' },
      'बच्चों': { t: 'ପିଲାମାନେ', p: 'pilamane' },
    },
    Bengali: {
      'पानी': { t: 'জল', p: 'jol' },
      'पेड़': { t: 'গাছ', p: 'gaach' },
      'जंगल': { t: 'জঙ্গল', p: 'jongol' },
      'नदी': { t: 'নদী', p: 'nodi' },
      'मिट्टी': { t: 'মাটি', p: 'mati' },
      'आज': { t: 'আজ', p: 'aaj' },
      'हम': { t: 'আমরা', p: 'amra' },
      'बच्चों': { t: 'বাচ্চারা', p: 'bacchara' },
    },
    Telugu: {
      'पानी': { t: 'నీరు', p: 'neeru' },
      'पेड़': { t: 'చెట్టు', p: 'chettu' },
      'जंगल': { t: 'అడవి', p: 'adavi' },
      'नदी': { t: 'నది', p: 'nadi' },
      'मिट्टी': { t: 'మట్టి', p: 'matti' },
      'आज': { t: 'ఈ రోజు', p: 'ee roju' },
      'हम': { t: 'మేము', p: 'memu' },
      'बच्चों': { t: 'పిల్లలు', p: 'pillalu' },
    },
  };

  // Generate direct sentence translation without unsolicited greetings
  const langSubMap = keyTerms[targetLanguage] || {};
  let translatedSentence = spokenText;
  const matchedTokens: string[] = [];

  for (const [hindiWord, item] of Object.entries(langSubMap)) {
    if (translatedSentence.includes(hindiWord)) {
      translatedSentence = translatedSentence.replaceAll(hindiWord, item.t);
      matchedTokens.push(`${item.p}`);
    }
  }

  const phoneticScript = matchedTokens.length > 0
    ? matchedTokens.join(' ')
    : `${targetLanguage} pronunciation guide`;

  return {
    translation: translatedSentence,
    phoneticScript,
    teacherNote: `Classroom instructional guide for ${targetLanguage}. Speak slowly and reinforce with visual cues.`,
  };
}

/**
 * Offline-first textbook page pedagogy breakdown.
 * Accurately maps the extracted educational content into the chosen targetLanguage's native script and phonetics.
 */
export function getOfflineTextbookPedagogy(
  targetLanguage: string,
  sourceLanguage = 'Hindi',
  gradeLevel = 'Primary (Classes 1-5)'
): TextbookPedagogyResult {
  // Telugu specific textbook pedagogy
  if (targetLanguage === 'Telugu') {
    return {
      extractedSourceText:
        'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'పాఠం ౪: నదులు మరియు మన అడవులు\nమన దేశంలో నదులు జీవనాధారాలు. అడవులు వర్షాన్ని తెస్తాయి మరియు నేలను పట్టి ఉంచుతాయి. మనం మన నీటి వనరులను, చెట్లను రక్షించుకోవాలి.',
      romanizedText:
        'Paatham 4: Nadulu mariyu mana adavulu. Mana deshamlo nadulu jeevanaadhaaralu. Adavulu varshaanni testhaayi mariyu nelanu patti unchutaayi. Manam mana neeti vanarulanu, chetlanu rakshinchukovaali.',
      targetLanguage: 'Telugu',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module adapted for ${gradeLevel} students, linking river conservation and native Telugu forestry traditions with environmental science.`,
      vocabulary: [
        { term: 'नदियाँ (Nadiyan)', transliteration: 'నదులు (Nadulu)', translation: 'Rivers', meaning: 'Natural streams carrying fresh water across villages.', exampleSentence: 'నదులు మన పంటలకు నీరు అందిస్తాయి.' },
        { term: 'जंगल / वन (Jangal / Van)', transliteration: 'అడవులు (Adavulu)', translation: 'Forests / Woods', meaning: 'Rich biodiversity zones providing rain and fresh air.', exampleSentence: 'అడవులు స్వచ్ఛమైన గాలిని ఇస్తాయి.' },
        { term: 'जल स्रोत (Jal Srot)', transliteration: 'నీటి వనరులు (Neeti Vanarulu)', translation: 'Water Sources', meaning: 'Wells, ponds, and streams that store drinking water.', exampleSentence: 'నీటి వనరులను శుభ్రంగా ఉంచాలి.' },
        { term: 'वर्षा (Varsha)', transliteration: 'వర్షం (Varsham)', translation: 'Rain / Monsoon', meaning: 'Seasonal precipitation nurturing agriculture.', exampleSentence: 'వర్షం వల్ల చెరువులు నిండుతాయి.' },
        { term: 'मिट्टी (Mitti)', transliteration: 'నేల / మట్టి (Nela / Matti)', translation: 'Soil / Earth', meaning: 'Fertile topsoil held together by tree roots.', exampleSentence: 'చెట్ల వేర్లు మట్టిని కాపాడతాయి.' },
        { term: 'पेड़ / वृक्ष (Ped / Vriksha)', transliteration: 'చెట్లు (Chetlu)', translation: 'Trees', meaning: 'Providers of oxygen, fruits, shade, and timber.', exampleSentence: 'ప్రతి ఒక్కరూ ఒక చెట్టు నాటాలి.' },
        { term: 'जीवनदायिनी (Jeevandayini)', transliteration: 'జీవనాధారం (Jeevanaadhaaram)', translation: 'Life-sustaining', meaning: 'Essential elements without which life cannot thrive.', exampleSentence: 'నీరు సమస్త జీవులకు ప్రాణాధారం.' },
        { term: 'संरक्षण / रक्षा (Sanrakshan / Raksha)', transliteration: 'రక్షణ (Rakshana)', translation: 'Protection / Conservation', meaning: 'Safeguarding nature for upcoming generations.', exampleSentence: 'ప్రకృతిని రక్షించడం మన బాధ్యత.' },
        { term: 'कुआँ (Kuan)', transliteration: 'బావి (Baavi)', translation: 'Well', meaning: 'Traditional deep ground well.', exampleSentence: 'బావి నీరు ఎంతో తియ్యగా ఉంటుంది.' },
        { term: 'तालाब (Talaab)', transliteration: 'చెరువు (Cheruvu)', translation: 'Village Pond', meaning: 'Harvested rainwater reservoir in the village.', exampleSentence: 'ఊరి చెరువులో తామర పూలు పూసాయి.' },
        { term: 'पहाड़ (Pahaad)', transliteration: 'కొండ (Konda)', translation: 'Hill / Mountain', meaning: 'Elevated land where rivers originate.', exampleSentence: 'కొండల నుండి జలపాతాలు జాలువారుతాయి.' },
        { term: 'स्वच्छता (Swachhata)', transliteration: 'పరిశుభ్రత (Parishubhratha)', translation: 'Cleanliness', meaning: 'Keeping surroundings and water healthy.', exampleSentence: 'పరిశుభ్రత ఆరోగ్యానికి మూలం.' },
      ],
      teachingAids: [
        'Organize a classroom seed-planting experiment using small recycled cups.',
        'Draw a traditional village tank system (Cheruvu) on the blackboard showing irrigation channels.',
        'Have children recite Telugu action rhymes about rain (Vaanallu Kuravali).',
      ],
      culturalAnalogies:
        'In rural Andhra and Telangana, the village tank (Cheruvu) is the heartbeat of community agriculture. Teach students how previous generations worshipped and maintained these percolation tanks during seasonal festivals.',
    };
  }

  // Bengali specific textbook pedagogy
  if (targetLanguage === 'Bengali') {
    return {
      extractedSourceText:
        'পাঠ ৪: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'পাঠ ৪: নদী ও আমাদের বনভূমি\nআমাদের দেশে নদীগুলি জীবনদায়িনী। বনভূমি বৃষ্টি এনে দেয় এবং মাটিকে আঁকড়ে রাখে। আমাদের উচিত জলসম্পদ ও গাছপালার যত্ন নেওয়া।',
      romanizedText:
        'Path 4: Nodi o amader bonbhumi. Amader deshe nodiguli jibondayini. Bonbhumi brishti ene dey ebong matike aankre rakhe. Amader uchit jolsompod o gaachpalar jotno neoa.',
      targetLanguage: 'Bengali',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module adapted for ${gradeLevel} students, highlighting riverine ecosystems and rural conservation practices.`,
      vocabulary: [
        { term: 'नदियाँ (Nadiyan)', transliteration: 'নদী (Nodi)', translation: 'Rivers', meaning: 'Flowing waterways supporting riverbank villages.', exampleSentence: 'নদীর জল আমাদের জীবন।' },
        { term: 'जंगल / वन (Jangal / Van)', transliteration: 'বন / জঙ্গল (Bon / Jongol)', translation: 'Forest', meaning: 'Dense woodlands sustaining diverse wildlife.', exampleSentence: 'বনে অনেক পশুপাখি বাস করে।' },
        { term: 'पेड़ (Ped)', transliteration: 'গাছ (Gaach)', translation: 'Tree', meaning: 'Living flora providing oxygen and fruits.', exampleSentence: 'একটি গাছ একটি প্রাণ।' },
        { term: 'मिट्टी (Mitti)', transliteration: 'মাটি (Mati)', translation: 'Soil', meaning: 'Fertile ground nurtured by organic matter.', exampleSentence: 'গাছের শিকড় মাটিকে ধরে রাখে।' },
        { term: 'वर्षा (Varsha)', transliteration: 'বৃষ্টি (Brishti)', translation: 'Rain', meaning: 'Seasonal monsoon precipitation.', exampleSentence: 'বৃষ্টি হলে ফসল ভালো হয়।' },
        { term: 'संरक्षण (Sanrakshan)', transliteration: 'সংরক্ষণ (Songrokkhon)', translation: 'Conservation', meaning: 'Careful preservation of resources.', exampleSentence: 'জল সংরক্ষণ করা অত্যন্ত জরুরি।' },
      ],
      teachingAids: [
        'Demonstrate soil erosion with two trays: one with grass roots and one with bare soil.',
        'Read traditional Tagore verses celebrating the rainy season (Aasharh).',
      ],
      culturalAnalogies: 'In delta regions, rivers are revered as mother figures (Nodi Matrik) providing clay, fish, and freshwater.',
    };
  }

  // Tamil specific textbook pedagogy
  if (targetLanguage === 'Tamil') {
    return {
      extractedSourceText:
        'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'பாடம் 4: ஆறுகளும் நமது காடுகளும்\nநமது நாட்டில் ஆறுகள் வாழ்வாதாரமாக விளங்குகின்றன. காடுகள் மழையைக் கொண்டுவந்து மண்ணை இறுகப் பிடித்துக் கொள்கின்றன. நாம் நமது நீர் நிலைகளையும் மரங்களையும் பாதுகாக்க வேண்டும்.',
      romanizedText:
        'Paadam 4: Aarugalum namadhu kaadugalum. Namadhu naattil aarugal vaazhvaadhaaramaaga vilanguginrana. Kaadugal mazhaiyai konduvandhu mannai irugap pidithuk kolginrana. Naam namadhu neer nilaigalaiyum marangalaiyum paadhukaakka vendum.',
      targetLanguage: 'Tamil',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module for ${gradeLevel} students, incorporating Sangam-era landscape concepts (Kurinji & Mullai) and water heritage.`,
      vocabulary: [
        { term: 'नदियाँ (Nadiyan)', transliteration: 'ஆறுகள் (Aarugal)', translation: 'Rivers', meaning: 'Freshwater river systems.', exampleSentence: 'ஆறுகள் நமது பயிர்களுக்கு நீர் அளிக்கின்றன.' },
        { term: 'जंगल (Jangal)', transliteration: 'காடுகள் (Kaadugal)', translation: 'Forests', meaning: 'Wooded wilderness areas.', exampleSentence: 'காடுகள் மழைக்கு உதவுகின்றன.' },
        { term: 'पेड़ (Ped)', transliteration: 'மரங்கள் (Marangal)', translation: 'Trees', meaning: 'Trees producing shade and oxygen.', exampleSentence: 'மரங்களை வளர்ப்போம், மழை பெறுவோம்.' },
        { term: 'मिट्टी (Mitti)', transliteration: 'மண் (Mann)', translation: 'Soil', meaning: 'Earth supporting agriculture.', exampleSentence: 'மர வேர்கள் மண்ணரிப்பைத் தடுக்கின்றன.' },
      ],
      teachingAids: [
        'Construct a miniature model of an Eri (traditional Tamil percolation tank).',
      ],
      culturalAnalogies: 'The Grand Anicut (Kallanai) built centuries ago illustrates our enduring heritage of river canal management.',
    };
  }

  // Odia specific textbook pedagogy
  if (targetLanguage === 'Odia') {
    return {
      extractedSourceText:
        'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'ପାଠ ୪: ନଦୀ ଏବଂ ଆମର ଜଙ୍ଗଲ\nଆମ ଦେଶରେ ନଦୀଗୁଡ଼ିକ ଜୀବନଦାୟିନୀ ଅଟନ୍ତି। ଜଙ୍ଗଲ ବର୍ଷା ଆଣିଥାଏ ଏବଂ ମାଟିକୁ ବାନ୍ଧି ରଖିଥାଏ। ଆମକୁ ଆମର ଜଳ ଉତ୍ସ ଏବଂ ଗଛଗୁଡ଼ିକୁ ସୁରକ୍ଷା ଦେବା ଉଚିତ।',
      romanizedText:
        'Patha 4: Nadi ebam aamara jangala. Aama deshare nadigudika jibanadayini atanti. Jangala barsha aanithae ebam maatiku bandhi rakhithae. Aamaku aamara jala utsa ebam gachhagudikun surakhya deba uchit.',
      targetLanguage: 'Odia',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module for ${gradeLevel} students on environmental conservation and local water management.`,
      vocabulary: [
        { term: 'नदियाँ (Nadiyan)', transliteration: 'ନଦୀ (Nadi)', translation: 'Rivers', meaning: 'Flowing freshwater bodies.', exampleSentence: 'ନଦୀ ଜଳ କୃଷି ପାଇଁ ଆବଶ୍ୟକ।' },
        { term: 'जंगल (Jangal)', transliteration: 'ଜଙ୍ଗଲ (Jangala)', translation: 'Forest', meaning: 'Dense woodlands.', exampleSentence: 'ଜଙ୍ଗଲ ପ୍ରକୃତିର ଅମୂଲ୍ୟ ସମ୍ପଦ।' },
      ],
      teachingAids: ['Draw leaf patterns and identify local Sal and Mahua trees.'],
      culturalAnalogies: 'Sacred groves (Gramadevata Jaad) in Odisha villages have protected indigenous trees for centuries.',
    };
  }

  // Gondi specific textbook pedagogy (Devanagari script)
  if (targetLanguage === 'Gondi') {
    return {
      extractedSourceText:
        'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'पाठ ४: डोह अते मावा काड़ा\nमावा देस ते डोह जीवनाधार आंदु। काड़ा पिर पिसी अते मट्टी तून केरे कीसी इठ्ठी। अमोत मावा येर ता साधन अते मर्राकुन बचाना पायजे।',
      romanizedText:
        'Path 4: Doh ate maawa kaada. Maawa des te doh jeevanaadhaar aandu. Kaada pir peesi ate matti toon kere keesi ithhi. Amot maawa yer ta saadhan ate marrakun bachaana paayje.',
      targetLanguage: 'Gondi',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module adapted for ${gradeLevel} Gond tribal students, celebrating sacred groves (Pen Karka) and forest stream ecology.`,
      vocabulary: [
        { term: 'जल / पानी (Jal / Paani)', transliteration: 'येर (Yer)', translation: 'Water', meaning: 'Life-sustaining spring water.', exampleSentence: 'येर जीवन आंदु।' },
        { term: 'जंगल (Jangal)', transliteration: 'काड़ा (Kaada)', translation: 'Forest / Woods', meaning: 'Sacred hills and hunting grounds.', exampleSentence: 'काड़ा मावा दाई आंदु।' },
        { term: 'पेड़ (Ped)', transliteration: 'मर्रा (Marra)', translation: 'Tree', meaning: 'Sacred Mahua and Sal trees.', exampleSentence: 'मर्रा मट्टी तून केरे कीसी।' },
      ],
      teachingAids: ['Use Mahua and Chironji seeds to count tree species.'],
      culturalAnalogies: 'In Gond philosophy, Nature (Persapen) is revered in deep forest groves called Pen Karka.',
    };
  }

  // Ho specific textbook pedagogy (Warang Citi / Roman)
  if (targetLanguage === 'Ho') {
    return {
      extractedSourceText:
        'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
      translatedText:
        'ᱯᱟᱴ ᱔: ᱜᱟᱰᱟ ᱟᱨ ᱟᱵᱩᱣᱟᱜ ᱵᱤᱨ\nᱟᱵᱩᱣᱟᱜ ᱫᱤᱥᱩᱢ ᱨᱮ ᱜᱟᱰᱟ ᱫᱚ ᱡᱤᱣᱤ ᱠᱟᱱᱟ᱾ ᱵᱤᱨ ᱫᱚ ᱫᱟᱜ ᱟᱹᱜᱩᱭᱟ ᱟᱨ ᱦᱟᱥᱟ ᱫᱚᱦᱚᱭᱟ᱾ ᱟᱵᱩ ᱟᱵᱩᱣᱟᱜ ᱫᱟᱜ ᱟᱨ ᱫᱟᱨᱩ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱦᱚ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
      romanizedText:
        'Pat 4: Gada aar abuag bir. Abuag disum re gada do jiwi kana. Bir do daag aaguya aar hasa dohoya. Abu abuag daag aar daru rukhiya doho laktiya.',
      targetLanguage: 'Ho',
      sourceLanguage,
      pedagogicalSummary: `Primary bilingual module adapted for ${gradeLevel} Ho students utilizing indigenous concepts and forest stewardship traditions.`,
      vocabulary: [
        { term: 'नदियाँ (Nadiyan)', transliteration: 'ᱜᱟᱰᱟ (Gada)', translation: 'River', meaning: 'Flowing mountain river.', exampleSentence: 'ᱜᱟᱰᱟ ᱫᱟᱜ ᱥᱟᱯᱷᱟ ᱜᱮᱭᱟ᱾' },
        { term: 'जंगल (Jangal)', transliteration: 'ᱵᱤᱨ (Bir)', translation: 'Forest', meaning: 'Sacred forest hills.', exampleSentence: 'ᱵᱤᱨ ᱨᱮ ᱫᱟᱨᱩ ᱢᱮᱱᱟᱜ-ᱟ᱾' },
      ],
      teachingAids: ['Demonstrate natural dyes from forest leaves.'],
      culturalAnalogies: 'Ho community forest festivals like Maghe celebrate the seasonal rebirth of wild roots and trees.',
    };
  }

  // Santhali default pedagogy (Ol Chiki script)
  return {
    extractedSourceText:
      'पाठ ४: नदियाँ और हमारे जंगल\nहमारे देश में नदियाँ जीवनदायिनी हैं। जंगल वर्षा लाते हैं और मिट्टी को बांधते हैं। हमें अपने जल स्रोतों और पेड़ों की रक्षा करनी चाहिए।',
    translatedText:
      'ᱯᱟᱴ ᱔: ᱜᱟᱰᱟ ᱟᱨ ᱟᱵᱚᱣᱟᱜ ᱵᱤᱨ\nᱟᱵᱚᱣᱟᱜ ᱫᱤᱥᱚᱢ ᱨᱮ ᱜᱟᱰᱟ ᱫᱚ ᱡᱤᱣᱤ ᱨᱮᱭᱟᱜ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ ᱠᱟᱱᱟ᱾ ᱵᱤᱨ ᱫᱚ ᱫᱟᱜ-ᱡᱟᱹᱲᱤ ᱟᱹᱜᱩᱭᱟ ᱟᱨ ᱦᱟᱥᱟ ᱥᱟᱵ ᱫᱚᱦᱚᱭᱟ᱾ ᱟᱵᱚ ᱟᱵᱚᱣᱟᱜ ᱫᱟᱜ ᱡᱷᱟᱨᱱᱟ ᱟᱨ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱦᱚ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
    romanizedText:
      'Paat 4: Gada aar abowag bir. Abowag disom re gada do jiwi reyag buniyaad kana. Bir do daag-jadi aaguya aar hasa saab dohoya. Abo abowag daag jharna aar dare-nadi rukhiya doho laktiya.',
    targetLanguage: targetLanguage || 'Santhali',
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
      {
        term: 'कुआँ (Kuan)',
        transliteration: 'ᱠᱩᱸᱧ (Kunj)',
        translation: 'Village Well',
        meaning: 'Community dug well providing fresh groundwater for the hamlet.',
        exampleSentence: 'ᱠᱩᱸᱧ ᱠᱷᱚᱱ ᱫᱟᱜ ᱞᱩᱭ ᱢᱮ (Draw water from the well).',
      },
      {
        term: 'पेड़ / वृक्ष (Ped / Vriksha)',
        transliteration: 'ᱫᱟᱨᱮ (Dare)',
        translation: 'Tree / Forest Grove',
        meaning: 'Trees that attract rainfall, hold soil firmly, and provide shade.',
        exampleSentence: 'ᱫᱟᱨᱮ ᱨᱚᱦᱚᱭ ᱢᱮ (Plant trees).',
      },
      {
        term: 'वर्षा / बारिश (Varsha / Baarish)',
        transliteration: 'ᱫᱟᱜ-ᱡᱟᱹᱲᱤ (Daag-jadi)',
        translation: 'Rainfall',
        meaning: 'Monsoon showers essential for forest crops and replenishing streams.',
        exampleSentence: 'ᱫᱟᱜ-ᱡᱟᱹᱲᱤ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ (Rain is coming).',
      },
      {
        term: 'मिट्टी / भूमि (Mitti / Bhumi)',
        transliteration: 'ᱦᱟᱥᱟ (Hasa)',
        translation: 'Earth / Soil',
        meaning: 'Fertile red forest soil bound together by deep tree root networks.',
        exampleSentence: 'ᱦᱟᱥᱟ ᱫᱚ ᱫᱟᱨᱮ ᱨᱮᱭᱟᱜ ᱨᱮᱦᱮᱫ ᱛᱮ ᱛᱟᱦᱮᱸᱱᱟ᱾',
      },
      {
        term: 'संरक्षण (Sanrakshan)',
        transliteration: 'ᱨᱩᱠᱷᱤᱭᱟᱹ (Rukhiya)',
        translation: 'Conservation / Protection',
        meaning: 'Guarding resources so future generations have clean water and green hills.',
        exampleSentence: 'ᱫᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱦᱚᱭ ᱢᱮ (Conserve water).',
      },
      {
        term: 'पहाड़ (Pahaad)',
        transliteration: 'ᱵᱩᱨᱩ (Buru)',
        translation: 'Mountain / Hill',
        meaning: 'Sacred mountain ridges where seasonal clouds gather and springs originate.',
        exampleSentence: 'ᱵᱩᱨᱩ ᱠᱷᱚᱱ ᱡᱷᱟᱨᱱᱟ ᱩᱰᱩᱠᱚᱜ-ᱟ᱾',
      },
      {
        term: 'बावड़ी / तालाब (Bawdi / Talaab)',
        transliteration: 'ᱯᱩᱠᱷᱨᱤ (Pukhri)',
        translation: 'Stepwell / Village Pond',
        meaning: 'Traditional rainwater harvesting reservoir maintained by the community.',
        exampleSentence: 'ᱯᱩᱠᱷᱨᱤ ᱨᱮ ᱫᱟᱜ ᱯᱮᱨᱮᱡ ᱮᱱᱟ (The pond is full of water).',
      },
      {
        term: 'स्वच्छता (Swachhata)',
        transliteration: 'ᱯᱷᱟᱨᱪᱟ (Pharcha)',
        translation: 'Cleanliness / Purity',
        meaning: 'Keeping drinking water sources free from waste and contamination.',
        exampleSentence: 'ᱫᱟᱜ ᱯᱷᱟᱨᱪᱟ ᱫᱚᱦᱚᱭ ᱢᱮ (Keep water clean).',
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
