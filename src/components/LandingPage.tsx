import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  LogIn,
  Moon,
  Sun,
  ArrowRight,
  Languages,
  Palette,
  Sparkle,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onExperience: (mode: "selective" | "conversational") => void;
  nightMode: boolean;
  setNightMode: (mode: boolean) => void;
  lang: "KO" | "EN";
  setLang: (lang: "KO" | "EN") => void;
  palette: number;
  setPalette: (palette: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onExperience,
  nightMode,
  setNightMode,
  lang,
  setLang,
  palette,
  setPalette,
}) => {
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  // Simple fun color scheme preset selector for the "컬러 팔레트" link
  const palettes = [
    { bg: "bg-warmbg", accent: "text-pink" },
    { bg: "bg-warmbg", accent: "text-pink" },
    { bg: "bg-warmbg", accent: "text-pink" },
    { bg: "bg-warmbg", accent: "text-pink" },
  ];

  const currentPalette = palettes[palette] || palettes[0];

  const handleSubscribeClick = () => {
    if (lang === "KO") {
      alert(
        "👑 구독 멤버십 안내\n\n월 14,900원으로 무제한 AI 수면 동화 책 굽기와 아이 맞춤 일러스트를 즐겨보세요! 로그인 후 구독하실 수 있습니다.",
      );
    } else {
      alert(
        "👑 Premium Membership Info\n\nFor only $14.90/month, bake unlimited AI bedtime fairy tales and custom illustrations! Available after logging in.",
      );
    }
    onLogin();
  };

  return (
    <div
      id="landing-container"
      className={`min-h-screen flex flex-col transition-all duration-300 ${
        nightMode
          ? "bg-[#090E1A] text-slate-100"
          : `${currentPalette.bg} text-slate-800`
      }`}
    >
      {/* 1. Header Bar */}
      <header
        id="landing-header"
        className={`px-8 py-4 flex items-center justify-between border-b-4 ${
          nightMode
            ? "border-indigo-950/80 bg-[#0B1528]/80"
            : "border-[#FEE2E2] bg-white/90"
        } backdrop-blur-md sticky top-0 z-50`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-pink rounded-full flex items-center justify-center shadow-md animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <Sparkle className="text-white fill-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-pink cute-font tracking-tight leading-none flex items-center gap-1.5">
              토리동화
              <span className="text-mint text-[11px] font-bold font-sans">
                Tory Tale
              </span>
            </h1>
          </div>
        </div>

        {/* Top-right menu links */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-black text-slate-500 flex-wrap justify-end">
          <button
            id="landing-lang-toggle"
            onClick={() => setLang(lang === "KO" ? "EN" : "KO")}
            className="hover:text-pink flex items-center gap-1 transition-all cursor-pointer"
          >
            <Languages size={14} />
            <span>{lang === "KO" ? "English" : "한국어"}</span>
          </button>

          <span className="text-slate-200 hidden sm:inline">|</span>

          <div className="relative">
            <button
              id="landing-palette-button"
              onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
              className="hover:text-pink flex items-center gap-1 transition-all cursor-pointer font-black"
            >
              <Palette size={14} className="text-pink animate-pulse" />
              <span>{lang === "KO" ? "색상 테마" : "Themes"}</span>
            </button>

            {paletteDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-2xl border p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left ${
                  nightMode
                    ? "bg-[#0F223D] border-indigo-900 text-slate-100"
                    : "bg-white border-slate-200 text-slate-705"
                }`}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-0 border-b-slate-100/10 mb-1">
                  {lang === "KO" ? "🎨 테마 컬러 선택" : "🎨 Select Theme"}
                </div>
                <div className="space-y-1">
                  {[
                    {
                      id: 0,
                      label_ko: "🎀 오리지널 핑크",
                      label_en: "🎀 Original Pink",
                      color: "bg-[#FF6B9D]",
                    },
                    {
                      id: 1,
                      label_ko: "🌌 클래식 청황",
                      label_en: "🌌 Classic Blue",
                      color: "bg-[#1f3c88]",
                    },
                    {
                      id: 2,
                      label_ko: "🌊 페어리 오션",
                      label_en: "🌊 Fairy Ocean",
                      color: "bg-[#3f67c6]",
                    },
                    {
                      id: 3,
                      label_ko: "🍓 스위트 딸기",
                      label_en: "🍓 Sweet Berries",
                      color: "bg-[#ff7b90]",
                    },
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setPalette(th.id);
                        setPaletteDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        palette === th.id
                          ? "bg-pink/10 text-pink font-black"
                          : "hover:bg-slate-100/30 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${th.color} inline-block border border-slate-300/40`}
                      />
                      <span className="truncate">
                        {lang === "KO" ? th.label_ko : th.label_en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-slate-200 hidden sm:inline">|</span>

          <button
            id="landing-night-toggle"
            onClick={() => setNightMode(!nightMode)}
            className="hover:text-pink flex items-center gap-1 transition-all cursor-pointer"
          >
            {nightMode ? (
              <Sun size={14} className="text-amber-400" />
            ) : (
              <Moon size={14} />
            )}
            <span>{lang === "KO" ? "수면 테마" : "Sleep Theme"}</span>
          </button>

          <span className="text-slate-200 hidden sm:inline">|</span>

          <div className="flex items-center gap-4">
            <button
              id="landing-sub-link"
              onClick={handleSubscribeClick}
              className="hover:text-pink cursor-pointer font-extrabold"
            >
              {lang === "KO" ? "구독 가이드" : "Membership"}
            </button>
            <button
              id="landing-login-link"
              onClick={onLogin}
              className="bg-pink text-white px-4 py-2 rounded-2xl hover:bg-pink/90 transition-all font-black shadow-md cursor-pointer tory-btn"
            >
              {lang === "KO" ? "로그인" : "Login"}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        id="landing-hero"
        className="flex-1 py-12 px-6 max-w-5xl mx-auto w-full text-center flex flex-col justify-center items-center space-y-6"
      >
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="bg-pink/10 text-pink px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles
              size={12}
              className="fill-pink animate-spin"
              style={{ animationDuration: "8s" }}
            />
            {lang === "KO"
              ? "세상에 단 하나뿐인 요술 동화 배달"
              : "The Magic Fairy Tale Delivered For Your Child"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight cute-font">
            {lang === "KO"
              ? "호롱빛이 머무는 밤, 우리 아이만의 이야기"
              : "Customized Fairy Tales Just For Our Child"}
          </h2>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            {lang === "KO"
              ? "아이의 작은 상상과 소중한 하루를 담아 세상에 하나뿐인 맞춤 동화를 만들어보세요."
              : "Put your child's name and tastes to make the only one-of-a-kind story in the world."}
          </p>
          <p className="text-xs text-slate-400">
            {lang === "KO"
              ? "매일 밤 특별한 이야기로 아이와 더 가까워질 수 있습니다."
              : "Get closer to your child with special stories every single night."}
          </p>
        </div>

        {/* 3. Section: "동화 만들기 방식 선택" */}
        <div
          id="landing-creation-options"
          className="w-full pt-10 space-y-6 animate-in fade-in delay-200 duration-500"
        >
          <h3 className="text-lg font-black text-slate-700 tracking-tight flex items-center justify-center gap-2">
            <span>
              ✨{" "}
              {lang === "KO"
                ? "동화 만들기 방식 선택"
                : "Select Story Creation Mode"}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option A: Selective story builder */}
            <div
              id="landing-card-selective"
              className="bg-white rounded-3xl p-6 border-4 border-[#FEE2E2] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-stretch text-left space-y-4 group"
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-pink uppercase tracking-wider">
                  OPTION 01
                </span>
                <h4 className="text-xl font-extrabold text-slate-800 group-hover:text-pink transition-all">
                  {lang === "KO" ? "선택형 동화" : "Selective Story"}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {lang === "KO"
                    ? "제시된 옵션을 고르며 이야기를 완성해가는 방식입니다. 처음 이용하시는 분께 추천드립니다."
                    : "Create stories step-by-step by selecting cute options. Perfect for first-time builders!"}
                </p>
              </div>

              {/* Graphical Wireframe/Placeholder matching the screenshot precisely but highly polished */}
              <div className="bg-[#F8FAFC] border-4 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden p-4 group-hover:border-pink/40 transition-colors">
                {/* Diagonal crosslines representing wireframe / illustration box */}
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
                    strokeWidth="2"
                  />
                  <line
                    x1="100%"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                {/* Simulated Interactive Elements representing story wizard */}
                <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
                  <div className="flex gap-2">
                    <span className="bg-pink/20 text-pink text-[10px] font-black px-2 py-1 rounded-full border border-pink/30">
                      {lang === "KO" ? "💖 친절함" : "💖 Kindness"}
                    </span>
                    <span className="bg-mint/20 text-mint text-[10px] font-black px-2 py-1 rounded-full border border-mint/30">
                      {lang === "KO" ? "🐰 토끼친구" : "🐰 Bunny Friend"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-400 group-hover:text-pink/80 transition-all">
                    {lang === "KO"
                      ? "선택형 동화 예시 화면"
                      : "Selective Mode Preview"}
                  </span>
                  <div className="w-16 h-10 bg-white/80 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-rose-300 animate-pulse">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>

              <button
                id="landing-btn-selective"
                onClick={() => onExperience("selective")}
                className="w-full bg-slate-800 hover:bg-pink text-white font-black py-4 rounded-2xl transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer tory-btn text-sm flex items-center justify-center gap-1.5"
              >
                <span>
                  {lang === "KO"
                    ? "선택형으로 만들기"
                    : "Build Selective Story"}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Option B: Conversational / parent advisor story builder */}
            <div
              id="landing-card-conversational"
              className="bg-white rounded-3xl p-6 border-4 border-lavender/70 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-stretch text-left space-y-4 group"
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  OPTION 02
                </span>
                <h4 className="text-xl font-extrabold text-slate-800 group-hover:text-purple-600 transition-all">
                  {lang === "KO" ? "대화형 동화" : "Conversational Story"}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {lang === "KO"
                    ? "AI와 자유롭게 대화하며 원하는 이야기를 직접 만들어가는 방식입니다."
                    : "Chat freely with AI to guide the tale directly. Perfect for custom, tailored needs."}
                </p>
              </div>

              {/* Graphical Wireframe/Placeholder matching the screenshot precisely but highly polished */}
              <div className="bg-[#F8FAFC] border-4 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden p-4 group-hover:border-lavender/50 transition-colors">
                <svg
                  className="absolute inset-0 w-full h-full text-slate-100 group-hover:text-lavender/5 pointer-events-none transition-colors"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="100%"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                {/* Simulated Chat Bubbles representing story conversation */}
                <div className="relative z-10 flex flex-col items-center space-y-2 text-center w-full max-w-[200px]">
                  <div className="bg-lavender/25 text-[#9A7BE6] text-[9px] font-black p-2 rounded-2xl rounded-tl-none self-start max-w-[150px] text-left">
                    {lang === "KO"
                      ? '"오늘 수잔이는 편식을 해서..."'
                      : '"Since Susan did not finish veggies..."'}
                  </div>
                  <span className="text-xs font-black text-slate-400 group-hover:text-purple-600/80 transition-all pt-1">
                    {lang === "KO"
                      ? "대화형 동화 예시 화면"
                      : "Conversational Preview"}
                  </span>
                  <div className="bg-purple-100/30 text-purple-700 text-[9px] font-black p-2 rounded-2xl rounded-tr-none self-end max-w-[150px] text-left">
                    {lang === "KO"
                      ? '"시금치 요정이 등장하는 모험!"'
                      : '"Spinach fairy adventure magic!"'}
                  </div>
                </div>
              </div>

              <button
                id="landing-btn-conversational"
                onClick={() => onExperience("conversational")}
                className="w-full bg-slate-800 hover:bg-[#9A7BE6] text-white font-black py-4 rounded-2xl transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer tory-btn text-sm flex items-center justify-center gap-1.5"
              >
                <span>
                  {lang === "KO"
                    ? "대화형으로 만들기"
                    : "Build Conversational Story"}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Footer LogIn Callout */}
      <section
        id="landing-callout"
        className={`py-12 px-6 border-t-4 text-center space-y-4 ${
          nightMode
            ? "border-indigo-950/80 bg-[#0B1528]/40"
            : "border-[#FEE2E2] bg-white/40"
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <h4 className="text-lg font-black text-slate-800 cute-font">
            {lang === "KO"
              ? "지금 바로 첫 동화를 무료로 만들어보세요"
              : "Start browning your first story for free"}
          </h4>
          <p className="text-xs text-slate-500">
            {lang === "KO"
              ? "가입 없이도 체험 가능하며, 저장 및 기록 관리는 로그인 후 자유롭게 이용할 수 있습니다."
              : "Try baking tales without signup. Log in later to safe records and unlock kids analytics."}
          </p>
        </div>

        <button
          id="landing-btn-login-cta"
          onClick={onLogin}
          className="bg-slate-800 hover:bg-pink text-white font-black text-base px-16 py-4 rounded-2xl shadow-xl transition-all cursor-pointer tory-btn"
        >
          {lang === "KO" ? "로그인하기" : "Login Now"}
        </button>
      </section>
    </div>
  );
};
