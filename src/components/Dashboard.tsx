import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import { UserSession } from "../types";

interface DashboardProps {
  session: UserSession;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  // 1. Core Profile: Fixed strictly to the globally logged-in active child
  const activeChild =
    session.profiles[session.activeProfileIndex] || session.profiles[0];
  const isFirst = activeChild.name === "김첫째";

  // Parental screentime lock presets
  const [autoShutdown, setAutoShutdown] = useState<boolean>(true);
  const [focusHours, setFocusHours] = useState<number>(1);
  const [focusMinutes, setFocusMinutes] = useState<number>(45);

  // Screentime live timer countdown (preset to 32m 10s = 1930s)
  const [timeLeft, setTimeLeft] = useState<number>(1930);

  useEffect(() => {
    let interval: any = null;
    if (autoShutdown && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoShutdown, timeLeft]);

  // Translate countdown seconds to clock digits
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleHoursUp = () =>
    setFocusHours((prev) => (prev < 12 ? prev + 1 : prev));
  const handleHoursDown = () =>
    setFocusHours((prev) => (prev > 0 ? prev - 1 : prev));
  const handleMinsUp = () =>
    setFocusMinutes((prev) => (prev < 59 ? prev + 5 : prev));
  const handleMinsDown = () =>
    setFocusMinutes((prev) => (prev > 0 ? prev - 5 : prev));

  // --- DYNAMIC CALCULATIONS DRIVEN BY CUMULATIVE session.history DATA ---

  // 1. Vocabulary Accumulation Weekly Data (Daily trend plot counts)
  const getWeeklyWordsTrend = () => {
    const baseList = isFirst
      ? [
          { day: "월", count: 4 },
          { day: "화", count: 8 },
          { day: "수", count: 12 },
          { day: "목", count: 17 },
          { day: "금", count: 20 },
          { day: "토", count: 22 },
          { day: "일", count: 22 },
        ]
      : [
          { day: "월", count: 2 },
          { day: "화", count: 3 },
          { day: "수", count: 5 },
          { day: "목", count: 5 },
          { day: "금", count: 7 },
          { day: "토", count: 9 },
          { day: "일", count: 9 },
        ];

    const todayDayIndex = new Date().getDay(); // 0 indicates Sunday, 1 Monday, ...
    const mappedIdx = todayDayIndex === 0 ? 6 : todayDayIndex - 1;

    // Count actual vocabulary words completed from playroom history
    const historyVocabWords = session.history.reduce((acc, h) => {
      return acc + (h.activitiesCompleted.vocabulary ? 4 : 0);
    }, 0);

    // Apply cumulative vocabulary scores onto current day index onwards
    return baseList.map((item, idx) => {
      if (idx >= mappedIdx) {
        return { ...item, count: item.count + historyVocabWords };
      }
      return item;
    });
  };

  const weeklyWords = getWeeklyWordsTrend();
  const maxWeeklyWordValue = Math.max(...weeklyWords.map((w) => w.count), 30);
  const wordsLearnedThisWeek = weeklyWords[weeklyWords.length - 1].count;
  const booksReadThisWeek =
    (isFirst ? 6 : 3) + session.history.filter((h) => h.completed).length;
  const continuousStreak = isFirst ? 5 : 2;
  const parentEmailAddress = session.parentEmail || "toritori@naver.com";

  // 2. Emotion responses computed dynamically from actual parent/child reactions in history
  const getEmotionDistribution = () => {
    let joy = isFirst ? 64 : 40;
    let surprise = isFirst ? 20 : 45;
    let sad = isFirst ? 16 : 15;

    session.history.forEach((h) => {
      const selected = h.childAnswers?.selectedEmotion;
      const creativeEmo = h.childAnswers?.creativeEmotion;

      if (selected === "기쁨" || selected === "안도") {
        joy += 12;
      } else if (selected === "감동" || selected === "공감") {
        joy += 8;
        surprise += 4;
      } else if (selected === "슬픔" || selected === "두려움") {
        sad += 12;
      }

      if (creativeEmo === "😆") {
        joy += 15;
      } else if (creativeEmo === "😭" || creativeEmo === "🥺") {
        sad += 15;
      } else if (creativeEmo === "😮" || creativeEmo === "🧐") {
        surprise += 15;
      }
    });

    const sum = joy + surprise + sad;
    return {
      joy: Math.round((joy / sum) * 100),
      surprise: Math.min(
        100 - Math.round((joy / sum) * 100) - 10,
        Math.round((surprise / sum) * 100),
      ),
      sad:
        100 -
        Math.round((joy / sum) * 100) -
        Math.min(
          100 - Math.round((joy / sum) * 100) - 10,
          Math.round((surprise / sum) * 100),
        ),
    };
  };

  const emotions = getEmotionDistribution();
  const mostDominantEmotion =
    emotions.joy >= emotions.surprise && emotions.joy >= emotions.sad
      ? "기쁨"
      : emotions.surprise >= emotions.sad
        ? "호기심"
        : "공감과 분발";

  const emotionGreetingEmoji =
    mostDominantEmotion === "기쁨"
      ? "😆"
      : mostDominantEmotion === "호기심"
        ? "😮"
        : "💖";

  // 3. Repeatedly Requested Themes dynamically derived from interests & history
  const getRequestedThemeLog = () => {
    const interests = activeChild.interests || ["스토리"];
    const list = [];

    if (interests.length > 0) {
      list.push({
        emoji:
          interests[0] === "한옥"
            ? "🏡"
            : interests[0] === "동물"
              ? "🐱"
              : "🦕",
        text: `최근 '${interests[0]}' 관련 탐색 낱말을 소리내서 거듭 따라하고 질문해요`,
      });
    }

    if (interests.length > 1) {
      list.push({
        emoji:
          interests[1] === "바다"
            ? "🏖️"
            : interests[1] === "우주"
              ? "🚀"
              : "🌙",
        text: `'${interests[1]}' 공간이 연출될 때 마음 퀴즈 버튼을 집중해서 가장 먼저 터치해요`,
      });
    } else {
      list.push({
        emoji: "🌟",
        text: "스스로 이야기를 이끄는 반딧불이 동화 테마에서 놀라운 정밀 집중력을 지녀요",
      });
    }

    if (activeChild.readingTendency?.style === "more_illustrations") {
      list.push({
        emoji: "🎨",
        text: "글씨 내용보다 입체감 높은 채색 삽화와 귀여운 표정 묘사 부분에 지체 시간이 깁니다",
      });
    } else if (activeChild.readingTendency?.style === "balanced") {
      list.push({
        emoji: "✏️",
        text: "동화 줄거리 순서와 퀴즈의 대화 맥락을 골고루 파악하며 대답 수치도 고르게 뛰어납니다",
      });
    } else {
      list.push({
        emoji: "👻",
        text: "두렵고 깜깜한 줄거리는 성향 분석에 따라 빠르게 책장을 돌려 극복하려는 태도가 활발해요",
      });
    }

    return list;
  };

  const requestedThemeLogs = getRequestedThemeLog();

  // 4. Combined real-time Reading History + standard historical logs matching profile
  const getsUnifiedHistory = () => {
    const userReadRecords = session.history.map((h, i) => {
      const readDate = new Date(h.readAt);
      const isToday = readDate.toDateString() === new Date().toDateString();
      const timeStr = isToday
        ? `오늘 ${readDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`
        : `${Math.ceil((Date.now() - readDate.getTime()) / (24 * 60 * 60 * 1000))}일 전 읽음`;

      return {
        title: h.title,
        statusLabel: h.completed
          ? "완독 및 교감 분석 리포트 전송됨"
          : "중간 저장됨",
        timeLabel: timeStr,
        emoji: h.title.includes("토끼")
          ? "🐰"
          : h.title.includes("거북이")
            ? "🐢"
            : "📗",
        borderColor: "border-sky-150 bg-sky-50/20",
      };
    });

    const standardBaseline = isFirst
      ? [
          {
            title: "토끼와 별빛 숲 (스태프 추천)",
            statusLabel: "완독 및 마음 칭찬 퀴즈 해결 완료",
            timeLabel: "어제 15:42 읽음",
            emoji: "🐰",
            borderColor: "border-rose-100 bg-rose-50/25",
          },
          {
            title: "잠자는 숲속의 공주 (고전 동화)",
            statusLabel: "스스로 상상 줄거리 짓기 학습 완료",
            timeLabel: "3일 전 14:10 읽음",
            emoji: "👑",
            borderColor: "border-teal-100 bg-teal-50/25",
          },
        ]
      : [
          {
            title: "토끼와 거북이 (우화)",
            statusLabel: "동생과 함께 다정하게 끝까지 완독함",
            timeLabel: "어제 16:11 읽음",
            emoji: "🐢",
            borderColor: "border-emerald-100 bg-emerald-50/25",
          },
          {
            title: "토끼와 별빛 숲 (스태프 추천)",
            statusLabel: "창의 감정 상상 퀴즈 응답 완료",
            timeLabel: "4일 전 10:05 읽음",
            emoji: "🐰",
            borderColor: "border-rose-100 bg-rose-50/25",
          },
        ];

    return [...userReadRecords, ...standardBaseline];
  };

  const unifiedHistory = getsUnifiedHistory();

  // 5. Reading report circle metrics
  const monthlyTargetTarget = 23;
  const currentMonthCount =
    (isFirst ? 12 : 5) + session.history.filter((h) => h.completed).length;
  const averageReadingTimeMinutes = isFirst ? 14 : 9;
  const totalSavedBooksCount = (isFirst ? 12 : 7) + session.history.length;

  return (
    <div
      id="parent-dashboard-container"
      className="max-w-7xl mx-auto py-2 px-1 text-slate-800 font-sans"
    >
      {/* GLOBAL DOUBLE SPREAD GRID layout: Left Contents (8 cols) + Right Info Panels (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT / MAIN PANEL: Core visual analytics metrics ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1. 어휘 성장 추이 (Detailed vocabulary learning trend chart) */}
          <div className="bg-[#EAEFF4] rounded-[36px] p-6 shadow-sm border border-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/5 rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  어휘 성장 추이
                </span>
                <span className="text-sm font-extrabold text-slate-700 block">
                  실시간 주간 신규 어휘 누적
                </span>
              </div>

              {/* ⚠️ EXACT MOCKUP MATCH: Non-interactive child capsule widget, fixed without a chevron */}
              <div
                id="fixed-child-status-capsule"
                className="bg-white border text-[11px] font-bold text-slate-700 px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-2xs select-none"
              >
                <span>
                  자녀: {activeChild.name}({activeChild.age}세)
                </span>
              </div>
            </div>

            {/* Visual Bar chart area */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 flex flex-col justify-between shadow-xs">
              <div className="text-[10.5px] font-bold text-slate-400 mb-2 flex justify-between">
                <span>누적 어휘량 (단어 수)</span>
                <span className="text-emerald-600 font-extrabold">
                  이번 주 동화에서 학습한 누적 단어: {wordsLearnedThisWeek}개
                </span>
              </div>

              <div
                id="chart-graph-area"
                className="relative h-44 w-full mt-2 flex items-end justify-between p-4 px-8 bg-slate-50/50 rounded-2xl border border-slate-100"
              >
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-t border-slate-200/20 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-2/4 border-t border-slate-200/20 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-3/4 border-t border-slate-200/20 pointer-events-none"></div>

                {weeklyWords.map((word, idx) => {
                  // Compute ratio relative to maximum value in list
                  const barHeight = (word.count / maxWeeklyWordValue) * 85;
                  return (
                    <div
                      id={`chart-word-col-${idx}`}
                      key={idx}
                      className="flex flex-col items-center gap-2 flex-1 group z-10"
                    >
                      <span className="text-[9px] font-mono font-black text-indigo-600 bg-white px-1.5 py-0.5 rounded-md shadow-2xs border border-slate-100 opacity-90 transition-transform group-hover:scale-105">
                        {word.count}
                      </span>

                      {/* Standard animated bar */}
                      <div className="w-7 bg-slate-200/20 hover:bg-slate-200/40 rounded-t-xl h-24 relative overflow-hidden flex items-end transition-colors">
                        <div
                          className="w-full bg-gradient-to-t from-sky-450 to-indigo-550 rounded-t-xl transition-all duration-500 shadow-xs"
                          style={{ height: `${Math.max(barHeight, 5)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-extrabold">
                        {word.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-medium font-mono">
                <span>※ 독서 완료 및 놀이마당 낱말 퀴즈 시 실시간 가산</span>
                <span className="text-emerald-500">
                  정밀 누적 분석 활성화 ●
                </span>
              </div>
            </div>
          </div>

          {/* Section 2. 자녀 핵심활동 요약 & 집중 예약 시간 설정 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 자녀 핵심활동 요약 (One unified active child profile key indicator card replacing children comparison list) */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  자녀별 요약
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 block mb-4">
                  현재 로그인 중인 아이의 독서 진척도 및 지능 교감 상태
                </span>
              </div>

              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-4.5 rounded-2xl border border-slate-200/40 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-lg text-indigo-600 shadow-2xs">
                    {activeChild.gender === "male" ? "👦" : "👧"}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-800">
                      {activeChild.name} ({activeChild.age}세)
                    </h5>
                    <p className="text-[10.5px] text-emerald-600 font-bold mt-0.5">
                      이번 주 동화 완독 {booksReadThisWeek}편 · 신규 어휘{" "}
                      {wordsLearnedThisWeek}개 학습 완료
                    </p>
                  </div>
                </div>

                {/* Grid performance tags */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded-xl py-2 px-1 border border-slate-150/40">
                    <span className="text-[8px] text-slate-400 block font-bold">
                      주요 관심사
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 block mt-0.5 max-w-full truncate">
                      {activeChild.interests[0] || "모험 스토리"}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl py-2 px-1 border border-slate-150/40">
                    <span className="text-[8px] text-slate-400 block font-bold">
                      교감 감정
                    </span>
                    <span className="text-[10px] font-black text-[#FF6B9D] block mt-0.5">
                      {mostDominantEmotion}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl py-2 px-1 border border-slate-150/40">
                    <span className="text-[8px] text-slate-400 block font-bold">
                      연속 독서
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 block mt-0.5">
                      {continuousStreak}일 연속
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-medium leading-relaxed pt-1 flex items-start gap-1">
                  <Sparkles
                    size={11}
                    className="text-yellow-500 shrink-0 mt-0.5"
                  />
                  <span>
                    아이 성향 분석:{" "}
                    <strong className="text-slate-600 font-extrabold">
                      "{activeChild.readingTendency.style}"
                    </strong>{" "}
                    성향으로, 풍부한 시각 자극에 흥미를 느끼며 독서를 아름다운
                    놀이 기회로 인지하고 있어요.
                  </span>
                </div>
              </div>
            </div>

            {/* 집중 예약 시간 설정 (Locks and screentime guard) */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    집중 시간 설정
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    과독서 방지 및 규칙적인 눈 피로 보호 기능
                  </span>
                </div>

                {/* Auto shutdown Slide toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">
                    자동 제한
                  </span>
                  <button
                    id="auto-shutdown-toggle-switch"
                    type="button"
                    onClick={() => setAutoShutdown(!autoShutdown)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none border-0 ${
                      autoShutdown ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                        autoShutdown ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Picker picker display */}
              <div className="grid grid-cols-2 gap-4 my-3">
                <div className="bg-slate-50 rounded-[20px] p-2 py-3 flex flex-col items-center justify-center relative">
                  <span className="text-[8px] font-bold text-slate-450 absolute top-2">
                    약속 시간 설정
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-2.5">
                    <span className="text-2xl font-black text-indigo-950 tracking-tight">
                      {focusHours}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 mt-2">
                      시간
                    </span>
                  </div>

                  <div className="flex gap-2.5 mt-2.5">
                    <button
                      type="button"
                      onClick={handleHoursDown}
                      className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-100 active:scale-95 shadow-sm cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={handleHoursUp}
                      className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-100 active:scale-95 shadow-sm cursor-pointer"
                    >
                      ▲
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[20px] p-2 py-3 flex flex-col items-center justify-center relative">
                  <span className="text-[8px] font-bold text-slate-450 absolute top-2">
                    일일 권장 분
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-2.5">
                    <span className="text-2xl font-black text-indigo-950 tracking-tight">
                      {focusMinutes}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 mt-2">
                      분
                    </span>
                  </div>

                  <div className="flex gap-2.5 mt-2.5">
                    <button
                      type="button"
                      onClick={handleMinsDown}
                      className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-100 active:scale-95 shadow-sm cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={handleMinsUp}
                      className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-100 active:scale-95 shadow-sm cursor-pointer"
                    >
                      ▲
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress lock readout */}
              <div className="bg-slate-50 rounded-2xl p-2 px-3.5 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10.5px] font-black text-slate-500">
                    오늘의 잔여 이용 시간
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-950 font-mono tracking-wider">
                    {autoShutdown ? formatTime(timeLeft) : "제한 해제"}
                  </span>

                  <div className="relative w-6 w-6 flex items-center justify-center">
                    <svg className="w-6 h-6 transform -rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#e2e8f0"
                        strokeWidth="2"
                        fill="transparent"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={56.5}
                        strokeDashoffset={
                          autoShutdown ? 56.5 * (1 - timeLeft / 1930) : 0
                        }
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <Timer className="absolute text-indigo-600" size={9} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3. 반복 요청 테마 & 감정 반응 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 반복 요청 테마 (Derived analysis based on child interests) */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  반복 요청 테마
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 block mb-4">
                  아이가 주도적으로 누적하여 열람한 단어 및 핵심 취향
                </span>
              </div>

              <div className="space-y-3">
                {requestedThemeLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-50/20 border border-indigo-100/30 p-3.5 rounded-2xl flex items-center gap-3 text-left"
                  >
                    <span className="text-lg">{log.emoji}</span>
                    <span className="text-[11.5px] font-bold text-slate-700 leading-normal">
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 감정 반응 (Dynamic emotional graph based on actual child responses) */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  감정 반응
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 block mb-3">
                  놀이마당 후 아이가 발각한 자율 정서 교감 분포도 (실시간 누계)
                </span>
              </div>

              <div className="relative h-44 rounded-2xl bg-gradient-to-br from-indigo-50/10 to-slate-200/30 flex items-center justify-center p-4 overflow-hidden border border-slate-100">
                {/* Bubble 1: Joy */}
                <div
                  className="absolute rounded-full flex flex-col items-center justify-center text-center z-10 p-2"
                  style={{
                    width: `${emotions.joy + 48}px`,
                    height: `${emotions.joy + 48}px`,
                    backgroundColor: "rgba(199, 210, 254, 0.65)",
                    backdropFilter: "blur(4px)",
                    left: "12%",
                    top: "14%",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.08)",
                  }}
                >
                  <span className="text-[9px] text-indigo-900/60 font-bold">
                    기쁨
                  </span>
                  <span className="text-lg font-black text-indigo-950 tracking-tighter">
                    {emotions.joy}%
                  </span>
                </div>

                {/* Bubble 2: Surprise */}
                <div
                  className="absolute rounded-full flex flex-col items-center justify-center text-center z-10 p-2"
                  style={{
                    width: `${emotions.surprise + 40}px`,
                    height: `${emotions.surprise + 40}px`,
                    backgroundColor: "rgba(253, 243, 199, 0.65)",
                    backdropFilter: "blur(4px)",
                    right: "15%",
                    top: "10%",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.05)",
                  }}
                >
                  <span className="text-[8.5px] text-amber-900/60 font-bold">
                    호기심
                  </span>
                  <span className="text-sm font-black text-amber-950">
                    {emotions.surprise}%
                  </span>
                </div>

                {/* Bubble 3: Sadness/Empathy */}
                <div
                  className="absolute rounded-full flex flex-col items-center justify-center text-center z-10 p-2"
                  style={{
                    width: `${emotions.sad + 42}px`,
                    height: `${emotions.sad + 42}px`,
                    backgroundColor: "rgba(244, 244, 245, 0.75)",
                    backdropFilter: "blur(4px)",
                    right: "31%",
                    bottom: "11%",
                    boxShadow: "0 4px 12px rgba(113, 113, 122, 0.05)",
                  }}
                >
                  <span className="text-[8px] text-slate-500 font-bold">
                    정서교감
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    {emotions.sad}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Personal profile context, logs & metrics group ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Locked Active Profile Card */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300"></div>

            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full border border-slate-200/50 flex items-center justify-center text-3xl shadow-inner select-none mb-4 mt-2">
              {isFirst ? "🤖" : "🐣"}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-indigo-950">
                아이 이름 : {activeChild.name} ({activeChild.age}세)
              </h4>

              <div className="flex items-center justify-center gap-1 pt-1.5 flex-wrap">
                <span className="text-[9px] font-bold text-slate-400 mr-0.5">
                  자녀 관심사:
                </span>
                {activeChild.interests.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-50/50 text-indigo-750 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-indigo-100/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">
                  지배적 독서 감정:
                </span>
                <span className="inline-flex items-center gap-1 bg-rose-50 text-[#FF6B9D] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200">
                  <span>{emotionGreetingEmoji}</span>
                  <span>{mostDominantEmotion}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 읽은 동화 히스토리 (Dynamically computed log timeline based on session.history) */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                전체 읽은 동화 로그
              </span>
              <span className="text-[10px] text-indigo-650 font-black cursor-pointer hover:underline">
                자세히
              </span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {unifiedHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border ${item.borderColor} text-left transition-all hover:translate-x-0.5`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8.5 h-8.5 rounded-xl bg-white border flex items-center justify-center text-sm shadow-2xs shrink-0 select-none">
                      {item.emoji}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-[11.5px] text-slate-800 leading-normal truncate">
                        {item.title}
                      </h5>
                      <p className="text-[9px] text-slate-450 font-bold mt-0.5 truncate">
                        {item.statusLabel}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 ml-2">
                    {item.timeLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 독서 리포트 (Beautiful progress circles tracking real counts from session) */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm space-y-4">
            <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block border-b border-slate-50 pb-2 text-left">
              독서 리포트
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* Card 1 */}
              <div className="bg-slate-50 rounded-2xl p-2 text-center flex flex-col justify-between items-center h-28.5 border border-slate-100 transition-colors">
                <span className="text-[8px] font-black text-slate-450 leading-tight">
                  이번달 독서
                </span>

                <div className="relative w-10 h-10 my-1 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#10b981"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={94.2}
                      strokeDashoffset={
                        94.2 * (1 - currentMonthCount / monthlyTargetTarget)
                      }
                    />
                  </svg>
                  <span className="absolute text-[8px] font-mono font-black text-emerald-600">
                    {currentMonthCount}/{monthlyTargetTarget}
                  </span>
                </div>

                <span className="text-[9px] font-bold text-slate-400">
                  목표 향상
                </span>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 rounded-2xl p-2 text-center flex flex-col justify-between items-center h-28.5 border border-slate-100 transition-colors">
                <span className="text-[8px] font-black text-slate-450 leading-tight">
                  평균 독서시간
                </span>

                <div className="relative w-10 h-10 my-1 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={94.2}
                      strokeDashoffset={
                        94.2 * (1 - averageReadingTimeMinutes / 30)
                      }
                    />
                  </svg>
                  <span className="absolute text-[8px] font-black text-blue-600">
                    {averageReadingTimeMinutes}분
                  </span>
                </div>

                <span className="text-[9px] font-bold text-slate-400">
                  일일 평균
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 rounded-2xl p-2 text-center flex flex-col justify-between items-center h-28.5 border border-slate-100 transition-colors relative cursor-pointer group">
                <ArrowUpRight
                  className="absolute top-1.5 right-1.5 text-sky-400"
                  size={10}
                />
                <span className="text-[8px] font-black text-slate-450 leading-tight">
                  개인 책장
                </span>

                <div className="relative w-10 h-10 my-1 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#c084fc"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={94.2}
                      strokeDashoffset={0}
                    />
                  </svg>
                  <span className="absolute text-[8px] font-black text-purple-600 font-mono">
                    {totalSavedBooksCount}편
                  </span>
                </div>

                <span className="text-[9px] font-bold text-slate-400">
                  책장 가기
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
