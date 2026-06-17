import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Minimize,
  Globe,
  Check,
} from "lucide-react";
import { FairyTale } from "../types";

interface StoryViewerProps {
  tale: FairyTale;
  nightMode: boolean;
  onGoToActivities: () => void;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  tale,
  nightMode,
  onGoToActivities,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [targetLang, setTargetLang] = useState<
    "ko" | "en" | "jp" | "cn" | "es"
  >("ko");
  const [bilingualMode, setBilingualMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // TTS State
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null,
  );

  const activeScene = tale.scenes[currentIdx] || tale.scenes[0];

  // Set page trigger handlers
  const handlePrevPage = () => {
    stopSpeaking();
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNextPage = () => {
    stopSpeaking();
    if (currentIdx < tale.scenes.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  // Lazy-load mock image timer on first visit to each page
  useEffect(() => {
    setImageLoading(true);
    const tm = setTimeout(() => {
      setImageLoading(false);
    }, 400);
    return () => clearTimeout(tm);
  }, [currentIdx]);

  // Handle HTML5 Browser Speech Synthesis (TTS Voice)
  const handleSpeakAloud = () => {
    if (isPlayingSeq) {
      stopSpeaking();
      return;
    }

    if (!window.speechSynthesis) {
      alert("이 브라우저는 웹 음성 읽기를 지원하지 않아요.");
      return;
    }

    // Determine narrative to read based on selections
    let textToRead = activeScene.narrativeKo;
    let targetLocale = "ko-KR";

    if (targetLang === "en") {
      textToRead = activeScene.narrativeEn;
      targetLocale = "en-US";
    } else if (targetLang === "jp") {
      textToRead = activeScene.narrativeJp;
      targetLocale = "ja-JP";
    } else if (targetLang === "cn") {
      textToRead = activeScene.narrativeCn;
      targetLocale = "zh-CN";
    } else if (targetLang === "es") {
      textToRead = activeScene.narrativeEs;
      targetLocale = "es-ES";
    }

    const ssu = new SpeechSynthesisUtterance(textToRead);
    ssu.lang = targetLocale;
    ssu.rate = 0.85; // Cozy slower childish rate
    ssu.pitch = 1.25; // High sweet child-friendly tone

    ssu.onend = () => {
      setIsPlayingSeq(false);
    };

    ssu.onerror = () => {
      setIsPlayingSeq(false);
    };

    setUtterance(ssu);
    setIsPlayingSeq(true);
    window.speechSynthesis.speak(ssu);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSeq(false);
  };

  // Close cleans up
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case "ko":
        return "🇰🇷 한글 (Korean)";
      case "en":
        return "🇺🇸 English (영어)";
      case "jp":
        return "🇯🇵 日本語 (Japanese)";
      case "cn":
        return "🇨🇳 中文 (Chinese)";
      case "es":
        return "🇪🇸 Español (Spanish)";
      default:
        return "";
    }
  };

  return (
    <div
      id="story-viewer-wrapper"
      className={`min-h-[calc(100vh-5rem)] py-6 px-8 flex flex-col justify-between transition-colors duration-500 ${
        nightMode ? "bg-[#090F1C] text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Top Controller Ribbon */}
      <div
        id="viewer-header"
        className="flex items-center justify-between border-b pb-4 border-slate-200/20"
      >
        <button
          id="btn-close-viewer"
          onClick={onClose}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            nightMode
              ? "hover:bg-indigo-950 text-indigo-300"
              : "hover:bg-slate-100 text-slate-500"
          }`}
        >
          <Minimize size={14} />
          <span>책 닫고 책장으로</span>
        </button>

        {/* Story details metadata */}
        <div className="text-center">
          <span className="text-[10px] font-bold bg-[#FFD93D]/20 text-[#DFAF00] px-2.5 py-0.5 rounded-full uppercase leading-none inline-block">
            {tale.theme} 이야기
          </span>
          <h2
            className={`font-black text-sm tracking-tight ${nightMode ? "text-slate-100" : "text-slate-700"} mt-0.5`}
          >
            {tale.titleKo}
          </h2>
        </div>

        {/* Sound toggle and language flags */}
        <div className="flex items-center gap-2.5">
          {/* TTS trigger button */}
          <button
            id="btn-tts-read"
            onClick={handleSpeakAloud}
            className={`p-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              isPlayingSeq
                ? "bg-rose-500 text-white animate-pulse"
                : nightMode
                  ? "bg-indigo-950/60 border border-indigo-900 text-indigo-300"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
            }`}
          >
            {isPlayingSeq ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>
              {isPlayingSeq ? "읽는 소리 끄기" : "소리 구연동화 듣기"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Core Double-Page Book spread */}
      <div
        id="book-spread"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 my-6 flex-1 items-center max-w-6xl mx-auto w-full"
      >
        {/* LEFT PAGE: Illustrated Canvas Frame (Cols 5) */}
        <div
          id="book-left-page"
          className="md:col-span-6 flex flex-col items-center"
        >
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100/10 bg-slate-200 shadow-slate-900/10 flex items-center justify-center">
            {imageLoading ? (
              <div className="absolute inset-0 bg-[#0B1528]/80 flex flex-col items-center justify-center space-y-2 z-10 text-white">
                <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-teal-300">
                  DALL-E 일러스트 렌더링 중...
                </span>
              </div>
            ) : null}

            {tale.isCustom ? (
              /* High fidelity custom server-drawn SVG illustration overlay */
              <img
                src={activeScene.imageUrl}
                alt={activeScene.visualPrompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              /* Standard high density built-in story canvases */
              <img
                src={activeScene.imageUrl}
                alt={activeScene.visualPrompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}

            {/* Emotional status badge */}
            <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-black text-white flex items-center gap-1.5 shadow-md">
              <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
              <span>교감 연상 : {activeScene.emotion}</span>
            </div>

            {/* Pagination overlay badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
              {currentIdx + 1} / {tale.scenes.length} 페이지
            </div>
          </div>

          <p
            className="text-[10px] text-slate-400 font-medium italic mt-2.5 text-center px-4 leading-relaxed truncate max-w-md"
            title={activeScene.visualPrompt}
          >
            삽화 드로잉 프롬프트: {activeScene.visualPrompt}
          </p>
        </div>

        {/* RIGHT PAGE: Conversational storyboards Text layout (Cols 7) */}
        <div
          id="book-right-page"
          className={`md:col-span-6 rounded-3xl p-8 border min-h-[350px] flex flex-col justify-between transition-colors shadow-xl ${
            nightMode
              ? "bg-[#0E1A30] border-indigo-950/50 shadow-[#03060c]"
              : "bg-white border-slate-100 shadow-slate-100/50"
          }`}
        >
          {/* Translation controls at page top */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200/20 mb-4">
            {/* Choose Target Language Dropdown */}
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-teal-400" />
              <span className="text-[10px] font-bold text-slate-400">
                다국어 어휘전개
              </span>

              <div className="flex items-center gap-1">
                {(["ko", "en", "jp", "cn", "es"] as const).map((lang) => {
                  const isS = targetLang === lang;
                  return (
                    <button
                      id={`lang-sel-${lang}`}
                      key={lang}
                      onClick={() => {
                        stopSpeaking();
                        setTargetLang(lang);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        isS
                          ? "bg-slate-700 text-white shadow-sm"
                          : nightMode
                            ? "bg-indigo-900/40 text-slate-400 hover:text-slate-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bilingual Immersion Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-extrabold text-slate-400 cursor-pointer flex items-center gap-1">
                <input
                  id="toggle-bilingual-mode"
                  type="checkbox"
                  checked={bilingualMode}
                  onChange={(e) => setBilingualMode(e.target.checked)}
                  disabled={targetLang === "ko"}
                  className="rounded border-slate-300 accent-[#7ECEC4] w-3 h-3 cursor-pointer"
                />
                <span>이중 언어 동시보기</span>
              </label>
            </div>
          </div>

          {/* Primary Text display box */}
          <div className="space-y-6 flex-1 flex flex-col justify-center py-4">
            {/* Primary Language Text */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest font-bold text-rose-400">
                {targetLang === "ko"
                  ? "국문 아동 단어"
                  : getLanguageLabel(targetLang)}
              </span>
              <p
                className={`font-medium leading-relaxed tracking-tight break-keep select-none text-base md:text-lg ${
                  targetLang === "ko" ? "font-sans font-black" : "font-sans"
                }`}
              >
                {targetLang === "ko" && activeScene.narrativeKo}
                {targetLang === "en" && activeScene.narrativeEn}
                {targetLang === "jp" && activeScene.narrativeJp}
                {targetLang === "cn" && activeScene.narrativeCn}
                {targetLang === "es" && activeScene.narrativeEs}
              </p>
            </div>

            {/* Side-by-side secondary Korean layout if Bilingual layout active */}
            {bilingualMode && targetLang !== "ko" && (
              <div className="pt-4 border-t border-dashed border-slate-400/20 space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#7ECEC4]">
                  🇰🇷 모국어 대조 (Korean Translation)
                </span>
                <p className="font-extrabold text-sm leading-relaxed tracking-tight text-slate-400 break-keep select-none">
                  {activeScene.narrativeKo}
                </p>
              </div>
            )}
          </div>

          {/* Prompt warning about reading */}
          <div className="border-t border-slate-200/20 pt-4 text-center">
            <span className="text-[10px] font-bold text-slate-400">
              💡 아동 구두 연습: 천천히 또박또박 눈으로 따라 읽어 보아요.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Scene navigators */}
      <div
        id="viewer-nav-panel"
        className="flex items-center justify-between border-t pt-4 border-slate-200/20"
      >
        <button
          id="btn-viewer-prev"
          onClick={handlePrevPage}
          disabled={currentIdx === 0}
          className={`px-5 py-3.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
            currentIdx === 0
              ? "opacity-30 cursor-not-allowed"
              : nightMode
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                : "bg-white border text-slate-600 hover:bg-slate-50 cursor-pointer"
          }`}
        >
          <ArrowLeft size={14} />
          <span>이전 장면</span>
        </button>

        {/* Scroll indicator bubble index */}
        <div className="hidden sm:flex items-center gap-1.5">
          {tale.scenes.map((_, i) => (
            <button
              id={`goto-scene-dot-${i}`}
              key={i}
              onClick={() => {
                stopSpeaking();
                setCurrentIdx(i);
              }}
              className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                i === currentIdx
                  ? "bg-[#FF6B9D] scale-125"
                  : nightMode
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        {currentIdx === tale.scenes.length - 1 ? (
          /* Finished reading! Navigate to activities */
          <button
            id="trigger-goto-activities"
            onClick={onGoToActivities}
            className="bg-[#7ECEC4] hover:bg-[#68BEB4] text-slate-800 font-extrabold text-xs px-8 py-3.5 rounded-full shadow-lg shadow-teal-100 flex items-center gap-1.5 transition-all transform hover:scale-[1.03]"
          >
            <BookOpen size={14} className="text-slate-800 fill-slate-800" />
            <span>📖 다 읽었어요! 한글 놀이터로 가기</span>
          </button>
        ) : (
          /* Next Scene trigger button */
          <button
            id="btn-viewer-next"
            onClick={handleNextPage}
            className={`px-5 py-3.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
              nightMode
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                : "bg-[#FF6B9D] text-white hover:bg-[#E05284] shadow-md shadow-rose-100 cursor-pointer"
            }`}
          >
            <span>다음 장면</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
