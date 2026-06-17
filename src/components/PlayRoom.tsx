import React, { useState } from "react";
import {
  Check,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Award,
  Image,
} from "lucide-react";
import { FairyTale } from "../types";

interface PlayRoomProps {
  tale: FairyTale;
  onActivitySave: (answers: {
    comprehensionText?: string;
    selectedEmotion?: string;
    creativeText?: string;
    creativeEmotion?: string;
    vocabularyQuizAnswers?: string[];
  }) => void;
  onClose: () => void;
}

export const PlayRoom: React.FC<PlayRoomProps> = ({
  tale,
  onActivitySave,
  onClose,
}) => {
  const [activePlayTab, setActivePlayTab] = useState<
    "comp" | "emotion" | "creative" | "vocab"
  >("comp");

  // Game 1: Comprehension states
  const [compText, setCompText] = useState("");
  const [compSubmitted, setCompSubmitted] = useState(false);

  // Game 2: Emotion states
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [emotionExtraInfo, setEmotionExtraInfo] = useState("");
  const [emotionSubmitted, setEmotionSubmitted] = useState(false);

  // Game 3: Creative sequel states
  const [creativeSequel, setCreativeSequel] = useState("");
  const [creativeEmotion, setCreativeEmotion] = useState("😆");
  const [creativeEmotionLabel, setCreativeEmotionLabel] = useState("신남");
  const [creativeSubmitted, setCreativeSubmitted] = useState(false);
  const [creativeTitle, setCreativeTitle] = useState("");
  const [creativeStoryline, setCreativeStoryline] = useState("");
  const [creativeEnding, setCreativeEnding] = useState("");

  // Game 4: Vocabulary states
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [vocabAnswers, setVocabAnswers] = useState<string[]>(["", "", ""]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const activities = tale.activities;

  const handleCardFlip = (idx: number) => {
    if (flippedCards.includes(idx)) {
      setFlippedCards(flippedCards.filter((i) => i !== idx));
    } else {
      setFlippedCards([...flippedCards, idx]);
    }
  };

  const handleVocabAnswerChange = (idx: number, text: string) => {
    const fresh = [...vocabAnswers];
    fresh[idx] = text;
    setVocabAnswers(fresh);
  };

  const evalVocabQuiz = () => {
    // Check blank fill-in correctness
    let correct = 0;
    const questions = activities.vocabulary.quiz || [];
    questions.forEach((q, i) => {
      const userAns = (vocabAnswers[i] || "").trim().toLowerCase();
      const realAns = q.blankWord.trim().toLowerCase();
      if (userAns && (realAns.includes(userAns) || userAns.includes(realAns))) {
        correct += 1;
      }
    });

    setQuizScore(correct);
    setQuizSubmitted(true);
  };

  const handleSaveAndSyncStats = () => {
    onActivitySave({
      comprehensionText: compText,
      selectedEmotion: selectedEmotion,
      creativeText: creativeSequel,
      creativeEmotion: creativeEmotion,
      vocabularyQuizAnswers: vocabAnswers,
    });
    alert(
      "🎉 놀이마당의 놀이 결과가 부모 안심 대시보드로 실시간 전달되었어요!",
    );
    onClose();
  };

  return (
    <div
      id="playroom-container"
      className="max-w-4xl mx-auto py-6 space-y-6 px-4"
    >
      {/* Intro visual banner */}
      <div className="bg-gradient-to-r from-[#FF6B9D]/12 via-[#FFFBE6] to-[#7ECEC4]/12 p-6 rounded-3xl border border-[#FF6B9D]/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase text-[#FF6B9D] tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            책이랑 신나게 놀자!
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1">
            🎠 토리동화 한글 놀이마당
          </h2>
          <p className="text-xs text-slate-500">
            책을 다 읽은 뒤 한글 실력과 감성을 다듬는 4단계 통합 맞춤 놀이
            공간이에요.
          </p>
        </div>

        <button
          id="btn-sync-parent-stats"
          onClick={handleSaveAndSyncStats}
          className="bg-slate-800 text-white hover:bg-slate-700 text-xs font-black px-5 py-3 rounded-2xl shadow-lg transition-all cursor-pointer transform hover:scale-102 flex items-center gap-1.5"
        >
          <Award size={14} className="text-yellow-300" />
          <span>놀이 결과 저장하고 홈으로 🪄</span>
        </button>
      </div>

      {/* Playroom Sub Tabs Menu (Comprehension / Emotion / Creative / Vocabulary) */}
      <div
        id="playroom-tabs"
        className="bg-white border rounded-2xl p-1.5 flex flex-wrap items-center gap-1 shadow-sm border-slate-100"
      >
        {[
          {
            id: "comp",
            label: "🎯 이해력 키우기",
            color: "text-rose-500 bg-rose-50 border-rose-100",
          },
          {
            id: "emotion",
            label: "❤️ 감정 꺼내기",
            color: "text-amber-500 bg-amber-50 border-amber-100",
          },
          {
            id: "creative",
            label: "🦄 창의 스토리",
            color: "text-purple-500 bg-purple-50 border-purple-100",
          },
          {
            id: "vocab",
            label: "📚 낱말 주머니",
            color: "text-teal-500 bg-teal-50 border-teal-100",
          },
        ].map((tab) => {
          const isActive = activePlayTab === tab.id;
          return (
            <button
              id={`play-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActivePlayTab(tab.id as any)}
              className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
                isActive
                  ? "bg-slate-800 text-white shadow-md font-extrabold"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PLAY CONTENT CONTAINER */}
      <div
        id="playroom-stage"
        className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl min-h-[380px] flex flex-col justify-between"
      >
        {/* ================= tab 1: Comprehension Question ================= */}
        {activePlayTab === "comp" && (
          <div id="comp-activity" className="space-y-6">
            <div className="space-y-1.5 border-b pb-4 border-slate-50">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                교감 이해력 트레이닝
              </span>
              <h3 className="text-lg font-black text-slate-800 break-keep">
                Q. {activities.comprehension.question}
              </h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 block">
                ✏️ 아래에 우리 아이가 말한 답변을 자유롭게 적어 보세요.
              </label>
              <textarea
                id="textarea-comprehension"
                value={compText}
                onChange={(e) => setCompText(e.target.value)}
                placeholder="컴퓨터 자판이 아직 미숙한 유아는 소리를 입혀 받아 적어 주시면 대시보드 어휘 분석기에 기록됩니다!"
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 font-medium text-sm text-slate-700 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 transition-all focus:bg-white"
              />
            </div>

            {compSubmitted ? (
              <div className="space-y-4">
                <div
                  id="comprehension-solution"
                  className="bg-[#7ECEC4]/10 p-5 rounded-3xl border border-[#7ECEC4]/20 space-y-2 text-left animate-in fade-in duration-200"
                >
                  <span className="text-xs font-extrabold bg-[#7ECEC4] text-white px-2 py-0.5 rounded-full inline-block">
                    모범 안내 처방전
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">
                    {activities.comprehension.correctAnswer}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    ※ 아이가 전체 정답 맥락과 비슷하게 단어로라도 주장을
                    말했다면 칭찬 스티커와 함께 가득 응원해 주세요!
                  </p>
                </div>
                <div className="pt-4 flex justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
                  >
                    🎮 놀이마당으로 가기
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePlayTab("emotion")}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>다음: 감정 꺼내기 ➡️</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 flex justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
                >
                  🎮 놀이마당으로 가기
                </button>
                <button
                  id="submit-comprehension"
                  onClick={() => setCompSubmitted(true)}
                  disabled={!compText.trim()}
                  className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-black px-6 py-3.5 rounded-2xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-100 cursor-pointer"
                >
                  <Check size={14} />
                  <span>답변 제출 및 맞춤 정답 확인</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= tab 2: Emotion Check ================= */}
        {activePlayTab === "emotion" && (
          <div id="emotion-activity" className="space-y-6">
            <div className="space-y-1.5 border-b pb-4 border-slate-50">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                정서 및 마음 대화
              </span>
              <h3 className="text-lg font-black text-slate-800">
                {activities.emotion.question}
              </h3>
              <p className="text-xs text-slate-400">
                책을 덮고 아이 입에서 터져 나오는 정서 카드를 직접 매핑해
                보세요.
              </p>
            </div>

            {/* Five Emotional Custom choices */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {(activities.emotion.options || []).map((opt) => {
                const isSelected = selectedEmotion === opt.emotion;
                return (
                  <button
                    id={`feel-choice-${opt.emotion}`}
                    key={opt.emotion}
                    onClick={() => setSelectedEmotion(opt.emotion)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between h-40 ${
                      isSelected
                        ? "bg-gradient-to-b from-[#FFD93D]/5 to-[#FFD93D]/15 border-[#FFD93D] text-amber-800 scale-102 shadow-md"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <span className="text-xl inline-block">
                      {opt.emotion === "기쁨" && "😆"}
                      {opt.emotion === "슬픔" && "😢"}
                      {opt.emotion === "두려움" && "😱"}
                      {opt.emotion === "안도" && "🥰"}
                      {opt.emotion === "공감" && "❤️"}
                      {opt.emotion === "궁금함" && "🤔"}
                    </span>
                    <span className="text-xs font-extrabold">
                      {opt.emotion}
                    </span>
                    <p className="text-[9px] text-slate-400 font-medium leading-normal break-all mt-1">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedEmotion && (
              <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-500">
                  ❤️ 그렇게 느낀 우리 아이의 짧은 생각(한 줄 요약):
                </label>
                <input
                  id="input-emotion-reflection"
                  value={emotionExtraInfo}
                  onChange={(e) => setEmotionExtraInfo(e.target.value)}
                  placeholder="예: '블링이가 날 수 있어서 나도 기뻤어!' 라고 소근소근 말했어요."
                  className="w-full bg-slate-50 border border-slate-100 font-bold text-xs text-slate-700 px-4 py-3 rounded-2xl focus:outline-none"
                />
              </div>
            )}

            <div className="pt-4 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
              >
                🎮 놀이마당으로 가기
              </button>
              {emotionSubmitted ? (
                <button
                  type="button"
                  onClick={() => setActivePlayTab("creative")}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>다음: 창의 스토리 ➡️</span>
                </button>
              ) : (
                <button
                  id="submit-emotion"
                  disabled={!selectedEmotion}
                  onClick={() => setEmotionSubmitted(true)}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-amber-100"
                >
                  {emotionSubmitted
                    ? "✨ 감정 선택 저장됨"
                    : "놀이 감정 최종 확정"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= tab 3: Creative Sequel ================= */}
        {activePlayTab === "creative" && (
          <div id="creative-activity" className="space-y-6">
            {/* TITLE & SUBTABS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block font-sans">
                  우리아이 마법 창작실
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-0.5">
                  창작 활동
                </h3>
              </div>

              {/* Fake Subtabs representing the user's uploaded layout */}
              <div className="flex items-center gap-1 mt-2.5 md:mt-0 bg-slate-50 p-1.5 rounded-2xl border border-slate-100/70">
                {[
                  { id: "writing", label: "이야기 이어쓰기", active: true },
                  { id: "drawing", label: "장면 그리기", active: false },
                  {
                    id: "emotion_painting",
                    label: "감정 그리기",
                    active: false,
                  },
                ].map((subtab) => (
                  <button
                    key={subtab.id}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      subtab.active
                        ? "bg-slate-800 text-white shadow-sm font-extrabold"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {subtab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT BOX WITH DASHED BORDER */}
            <div className="border border-dashed border-slate-300 rounded-[32px] p-6 space-y-6 bg-slate-50/20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* LEFT SIDE: Image placeholder */}
                <div className="lg:col-span-5 bg-slate-100/70 hover:bg-slate-100 border border-slate-200 rounded-[28px] flex flex-col items-center justify-center p-8 transition-colors min-h-[220px] text-center">
                  <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-3.5 border border-slate-200/50">
                    <Image className="text-slate-400" size={24} />
                  </div>
                  <p className="text-xs text-slate-500 font-extrabold">
                    동화 속 멋진 장면을
                    <br />
                    머릿속으로 상상해 보세요
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                    ※ 프리미엄은 AI 삽화가 자동 반영됩니다
                  </span>
                </div>

                {/* RIGHT SIDE: Title, Synopsis, Ending input column */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                  {/* 제목 */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 text-sm font-black text-slate-500 text-center">
                      제목
                    </span>
                    <input
                      type="text"
                      value={creativeTitle}
                      onChange={(e) => setCreativeTitle(e.target.value)}
                      placeholder={
                        activities.creative.baseTitle ||
                        "상상한 이야기의 어울리는 제목을 적어주세요."
                      }
                      className="flex-1 bg-slate-100/70 hover:bg-slate-100/90 font-bold text-sm text-slate-850 px-4.5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all focus:bg-white border border-slate-200/50"
                    />
                  </div>

                  {/* 줄거리 */}
                  <div className="flex items-start gap-4">
                    <span className="w-12 text-sm font-black text-slate-500 text-center mt-2.5">
                      줄거리
                    </span>
                    <textarea
                      value={creativeStoryline}
                      onChange={(e) => setCreativeStoryline(e.target.value)}
                      placeholder={
                        activities.creative.baseSummary ||
                        "동화의 주요 줄거리 흐름을 적어주세요."
                      }
                      rows={2}
                      className="flex-1 bg-slate-100/70 hover:bg-slate-100/90 font-medium text-sm text-slate-850 px-4.5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all focus:bg-white border border-slate-200/50 resize-none font-sans"
                    />
                  </div>

                  {/* 결말 */}
                  <div className="flex items-start gap-4">
                    <span className="w-12 text-sm font-black text-slate-500 text-center mt-2.5">
                      결말
                    </span>
                    <textarea
                      value={creativeEnding}
                      onChange={(e) => setCreativeEnding(e.target.value)}
                      placeholder="여기에 직접 생각한 결말 작문 내용을 신나게 적어보세요!"
                      rows={2}
                      className="flex-1 bg-slate-100/70 hover:bg-slate-100/90 font-bold text-sm text-indigo-950 px-4.5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all focus:bg-white border border-indigo-200/50 resize-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* EMOTICON SELECTION PALETTE */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {[
                    { icon: "😆", label: "신남" },
                    { icon: "😭", label: "슬픔" },
                    { icon: "😮", label: "놀람" },
                    { icon: "😡", label: "화남" },
                    { icon: "😜", label: "장난" },
                    { icon: "🥰", label: "사랑" },
                    { icon: "😴", label: "졸림" },
                    { icon: "😎", label: "멋짐" },
                  ].map((emotionItem) => {
                    const isSelected = creativeEmotion === emotionItem.icon;
                    return (
                      <button
                        key={emotionItem.label}
                        type="button"
                        onClick={() => {
                          setCreativeEmotion(emotionItem.icon);
                          setCreativeEmotionLabel(emotionItem.label);
                        }}
                        className={`w-16 py-2.5 bg-white rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50/50 text-purple-950 scale-105 shadow-md font-black"
                            : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        <span className="text-xl">{emotionItem.icon}</span>
                        <span className="text-[10px] font-bold">
                          {emotionItem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* HELPER TEXT AREA WITH REFLECTIVE RESPONSIVE CONTENT */}
                <div className="border border-dashed border-slate-300/80 rounded-2xl p-4.5 bg-white text-center text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto shadow-inner">
                  {creativeEmotionLabel ? (
                    <div className="animate-in fade-in duration-150">
                      ✨{" "}
                      <span className="text-purple-600 font-extrabold">
                        [{creativeEmotionLabel}]
                      </span>{" "}
                      감정을 골랐군요!{" "}
                      {creativeEmotionLabel === "신남" &&
                        "동화 주인공이 이겨내고 신나는 파티를 여는 해피엔딩을 상상하면 글을 쓰기가 더 편해져요! 🎈"}
                      {creativeEmotionLabel === "슬픔" &&
                        "아쉽거나 애잔한 끝맺음으로 긴 여운이나 따뜻한 눈물이 고이는 아름다운 작별 장면을 연출해 보세요. 🌧️"}
                      {creativeEmotionLabel === "놀람" &&
                        "보물상자 속에서 예상치 못한 마법 생물이 갑자기 톡 튀어나오는 깜짝 반전을 완성해 보아요! 🦖"}
                      {creativeEmotionLabel === "화남" &&
                        "심술궂은 인물이 심통을 부리지만 대화로 오해를 풀며 극적으로 화해하는 교훈을 실어 오세요. ⚡"}
                      {creativeEmotionLabel === "장난" &&
                        "익살스럽고 유쾌한 해프닝이 발생하여 모두가 유쾌하게 웃으며 마무리하는 결말을 지어 보세요! 💨"}
                      {creativeEmotionLabel === "사랑" &&
                        "주인공들이 손을 맞잡고 서로의 온기를 나누며 영원한 우정과 가족애를 약속하는 훈훈한 줄거리를 적어 보아요. 🥰"}
                      {creativeEmotionLabel === "졸림" &&
                        "포근한 모닥불과 밤하늘 아래 모두가 스르륵 꿀잠에 드는 편안하고 조용한 자장가 스토리 결말을 상상해 보아요. 🌙"}
                      {creativeEmotionLabel === "멋짐" &&
                        "마법 방패를 들고 용감하게 난관을 돌파해 위기의 마을을 완벽하게 구출해내는 영웅담을 써 보세요! 🦸"}
                    </div>
                  ) : (
                    "원하는 결말의 감정을 선택하면 더 쉽게 상상할 수 있도록 도와줄게요!"
                  )}
                </div>
              </div>
            </div>

            {/* ACTION DIRECTORY NAVIGATION BUTTONS */}
            <div className="pt-4 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
              >
                <span>← 놀이마당으로</span>
              </button>

              {creativeSubmitted ? (
                <button
                  type="button"
                  onClick={() => setActivePlayTab("vocab")}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>다음: 낱말 주머니 ➡️</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const finalTitle =
                      creativeTitle.trim() ||
                      activities.creative.baseTitle ||
                      "상상 동화 제목";
                    const finalStoryline =
                      creativeStoryline.trim() ||
                      activities.creative.baseSummary ||
                      "동화 기본 이야기";
                    const finalEnding =
                      creativeEnding.trim() || "직접 만든 따뜻한 결말";
                    const finalSeq = `[창작 제목]: ${finalTitle}\n[줄거리]: ${finalStoryline}\n[결말]: ${finalEnding}\n[결말 감정]: ${creativeEmotionLabel}`;
                    setCreativeSequel(finalSeq);
                    setCreativeSubmitted(true);
                  }}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  답변 제출
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= tab 4: Vocabulary study cards and Quiz ================= */}
        {activePlayTab === "vocab" && (
          <div id="vocab-activity" className="space-y-6">
            {/* Visual Word flash card grid */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-600 block">
                👈 낱말 카드를 톡 두드리면 아동용 사전 정의가 짜잔 나타나요. (3D
                Flip)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(activities.vocabulary.cards || []).map((card, idx) => {
                  const isFlipped = flippedCards.includes(idx);
                  return (
                    <div
                      id={`vocab-flip-${idx}`}
                      key={idx}
                      onClick={() => handleCardFlip(idx)}
                      className="h-28 relative perspective cursor-pointer"
                    >
                      <div
                        className={`w-full h-full transition-transform duration-500 transform-style preserve-3d relative ${
                          isFlipped ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* CARD FRONT (Word) */}
                        <div className="absolute inset-0 backface-hidden rounded-2xl border border-teal-100 bg-[#7ECEC4]/5 text-slate-800 flex flex-col items-center justify-center p-3 text-center shadow-sm">
                          <span className="text-xs font-black text-teal-800">
                            {card.word}
                          </span>
                          <span className="text-[10px] text-teal-400 font-semibold mt-1">
                            터치해서 사전보기
                          </span>
                        </div>

                        {/* CARD BACK (Definition) */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-slate-100 bg-slate-900 text-white flex flex-col p-3 text-left justify-between shadow-md">
                          <span className="text-[9px] font-black text-[#FFD93D]">
                            {card.word} 뜻
                          </span>
                          <p className="text-[9.5px] font-medium leading-normal text-slate-300 truncate-3-lines">
                            {card.definition}
                          </p>
                          <span className="text-[7.5px] text-slate-400 truncate mt-0.5 font-medium">
                            {card.example}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blank Fill-in Quiz section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <span className="text-xs font-black text-[#333] flex items-center gap-1.5">
                <span>📝 빈칸 단어 쪽지시험</span>
                <span className="text-[10px] font-bold text-slate-400">
                  단어 카드를 참조해서 빈칸을 채워요!
                </span>
              </span>

              <div className="space-y-3">
                {(activities.vocabulary.quiz || []).map((qz, idx) => (
                  <div
                    id={`quiz-item-${idx}`}
                    key={idx}
                    className="bg-slate-50 border p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-[#333]">
                        질문 {idx + 1}. &quot;{qz.sentenceWithBlank}&quot;
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        단서: {qz.clue}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id={`input-quiz-answer-${idx}`}
                        value={vocabAnswers[idx] || ""}
                        onChange={(e) =>
                          handleVocabAnswerChange(idx, e.target.value)
                        }
                        placeholder="정답 입력"
                        disabled={quizSubmitted}
                        className="bg-white border rounded-xl px-3 py-2 text-xs font-black text-slate-700 w-32 text-center focus:outline-none"
                      />
                      {quizSubmitted && (
                        <span
                          className={`font-black text-xs ${
                            vocabAnswers[idx]?.toLowerCase() ===
                            qz.blankWord.toLowerCase()
                              ? "text-[#7ECEC4]"
                              : "text-rose-500"
                          }`}
                        >
                          {vocabAnswers[idx]?.toLowerCase() ===
                          qz.blankWord.toLowerCase()
                            ? "● 정답"
                            : `답: ${qz.blankWord}`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {quizSubmitted ? (
                <div className="space-y-4">
                  <div
                    id="quiz-result-card"
                    className="bg-[#7ECEC4]/10 p-5 rounded-3xl border border-[#7ECEC4]/20 flex items-center justify-between animate-in fade-in duration-200"
                  >
                    <span className="font-extrabold text-sm text-[#2d7d74]">
                      🎉 쪽지시험 채점 점수:{" "}
                      {activities.vocabulary.quiz?.length}문제 중 {quizScore}
                      문제 정답!
                    </span>
                    <button
                      id="retry-quiz"
                      onClick={() => {
                        setVocabAnswers(["", "", ""]);
                        setQuizSubmitted(false);
                      }}
                      className="bg-white border hover:bg-slate-50 text-[10px] font-black px-3.5 py-2 rounded-xl text-slate-500 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={11} />
                      <span>다시 시험보기</span>
                    </button>
                  </div>
                  <div className="pt-4 flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
                    >
                      🎮 놀이마당으로 가기
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndSyncStats}
                      className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Award size={14} className="text-yellow-300" />
                      <span>모두 끝내고 결과 저장하기 🪄</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/40"
                  >
                    🎮 놀이마당으로 가기
                  </button>
                  <button
                    id="submit-vocab-quiz"
                    onClick={evalVocabQuiz}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-md cursor-pointer transition-all"
                  >
                    채점하고 칭찬별 받기 ⭐
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
