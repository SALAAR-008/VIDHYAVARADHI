/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let currentSourceNode: AudioBufferSourceNode | null = null;

/**
 * Stops any actively playing audio synthesis.
 */
export function stopIndianLanguageAudio(): void {
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
 * Plays synthesized spoken audio for Indian/tribal languages using Web Speech API.
 */
export async function playIndianLanguageAudio(
  text: string,
  languageCodeOrName?: string
): Promise<void> {
  if (!text || !text.trim()) return;

  stopIndianLanguageAudio();

  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;

      if (languageCodeOrName) {
        const lang = languageCodeOrName.toLowerCase();
        if (lang.includes('hi') || lang.includes('hindi')) utterance.lang = 'hi-IN';
        else if (lang.includes('bn') || lang.includes('bengali')) utterance.lang = 'bn-IN';
        else if (lang.includes('ta') || lang.includes('tamil')) utterance.lang = 'ta-IN';
        else if (lang.includes('te') || lang.includes('telugu')) utterance.lang = 'te-IN';
        else if (lang.includes('mr') || lang.includes('marathi')) utterance.lang = 'mr-IN';
        else if (lang.includes('gu') || lang.includes('gujarati')) utterance.lang = 'gu-IN';
        else if (lang.includes('ur') || lang.includes('urdu')) utterance.lang = 'ur-IN';
        else if (lang.includes('pa') || lang.includes('punjabi')) utterance.lang = 'pa-IN';
        else utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
}