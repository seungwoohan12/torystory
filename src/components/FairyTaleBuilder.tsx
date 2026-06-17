import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  Lightbulb,
  Check,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Lock,
  Crown,
} from "lucide-react";
import { ChildProfile, FairyTale } from "../types";

interface FairyTaleBuilderProps {
  activeProfile: ChildProfile;
  initialBuildType?: "home" | "selective" | "conversational";
  onGenerate: (config: {
    protagonist: string;
    age: number;
    theme: string;
    style: string;
    extraKorean: boolean;
  }) => void;
  tales: FairyTale[];
  onSelectTale: (tale: FairyTale) => void;
  subscriptionType: "free" | "premium";
  onOpenPaywall: () => void;
  lang?: "KO" | "EN";
}

const THEMES = [
  { id: "우정", label: "🤝 따뜻한 우정", desc: "친구를 돕고 사귀어봐요" },
  { id: "지혜", label: "💡 슬기로운 지혜", desc: "생각을 키워 벽을 극복해요" },
  { id: "배려", label: "🌸 상냥한 배려", desc: "타인의 가슴을 소중히 안아요" },
  { id: "모험", label: "🦖 용감한 모험", desc: "새로운 한 걸음을 내딛어요" },
  { id: "정직", label: "💎 올곧은 정직", desc: "거짓 없이 솔직하게 소통해요" },
  { id: "가족", label: "🏡 돈독한 가족", desc: "부모님 동생을 깊게 사랑해요" },
];

const INTERESTS = [
  { id: "한옥", label: "🏡 한옥 마을", category: "korean" },
  { id: "도깨비", label: "👺 꼬마 도깨비", category: "korean" },
  { id: "바다", label: "🐳 푸른 바다", category: "nature" },
  { id: "공룡", label: "🦖 파워 공룡", category: "fantasy" },
  { id: "우주", label: "🚀 우주 은하수", category: "nature" },
  { id: "아기동물", label: "🐰 아기 토끼", category: "nature" },
  { id: "꽃지성", label: "🌻 마법 정원", category: "nature" },
  { id: "요리", label: "🍪 과자 요리사", category: "life" },
];

const ART_STYLES = [
  {
    id: "수채화",
    label: "🖌️ 물감 수채화",
    desc: "동화책 같은 부드러움",
    img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "파스텔 크레용",
    label: "🖍️ 파스텔 크레용",
    desc: "우리 동네 스케치 질감",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "동화풍 일러스트",
    label: "🎨 동화풍 일러스트",
    desc: "애니메이션 같은 선명함",
    img: "https://images.unsplash.com/photo-1518151125978-57d5442ceade?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "잉크 스케치",
    label: "✒️ 클래식 잉크",
    desc: "따스한 명랑 만화 느낌",
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop",
  },
];

const KOREAN_MOTIFS = [
  { id: "한옥", label: "🏯 고즈넉한 한옥" },
  { id: "전통 한복", label: "👘 고운 전통 한복" },
  { id: "도깨비 주머니", label: "🎒 도깨비 요술" },
  { id: "탈춤", label: "🎭 신명나는 탈춤" },
  { id: "풍성한 정원", label: "🏡 풍성한 한옥 정원" },
  { id: "호랑이 신선", label: "🐯 꼬마 호랑이 신선" },
  { id: "꿀 약과", label: "🥮 요술 꿀 약과" },
  { id: "달님 전설", label: "✨ 달님 별님 전설" },
];

export const FairyTaleBuilder: React.FC<FairyTaleBuilderProps> = ({
  activeProfile,
  initialBuildType,
  onGenerate,
  tales,
  onSelectTale,
  subscriptionType,
  onOpenPaywall,
  lang = "KO",
}) => {
  const [buildType, setBuildType] = useState<
    "home" | "selective" | "conversational"
  >(initialBuildType || "home");

  useEffect(() => {
    if (initialBuildType) {
      setBuildType(initialBuildType);
    }
  }, [initialBuildType]);

  // Selective build states
  const [protagonist, setProtagonist] = useState(activeProfile.name);
  const [age, setAge] = useState(activeProfile.age);
  const [selectedTheme, setSelectedTheme] = useState("우정");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    activeProfile.interests || [],
  );
  const [selectedStyle, setSelectedStyle] = useState("수채화");
  const [extraKorean, setExtraKorean] = useState(true);
  const [selectedKoreanMotifs, setSelectedKoreanMotifs] = useState<string[]>([
    "한옥",
    "전통 한복",
    "도깨비 주머니",
    "탈춤",
    "풍성한 정원",
  ]);

  // Conversational states (4 steps)
  const [convStep, setConvStep] = useState(1);
  const [convProtagonist, setConvProtagonist] = useState("");
  const [convAge, setConvAge] = useState("");
  const [convGender, setConvGender] = useState<
    "남자아이" | "여자아이" | "선택 안 함"
  >("선택 안 함");

  // Step 2 Theme & Lesson
  const [convTheme, setConvTheme] = useState("우정과 나눔");
  const [convLesson, setConvLesson] = useState("");

  // Step 3 Graphic Custom Extra Request
  const [convStyleExtra, setConvStyleExtra] = useState("");

  // Step 4 Story Details
  const [convLength, setConvLength] = useState<string>("보통 (8~14페이지)");
  const [showPaywallPrompt, setShowPaywallPrompt] = useState(false);

  const handleInterestToggle = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleKoreanMotifToggle = (id: string) => {
    if (selectedKoreanMotifs.includes(id)) {
      setSelectedKoreanMotifs(selectedKoreanMotifs.filter((m) => m !== id));
    } else {
      setSelectedKoreanMotifs([...selectedKoreanMotifs, id]);
    }
  };

  const handleAiAutoRecommend = () => {
    // Fill automatically with perfect child combinations!
    setProtagonist(activeProfile.name);
    setAge(activeProfile.age);
    setSelectedTheme("지혜");
    setSelectedInterests(["한옥", "도깨비", "아기동물"]);
    setSelectedStyle("동화풍 일러스트");
    setExtraKorean(true);
    setSelectedKoreanMotifs(["한옥", "전통 한복", "도깨비 주머니"]);
  };

  const handleSelectLength = (optionId: string) => {
    if (
      subscriptionType === "free" &&
      (optionId === "보통 (8~14페이지)" || optionId === "길게 (16~30페이지)")
    ) {
      setShowPaywallPrompt(true);
      return;
    }
    setConvLength(optionId);
  };

  const handleLaunchCreativeCraft = () => {
    let finalProtagonist = protagonist || activeProfile.name;
    let finalAge = Number(age);
    let finalThemeWithMotifs = "";
    let finalStyle = selectedStyle;

    if (buildType === "selective") {
      finalThemeWithMotifs = selectedTheme;
      if (extraKorean && selectedKoreanMotifs.length > 0) {
        finalThemeWithMotifs += ` (전통 소재 다중선택 적용: ${selectedKoreanMotifs.join(", ")})`;
      }
    } else {
      // Conversational
      finalProtagonist = convProtagonist || activeProfile.name;
      if (convGender !== "선택 안 함") {
        finalProtagonist += ` (성별: ${convGender})`;
      }

      // Parse numeric age from convAge string
      let ageQuery = convAge.trim();
      let parsedAge = activeProfile.age || 5;
      if (ageQuery) {
        if (ageQuery.includes("3")) parsedAge = 3;
        else if (ageQuery.includes("4")) parsedAge = 4;
        else if (ageQuery.includes("5")) parsedAge = 5;
        else if (ageQuery.includes("6")) parsedAge = 6;
        else if (ageQuery.includes("7")) parsedAge = 7;
        else if (ageQuery.includes("1학년")) parsedAge = 8;
        else if (ageQuery.includes("2학년")) parsedAge = 9;
        else if (ageQuery.includes("3학년")) parsedAge = 10;
        else parsedAge = parseInt(ageQuery) || activeProfile.age || 5;
      }

      finalAge = parsedAge;

      finalThemeWithMotifs = `주제: ${convTheme}`;
      if (convLesson) {
        finalThemeWithMotifs += `, 전달하고 싶은 교훈: ${convLesson}`;
      }
      finalThemeWithMotifs += `, 분량: ${convLength}`;
      if (extraKorean && selectedKoreanMotifs.length > 0) {
        finalThemeWithMotifs += ` (전통 소재 다중선택 적용: ${selectedKoreanMotifs.join(", ")})`;
      }

      if (convStyleExtra.trim()) {
        finalStyle += ` (화풍 추가 요청: ${convStyleExtra.trim()})`;
      }
    }

    onGenerate({
      protagonist: finalProtagonist,
      age: finalAge,
      theme: finalThemeWithMotifs,
      style: finalStyle,
      extraKorean: extraKorean,
    });
  };

  return (
    <div
      id="fairy-tale-builder-container"
      className="max-w-6xl mx-auto py-2 px-4 space-y-8"
    >
      {buildType === "home" ? (
        /* ================= LOGIN-AFTER HOME DASHBOARD ================= */
        <div
          id="dashboard-home-view"
          className="space-y-8 animate-in fade-in duration-300"
        >
          {/* Main Hero Header */}
          <div className="text-center py-6 space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-normal cute-font">
              호롱빛이 머무는 밤, 우리 아이만의 이야기
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-semibold">
              아이의 작은 상상과 소중한 하루를 담아 세상에 하나뿐인 맞춤 동화를
              만들어보세요.
            </p>
            <p className="text-xs text-slate-400">
              매일 밤 특별한 이야기로 아이와 더 가까워질 수 있습니다.
            </p>
          </div>

          {/* 1. New Story Creation Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-700 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-pink rounded-full inline-block"></span>
              <span>새 동화 시작하기</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Selective Story Card */}
              <div
                id="home-card-selective"
                className="bg-white rounded-[32px] p-6 border-4 border-[#FEE2E2] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-stretch text-left space-y-4 group"
              >
                {/* Visual Placeholder Frame with Crossing Lines */}
                <div className="bg-[#F8FAFC] border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden p-4 group-hover:border-pink/40 transition-colors">
                  <svg
                    className="absolute inset-0 w-full h-full text-slate-100 group-hover:text-pink/5 pointer-events-none transition-colors"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="100%"
                      y1="0"
                      x2="0"
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Icon & Label Inside */}
                  <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-pink shadow-inner">
                      <Sparkles size={20} className="fill-pink/20" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-pink/80 transition-all">
                      선택형 동화 일러스트
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-800">
                    선택형 동화
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    주제와 주인공을 선택하면 토리가 이야기를 완성해요.
                  </p>
                </div>

                <button
                  id="home-btn-selective"
                  onClick={() => setBuildType("selective")}
                  className="w-full bg-slate-800 hover:bg-pink text-white font-extrabold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1 cursor-pointer tory-btn"
                >
                  <span>선택형 동화 만들기</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Option 2: Conversational Story Card */}
              <div
                id="home-card-conversational"
                className="bg-white rounded-[32px] p-6 border-4 border-lavender/70 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-stretch text-left space-y-4 group"
              >
                {/* Visual Placeholder Frame with Crossing Lines */}
                <div className="bg-[#F8FAFC] border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden p-4 group-hover:border-lavender/50 transition-colors">
                  <svg
                    className="absolute inset-0 w-full h-full text-slate-100 group-hover:text-purple-100/10 pointer-events-none transition-colors"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="100%"
                      y1="0"
                      x2="0"
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Icon & Label Inside */}
                  <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                      <Compass size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-purple-600/80 transition-all">
                      대화형 동화 일러스트
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-800">
                    대화형 동화
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    아이와 대화하듯 차분히 말하며 함께 이야기를 만들어요.
                  </p>
                </div>

                <button
                  id="home-btn-conversational"
                  onClick={() => setBuildType("conversational")}
                  className="w-full bg-slate-800 hover:bg-purple-600 text-white font-extrabold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1 cursor-pointer tory-btn"
                >
                  <span>대화형 동화 만들기</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Recently Read Tales Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-black text-slate-700 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7ECEC4] rounded-full inline-block"></span>
              <span>최근에 읽은 동화</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Render dynamic tales or show polished skeletal placeholders */}
              {Array.from({ length: 4 }).map((_, idx) => {
                const tale = tales[idx];
                if (tale) {
                  return (
                    <div
                      id={`home-recent-tale-${tale.id}`}
                      key={tale.id}
                      onClick={() => onSelectTale(tale)}
                      className="bg-white rounded-2xl p-3 border-2 border-[#EBF1FA] hover:border-pink/40 shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-48"
                    >
                      <div className="bg-slate-50 rounded-xl h-24 overflow-hidden relative flex items-center justify-center border border-slate-100 mb-2">
                        {tale.scenes[0]?.imageUrl ? (
                          <img
                            src={tale.scenes[0].imageUrl}
                            alt={tale.titleKo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-rose-300">
                            <Sparkles size={24} className="animate-pulse" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-slate-800/80 text-[8.5px] font-bold text-white px-1.5 py-0.5 rounded">
                          {tale.style}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-black text-slate-700 line-clamp-1 group-hover:text-pink transition-colors">
                          {tale.titleKo}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>{tale.protagonist}의 모험</span>
                          <span className="font-mono text-[9px]">
                            {tale.scenes.length}p
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Polished Wireframe Placeholder Cards to match user's specification image
                return (
                  <div
                    id={`home-recent-wireframe-${idx}`}
                    key={idx}
                    className="bg-white rounded-2xl p-4 border-2 border-dashed border-slate-200 flex flex-col h-48 justify-between relative overflow-hidden group"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full text-slate-50/70 pointer-events-none"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <line
                        x1="100%"
                        y1="0"
                        x2="0"
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>

                    <div className="bg-slate-100 rounded-xl h-24 flex items-center justify-center relative overflow-hidden border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-300">
                        동화 썸네일 {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                      <div className="h-2.5 w-3/4 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="h-2 w-1/2 bg-slate-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Why Tory Tale (Bento grid) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-black text-slate-700 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#9A7BE6] rounded-full inline-block"></span>
              <span>
                {lang === "KO"
                  ? "토리동화가 특별한 이유"
                  : "Why Tory Tale is Special"}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-2">
                <span className="text-pink font-black text-sm">
                  {lang === "KO" ? "📊 독서습관 관리" : "📊 Reading Habits"}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {lang === "KO"
                    ? "일정한 스크린타임 설정과 독서 성장 통계를 통해 아이가 규칙적이고 올바른 독서 습관을 재미있게 기를 수 있습니다."
                    : "Helps develop regular reading habits with smart screen-time limits and detailed visual growth statistics."}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-2">
                <span className="text-teal-600 font-black text-sm">
                  {lang === "KO" ? "🔊 음성지원" : "🔊 Voice Audio Support"}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {lang === "KO"
                    ? "따뜻하고 상냥한 목소리로 동화를 실시간으로 직접 읽어 주어 아이가 이야기에 빠져 편안히 잠들 수 있도록 유도합니다."
                    : "Reads the stories out loud real-time with ambient, warm voiceovers to help your child drift off to cozy sleep."}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-2">
                <span className="text-purple-600 font-black text-sm">
                  {lang === "KO" ? "🧩 놀이마당 연계" : "🧩 Word Play Quizzes"}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {lang === "KO"
                    ? "동화를 모두 다 읽고 난 후, 즉시 이어지는 마법 놀이마당 낱말게임과 플래시카드를 통해 어휘력이 쑥쑥 상승합니다."
                    : "Directly bridges to engaging word quizzes and cards after finishing each story to solidify reading vocabulary."}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Subscription banner callout block */}
          <div className="bg-gradient-to-r from-pink/5 via-lavender/5 to-warmbg p-6 rounded-3xl border-2 border-pink/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-1">
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                토리동화 구독 플랜 👑
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                더 많은 동화, 더 다양한 테마, 마법 보관함 무제한 저장까지 — 구독
                멤버십으로 온전히 누려보세요.
              </p>
            </div>

            <button
              id="home-sub-banner-btn"
              onClick={onOpenPaywall}
              className="bg-slate-800 hover:bg-pink text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-sm transition-all cursor-pointer tory-btn shrink-0"
            >
              구독 혜택 보기
            </button>
          </div>
        </div>
      ) : (
        /* ================= SELECTIVE AND CONVERSATIONAL STORY BUILDING INTERFACES ================= */
        <div id="active-builder-interface-view" className="space-y-6">
          {/* Back to Home Dashboard Navigation Link */}
          <div className="flex items-center justify-between">
            <button
              id="back-to-home-dashboard"
              onClick={() => setBuildType("home")}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <span>← 처음 화면으로 돌아가기</span>
            </button>

            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              아이: {activeProfile.name} ({activeProfile.age}세)
            </span>
          </div>

          {/* Top Creation Tabs Selection */}
          <div
            id="builder-tabs"
            className="bg-warmbg p-2 rounded-3xl border-4 border-[#EBF1FA] flex items-center gap-2 max-w-sm mx-auto"
          >
            <button
              id="btn-selective-tab"
              onClick={() => setBuildType("selective")}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                buildType === "selective"
                  ? "bg-pink text-white shadow-md tory-btn"
                  : "text-slate-500 hover:text-pink hover:bg-pink/5"
              }`}
            >
              <Sparkles size={14} />
              <span>선택형 만들기</span>
            </button>
            <button
              id="btn-conversational-tab"
              onClick={() => setBuildType("conversational")}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                buildType === "conversational"
                  ? "bg-purple-600 text-white shadow-md tory-btn"
                  : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Compass size={14} />
              <span>대화형 만들기</span>
            </button>
          </div>

          {buildType === "selective" ? (
            /* ================= SCREEN 2-A: SELECTIVE STORY BUILDER ================= */
            <div
              id="selective-builder-card"
              className="bg-white rounded-[40px] p-8 border-4 border-[#FEE2E2] shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b pb-4 border-[#FEE2E2]/60">
                <div>
                  <h2 className="text-2xl font-black text-pink cute-font">
                    {lang === "KO"
                      ? "안녕하세요, 동화 궁궐에 오신 걸 환영해요."
                      : "Welcome to the Fairy Tale Palace!"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === "KO"
                      ? "아이의 나이와 성향에 알맞은 요술 가루를 뿌려 커스텀 동화를 제작해요. 주인공 정보와 원하는 주제를 선택하면 바로 동화가 생성됩니다."
                      : "We sprinkle magic powder tailored to your child's age and personality to craft a custom story. Just select the protagonist info and desired themes, and the fairy tale will be created instantly!"}
                  </p>
                </div>

                {/* AI Auto Suggest Magic Button */}
                <button
                  id="ai-recommend-fill"
                  onClick={handleAiAutoRecommend}
                  className="bg-mint/10 text-[#5ABAD0] hover:bg-mint/20 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 border-mint/20 animate-bounce"
                >
                  <Lightbulb size={14} className="fill-mint" />
                  <span>AI가 알아서 쏙!</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* L-1: Protagonist Custom Input */}
                <div id="field-protagonist" className="space-y-2">
                  <label className="text-xs font-black text-pink flex items-center gap-1">
                    <span>👤 동화의 주인공 이름</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    id="input-protagonist-name"
                    value={protagonist}
                    onChange={(e) => setProtagonist(e.target.value)}
                    placeholder="주인공 이름을 입력해 주세요 (예: 토리, 민수)"
                    className="w-full bg-warmbg border-2 border-[#FFE2E2] font-semibold text-sm text-slate-755 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:bg-white transition-all"
                  />
                  <p className="text-[10px] text-slate-400">
                    비워둘 경우, 프로필 이름인{" "}
                    <strong>{activeProfile.name}</strong>(으)로 만들어집니다.
                  </p>
                </div>

                {/* L-2: Kid's Age Slider */}
                <div
                  id="field-age"
                  className="space-y-2 flex flex-col justify-end pb-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-black text-slate-500">
                    <span>👶 아이 추천 연령 (난이도 자동 제어)</span>
                    <span className="text-pink font-extrabold text-sm">
                      {age}세 맞춤
                    </span>
                  </div>
                  <input
                    id="slider-age"
                    type="range"
                    min="3"
                    max="9"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink mt-4"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold mt-1">
                    <span>3세 (토들러)</span>
                    <span>6세 (유아)</span>
                    <span>9세 (독립 읽기)</span>
                  </div>
                </div>
              </div>

              {/* M-1: Select Main Emotion/Theme */}
              <div id="field-themes" className="space-y-3">
                <label className="text-xs font-black text-[#5ABAD0] flex items-center gap-1.5">
                  <span>📚 핵심 교훈 및 감정 선택 (택 1)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    return (
                      <button
                        id={`theme-chip-${theme.id}`}
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-3.5 rounded-3xl text-xs font-bold border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-0.5 relative ${
                          isSelected
                            ? "bg-pink/10 border-pink text-pink shadow-md scale-102"
                            : "bg-warmbg border-[#FFE2E2] hover:border-pink text-[#9C5D76]"
                        }`}
                      >
                        <span className="font-black">
                          {theme.label.split(" ")[1]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap">
                          {theme.desc}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-pink rounded-full p-0.5 text-white">
                            <Check size={8} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* M-2: Multi-select Interests keywords */}
              <div id="field-interests" className="space-y-3">
                <label className="text-xs font-black text-slate-500 flex items-center justify-between">
                  <span>🎈 아이가 좋아하는 사물/배경 (다중 선택)</span>
                  <span className="text-[10px] text-slate-400">
                    선택된 키워드: {selectedInterests.length}개
                  </span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                      <button
                        id={`interest-chip-${interest.id}`}
                        key={interest.id}
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-mint border-mint text-white shadow-md font-black"
                            : "bg-mint/5 border-transparent text-[#5ABAD0] hover:border-mint"
                        }`}
                      >
                        <span>{interest.label}</span>
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* M-3: Traditional Motif switch Option (Unique selling factor) */}
              <div
                id="field-traditional-toggle"
                className="bg-warmbg p-6 rounded-[32px] border-4 border-yellow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      🇰🇷 토리동화 시그니처 한국형 모티프 (추천)
                    </span>
                    <p className="font-extrabold text-sm text-slate-800">
                      우리동네 한국전통 모티프를 동화에 확장해 넣을까요?
                    </p>
                    <p className="text-[10.5px] text-slate-500">
                      {lang === "KO"
                        ? "한옥, 전통 한복, 도깨비 주머니, 탈춤, 풍성한 정원 등 원하는 모티프를 다중 선택해보세요!"
                        : "Select multiple traditional motifs: Hanok, lovely Hanbok, goblin pouch, mask dance and beautiful palace garden!"}
                    </p>
                  </div>
                  <button
                    id="toggle-korean-motif"
                    type="button"
                    onClick={() => setExtraKorean(!extraKorean)}
                    className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      extraKorean
                        ? "bg-pink text-white tory-btn border-2 border-pink shadow-md"
                        : "bg-slate-100 text-slate-400 hover:text-slate-600 border-2 border-slate-200"
                    }`}
                  >
                    {extraKorean
                      ? "✨ 모티프 추가 적용됨"
                      : "미적용 (일반 판타지)"}
                  </button>
                </div>

                {extraKorean && (
                  <div className="pt-3 border-t border-yellow/40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-[11px] font-black text-amber-850 mb-3.5 flex items-center gap-1">
                      💡{" "}
                      <span>
                        다중 선택된 모티프가 동화 스토리와 일러스트에 마법처럼
                        스며들어요:
                      </span>
                      <span className="text-pink font-black">
                        ({selectedKoreanMotifs.length}개 선택됨)
                      </span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {KOREAN_MOTIFS.map((motif) => {
                        const isSelected = selectedKoreanMotifs.includes(
                          motif.id,
                        );
                        return (
                          <button
                            id={`korean-motif-chip-${motif.id}`}
                            key={motif.id}
                            type="button"
                            onClick={() => handleKoreanMotifToggle(motif.id)}
                            className={`p-3 rounded-2xl text-xs font-extrabold border flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-100 border-amber-400 text-amber-900 shadow-sm"
                                : "bg-white/80 border-slate-200/60 text-slate-500 hover:border-amber-300"
                            }`}
                          >
                            <span className="truncate">{motif.label}</span>
                            <div
                              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all ${
                                isSelected
                                  ? "bg-amber-500 border-amber-500 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <Check size={10} className="stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* M-4: Art illustrations Style layout Selection */}
              <div id="field-styles" className="space-y-3">
                <label className="text-xs font-black text-purple-700">
                  🎨 그림 일러스트 화풍 선택 (AI 일러스트 화풍 예시)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ART_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <button
                        id={`style-chip-${style.id}`}
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`group p-2 rounded-[24px] border-2 transition-all cursor-pointer text-left overflow-hidden relative flex flex-col gap-2 ${
                          isSelected
                            ? "bg-lavender/15 border-lavender shadow-md ring-2 ring-lavender/30 text-purple-950 font-black"
                            : "bg-white border-slate-100 hover:border-lavender text-slate-700 hover:shadow-sm"
                        }`}
                      >
                        <div className="aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-slate-50 relative">
                          <img
                            src={style.img}
                            alt={style.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-lavender text-white rounded-full p-1 shadow-md">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="px-1 py-1.5">
                          <span className="font-extrabold text-[12px] block text-slate-800">
                            {style.label}
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                            {style.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action buttons */}
              <div
                id="craft-trigger-wrapper"
                className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  id="btn-return-to-main"
                  type="button"
                  onClick={() => setBuildType("home")}
                  className="w-full sm:w-auto px-8 py-4 rounded-[24px] text-sm font-black text-slate-500 hover:text-slate-755 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>동화생성으로 돌아가기</span>
                </button>
                <button
                  id="trigger-craft-fairy-tale"
                  type="button"
                  onClick={handleLaunchCreativeCraft}
                  className="w-full sm:w-auto px-10 py-4 bg-pink rounded-[24px] text-white text-base font-black cute-font tory-btn flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer hover:bg-pink/90 shadow-md shadow-pink/10"
                >
                  <Sparkles className="fill-white animate-pulse" size={16} />
                  <span>동화구워내기 🪄</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= SCREEN 2-B: CONVERSATIONAL PARENT COOPERATIVE ADVISOR ================= */
            <div
              id="conversational-wizard-card"
              className="bg-warmbg border-4 border-lavender rounded-[40px] p-6 sm:p-8 shadow-xl space-y-6 sm:space-y-8"
            >
              {/* STEP PROGRESS NAVIGATION HEADER */}
              <div className="bg-white/70 p-6 rounded-[28px] border border-lavender/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="flex flex-col space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-sm font-black text-[#9857BE] cute-font">
                      대화형 입력
                    </span>
                    <span className="h-4 w-[1.5px] bg-[#C9B1FF]/50 inline-block"></span>
                    <span className="text-xs text-slate-500 font-extrabold font-sans">
                      나만의 동화 만들기
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-450 font-extrabold font-sans leading-normal">
                    {lang === "KO"
                      ? "대화를 통해 특별한 나만의 동화를 만들어갑니다."
                      : "We craft a unique custom story together through tailored answers."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-4 md:gap-5">
                  {[
                    { step: 1, label: "주인공 설정" },
                    { step: 2, label: "주제 설정" },
                    { step: 3, label: "그림체 설정" },
                    { step: 4, label: "동화 설정" },
                  ].map((s, idx) => {
                    const isActive = convStep === s.step;
                    const isPassed = convStep > s.step;
                    return (
                      <React.Fragment key={s.step}>
                        <button
                          type="button"
                          onClick={() => setConvStep(s.step)}
                          className="flex flex-col items-center gap-1.5 focus:outline-none transition-all cursor-pointer"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-sm ${
                              isActive
                                ? "bg-purple-600 text-white ring-4 ring-purple-100"
                                : isPassed
                                  ? "bg-[#C9B1FF] text-purple-950 font-black"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {s.step}
                          </div>
                          <span
                            className={`text-[10px] sm:text-[11px] font-black transition-all ${
                              isActive ? "text-purple-700" : "text-slate-400"
                            }`}
                          >
                            {s.label}
                          </span>
                        </button>
                        {idx < 3 && (
                          <div
                            className={`h-[2px] w-5 sm:w-8 md:w-12 rounded-full transition-all ${
                              isPassed ? "bg-[#C9B1FF]" : "bg-slate-100"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* STEP 1: PROTAGONIST SETTINGS */}
              {convStep === 1 && (
                <div
                  id="wizard-step-1"
                  className="space-y-6 animate-in fade-in duration-200"
                >
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-pink rounded-full inline-block"></span>
                      오늘 이야기의 주인공은 누구인가요?
                    </label>
                    <textarea
                      id="input-conv-protagonist"
                      rows={2}
                      value={convProtagonist}
                      onChange={(e) => setConvProtagonist(e.target.value)}
                      placeholder="예) 둥근 얼굴에 노란 한복을 입은 여자아이 '미희', 하얀 털이 복실거리는 강아지 '아띠'"
                      className="w-full bg-white border-2 border-slate-100 hover:border-pink/40 font-semibold text-xs sm:text-sm text-slate-800 px-4 py-3 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-pink/20 transition-all shadow-inner placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-pink rounded-full inline-block"></span>
                      아이의 나이(또는 학년)를 알려주세요.
                    </label>
                    <p className="text-[10px] text-slate-400 font-extrabold text-slate-400">
                      예) 5세, 초등학교 1학년
                    </p>
                    <input
                      id="input-conv-age"
                      type="text"
                      value={convAge}
                      onChange={(e) => setConvAge(e.target.value)}
                      placeholder="예) 5세, 초등학교 1학년"
                      className="w-full bg-white border-2 border-slate-100 hover:border-pink/40 font-black text-xs sm:text-sm text-slate-800 px-4 py-3.5 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-pink/20 transition-all shadow-sm placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-pink rounded-full inline-block"></span>
                      아이의 성별을 선택해 주세요.
                    </label>
                    <div className="grid grid-cols-3 gap-3.5">
                      {(["남자아이", "여자아이", "선택 안 함"] as const).map(
                        (genderOption) => {
                          const isSelected = convGender === genderOption;
                          return (
                            <button
                              id={`conv-gender-${genderOption}`}
                              key={genderOption}
                              type="button"
                              onClick={() => setConvGender(genderOption)}
                              className={`py-3.5 rounded-[20px] text-xs font-black border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                isSelected
                                  ? "bg-pink/10 border-pink text-pink shadow-sm"
                                  : "bg-white border-slate-100 text-slate-500 hover:border-pink/30 hover:bg-slate-50/50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                  isSelected
                                    ? "border-pink bg-pink"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span>{genderOption}</span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: STORY THEME & LESSONS */}
              {convStep === 2 && (
                <div
                  id="wizard-step-2"
                  className="space-y-6 animate-in fade-in duration-200"
                >
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-teal-600 rounded-full inline-block"></span>
                      어떤 주제의 동화를 원하시나요?
                    </label>
                    <p className="text-[10px] text-slate-400 font-extrabold">
                      아이에게 선물하고 싶은 다채로운 이야기 테마를 선택하세요.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                      {[
                        "우정과 나눔 🤝",
                        "용기와 도전 🦁",
                        "가족 사랑 💝",
                        "상상력 모험 🚀",
                        "자연과 동물 🌿",
                        "바른 습관 & 사회성 ✨",
                        "유치원 & 학교 적응 🎒",
                        "감정 & 공감 능력 💖",
                        "자존감 & 자신감 ⭐",
                        "슬기와 지혜 💡",
                      ].map((themeOption) => {
                        const isSelected = convTheme === themeOption;
                        return (
                          <button
                            id={`conv-theme-${themeOption}`}
                            key={themeOption}
                            type="button"
                            onClick={() => setConvTheme(themeOption)}
                            className={`px-4 py-3.5 rounded-2xl text-xs font-black transition-all border cursor-pointer text-center flex items-center justify-center ${
                              isSelected
                                ? "bg-teal-600 text-white border-teal-600 shadow-md transform -translate-y-0.5"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            {themeOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-teal-600 rounded-full inline-block"></span>
                      동화를 통해 전달하고 싶은 교훈이 있나요?
                    </label>
                    <p className="text-[10px] text-slate-400 font-extrabold">
                      예) 친구와 사이좋게 지내는 법, 포기하지 않는 마음
                    </p>
                    <textarea
                      id="input-conv-lesson"
                      rows={3}
                      value={convLesson}
                      onChange={(e) => setConvLesson(e.target.value)}
                      placeholder="예: 친구와 사이좋게 지내는 법, 포기하지 않는 마음"
                      className="w-full bg-white border-2 border-slate-100 hover:border-teal-600/40 font-semibold text-xs sm:text-sm text-slate-800 px-4 py-3 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: IMAGE ART STYLE */}
              {convStep === 3 && (
                <div
                  id="wizard-step-3"
                  className="space-y-6 animate-in fade-in duration-200"
                >
                  <div className="space-y-4">
                    <label className="text-sm sm:text-base font-black text-purple-700 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-purple-600 rounded-full inline-block"></span>
                      그림 일러스트 화풍 선택 (AI 일러스트 화풍 예시)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {ART_STYLES.map((style) => {
                        const isSelected = selectedStyle === style.id;
                        return (
                          <button
                            id={`conv-style-chip-${style.id}`}
                            key={style.id}
                            type="button"
                            onClick={() => setSelectedStyle(style.id)}
                            className={`group p-2 rounded-[24px] border-2 transition-all cursor-pointer text-left overflow-hidden relative flex flex-col gap-2 ${
                              isSelected
                                ? "bg-lavender/15 border-lavender shadow-md ring-2 ring-lavender/30 text-purple-950 font-black"
                                : "bg-white border-slate-100 hover:border-lavender text-slate-700 hover:shadow-sm"
                            }`}
                          >
                            <div className="aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-slate-50 relative">
                              <img
                                src={style.img}
                                alt={style.label}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-lavender text-white rounded-full p-1 shadow-md">
                                  <Check size={10} className="stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="px-1 py-1.5">
                              <span className="font-extrabold text-[12px] block text-slate-800">
                                {style.label}
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                                {style.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Additional Custom Illustration Requests for Conversational Builder */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <label className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-purple-600 rounded-full inline-block"></span>
                        그림에 추가하고 싶은 요청 사항 (대화형 전용)
                      </label>
                      <p className="text-[10px] text-slate-450 font-extrabold">
                        원하시는 색감, 분위기나 일러스트에 꼭 포함하고 싶은
                        소품을 자유롭게 묘사해주세요.
                      </p>
                      <input
                        id="input-conv-style-extra"
                        type="text"
                        value={convStyleExtra}
                        onChange={(e) => setConvStyleExtra(e.target.value)}
                        placeholder="예) 파스텔 핑크톤을 발랄하게 가미해주세요, 몽환적이고 밤하늘 별들이 반짝이는 느낌으로 칠해주세요"
                        className="w-full bg-white border-2 border-slate-100 hover:border-purple-600/40 font-semibold text-xs sm:text-sm text-slate-800 px-4 py-3.5 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: STORY LENGTH & ADVANCED OPTIONS */}
              {convStep === 4 && (
                <div
                  id="wizard-step-4"
                  className="space-y-6 animate-in fade-in duration-200"
                >
                  <div className="space-y-3">
                    <label className="text-sm sm:text-base font-black text-indigo-700 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block"></span>
                      동화의 분량(길이)을 선택해 주세요.
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {[
                        {
                          id: "짧음 (5~6페이지)",
                          desc: "바쁜 평일 밤, 잠자리 직전 가볍고 알찬 짧은 집중 독서 분량",
                          premium: false,
                        },
                        {
                          id: "보통 (8~14페이지)",
                          desc: "다채로운 낱말공부와 풍성한 대화형 마독 퀴즈까지 여유롭게 소화하는 표준 분량",
                          premium: true,
                        },
                        {
                          id: "길게 (16~30페이지)",
                          desc: "주말 오전이나 집중 독서에 아이와 풍성한 스토리를 교감할 수 있는 긴 분량",
                          premium: true,
                        },
                      ].map((lengthOption) => {
                        const isSelected = convLength === lengthOption.id;
                        const isLocked =
                          subscriptionType === "free" && lengthOption.premium;
                        return (
                          <button
                            id={`conv-length-${lengthOption.id}`}
                            key={lengthOption.id}
                            type="button"
                            onClick={() => handleSelectLength(lengthOption.id)}
                            className={`p-5 rounded-[24px] border-2 transition-all cursor-pointer text-left flex flex-col space-y-1.5 relative ${
                              isSelected
                                ? "bg-indigo-50/70 border-indigo-500 text-indigo-950 font-black shadow-md ring-2 ring-indigo-200/40"
                                : "bg-white border-slate-100 text-slate-705 hover:border-indigo-300 hover:shadow-sm"
                            } ${isLocked ? "bg-slate-50/80 opacity-95" : ""}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                                <span>{lengthOption.id}</span>
                                {isLocked && (
                                  <div className="flex items-center gap-0.5 bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-200 shadow-inner">
                                    <Crown
                                      size={9}
                                      className="fill-amber-500 text-amber-600"
                                    />
                                    <span>PRO</span>
                                  </div>
                                )}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <Check size={8} className="stroke-[3]" />
                                )}
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                              {lengthOption.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advanced Signature Korean motifs toggle */}
                  <div
                    id="field-traditional-toggle"
                    className="bg-[#FFFDF4] p-6 rounded-[32px] border-4 border-yellow space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          🇰🇷 토리동화 시그니처 한국형 모티프 (추천)
                        </span>
                        <p className="font-extrabold text-sm text-slate-800">
                          우리동네 한국전통 모티프를 동화에 확장해 넣을까요?
                        </p>
                        <p className="text-[10.5px] text-slate-500 leading-normal">
                          한옥, 전통 한복, 도깨비 주머니, 탈춤, 풍성한 정원 등
                          원하는 모티프를 자유롭게 다중 선택해보세요!
                        </p>
                      </div>
                      <button
                        id="toggle-korean-motif"
                        type="button"
                        onClick={() => setExtraKorean(!extraKorean)}
                        className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          extraKorean
                            ? "bg-pink text-white tory-btn border-2 border-pink shadow-md"
                            : "bg-slate-100 text-slate-400 hover:text-slate-600 border-2 border-slate-200"
                        }`}
                      >
                        {extraKorean
                          ? "✨ 모티프 추가 적용됨"
                          : "미적용 (일반 판타지)"}
                      </button>
                    </div>

                    {extraKorean && (
                      <div className="pt-3 border-t border-yellow/40 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[11px] font-black text-amber-500 mb-3.5 flex items-center gap-1">
                          💡 <span>스타일과 이야기에 마법처럼 적용됩니다:</span>
                          <span className="text-pink font-black">
                            ({selectedKoreanMotifs.length}개 선택됨)
                          </span>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {KOREAN_MOTIFS.map((motif) => {
                            const isSelected = selectedKoreanMotifs.includes(
                              motif.id,
                            );
                            return (
                              <button
                                id={`korean-motif-chip-${motif.id}`}
                                key={motif.id}
                                type="button"
                                onClick={() =>
                                  handleKoreanMotifToggle(motif.id)
                                }
                                className={`p-3 rounded-2xl text-[11px] font-extrabold border flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-amber-100 border-amber-400 text-amber-900 shadow-sm"
                                    : "bg-white/80 border-slate-200/60 text-slate-500 hover:border-amber-300"
                                }`}
                              >
                                <span className="truncate">{motif.label}</span>
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                                    isSelected
                                      ? "bg-amber-500 border-amber-500 text-white"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check size={8} className="stroke-[3]" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BOTTOM STEP NAVIGATION BUTTONS */}
              <div
                id="wizard-navigation-actions"
                className="pt-6 border-t-2 border-lavender/15 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <button
                  id="btn-return-to-main"
                  type="button"
                  onClick={() => setBuildType("home")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-black text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
                >
                  <span>동화생성으로 돌아가기</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {convStep > 1 && (
                    <button
                      id="prev-step"
                      type="button"
                      onClick={() => setConvStep((prev) => prev - 1)}
                      className="px-6 py-3.5 text-slate-500 hover:text-slate-800 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 hover:bg-slate-50 rounded-2xl"
                    >
                      <ChevronLeft size={14} className="stroke-[2.5]" />
                      <span>이전 단계</span>
                    </button>
                  )}
                  {convStep < 4 ? (
                    <button
                      id="next-step"
                      type="button"
                      onClick={() => setConvStep((prev) => prev + 1)}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-100 flex items-center justify-center gap-1.5 cursor-pointer transition-all tory-btn"
                    >
                      <span>다음 단계</span>
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      id="trigger-craft-conversational"
                      type="button"
                      onClick={handleLaunchCreativeCraft}
                      className="w-full sm:w-auto bg-pink hover:bg-pink/90 text-white font-black text-xs px-10 py-3.5 rounded-2xl shadow-lg shadow-pink/10 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer transition-all tory-btn"
                    >
                      <Sparkles
                        size={12}
                        className="fill-white animate-pulse"
                      />
                      <span>동화구워내기 🪄</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM PREMIUM MEMBERSHIP PROMPT DIALOG */}
      {showPaywallPrompt && (
        <div
          id="sub-prompt-modal-portal"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full mx-auto shadow-2xl border-4 border-amber-300 animate-in zoom-in duration-150 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink"></div>

            <div className="mx-auto w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
              <Crown className="text-amber-500 fill-amber-300" size={26} />
            </div>

            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">
              👑 토리동화 프리미엄 패스
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
              선택하신{" "}
              <span className="text-indigo-600 font-extrabold">
                보통 (8~14페이지)
              </span>{" "}
              및{" "}
              <span className="text-indigo-600 font-extrabold">
                길게 (16~30페이지)
              </span>{" "}
              설정은 프리미엄 멤버십 전용 기능입니다.
              <br />
              <br />
              구독 페이지로 이동하여 안전하게 결제를 진행하시겠습니까?
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowPaywallPrompt(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-extrabold transition-all cursor-pointer rounded-xl"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaywallPrompt(false);
                  onOpenPaywall();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white text-xs font-extrabold transition-all cursor-pointer rounded-xl shadow-md shadow-amber-100"
              >
                예, 구독할게요!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
