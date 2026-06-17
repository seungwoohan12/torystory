import React, { useState } from "react";
import {
  Check,
  X,
  ArrowLeft,
  Sparkles,
  Gem,
  Crown,
  ShieldCheck,
  Coins,
  Flame,
  Zap,
  FileText,
  Image as ImageIcon,
  Volume2,
  Sparkle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface PaywallProps {
  currentSubscription: "free" | "premium";
  onUpgradeSuccess: () => void;
  onClose?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({
  currentSubscription,
  onUpgradeSuccess,
  onClose,
}) => {
  // Navigation mode: "summary" (구독-결제) or "compare" (요금제 비교)
  const [viewMode, setViewMode] = useState<"summary" | "compare">("summary");
  const [showPreparationModal, setShowPreparationModal] = useState(false);

  // High-fidelity structured comparison data for a highly designed interactive list
  const comparisonSpecs = [
    {
      category: "창작 & AI 도구",
      features: [
        {
          name: "월간 동화 생성 개수",
          desc: "매달 새롭게 만들 수 있는 AI 동화책 수량",
          free: "월 3편 제한",
          premium: "평생 무제한 생성",
          isPremiumHighlight: true,
        },
        {
          name: "스토리 다각화 필터",
          desc: "연령 필터 및 맞춤형 문맥 안전 단어 변환",
          free: "기본 필터",
          premium: "실시간 세이프가드 필터",
          isPremiumHighlight: true,
        },
      ],
    },
    {
      category: "테마 & 캐릭터 라이브러리",
      features: [
        {
          name: "동화 배경 테마 가짓수",
          desc: "우주, 동화마을, 한옥 테마 등 배경 디자인 스키마",
          free: "기본 1종",
          premium: "전체 테마 무제한 제공",
          isPremiumHighlight: true,
        },
        {
          name: "동화 캐릭터 풍부도",
          desc: "이야기에 직접 등장할 수 있는 AI 페르소나 캐릭터",
          free: "기본 5종",
          premium: "50종 이상 전체 해금",
          isPremiumHighlight: true,
        },
      ],
    },
    {
      category: "내보내기 & 미디어",
      features: [
        {
          name: "PDF 소장용 저장 화질",
          desc: "실제 책으로 인쇄할 수 있는 초고해상도 패키지 변환",
          free: "일반 화면 해상도",
          premium: "초고화질 인쇄용 인코딩",
          isPremiumHighlight: true,
        },
        {
          name: "AI 입체 오디오 성우",
          desc: "이야기를 읽어주는 오디오 더빙 발음 퀄리티",
          free: "기본 기계음 TTS",
          premium: "차세대 자연스러운 성우 보이스",
          isPremiumHighlight: true,
        },
        {
          name: "광고 없는 몰입형 감상",
          desc: "아이의 온전한 집중을 해치지 않는 완전 제로 광고 환경",
          free: "배너 광고 포함",
          premium: "100% 광고 없는 청정 구역",
          isPremiumHighlight: true,
        },
      ],
    },
  ];

  return (
    <div
      id="subscription-billing-view"
      className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300 select-none"
    >
      {viewMode === "summary" ? (
        /* ================= SCREEN 1: 구독-결제 (Summary View) ================= */
        <div className="space-y-8">
          {/* Header Title */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-bold">
                Billing & Plans
              </span>
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                구독 · 결제 관리
              </h2>
            </div>
          </div>

          {/* Current Plan Information Card with Gradient Splash */}
          <div className="relative bg-white rounded-[28px] p-6 md:p-8 border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 via-transparent to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-100/20 via-transparent to-transparent rounded-full pointer-events-none" />

            <div className="space-y-2 animate-in slide-in-from-left-5 duration-300 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 text-[10px] font-black text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Active Plan
              </div>
              <h3 className="text-[22px] font-black text-slate-800 tracking-tight">
                무료 체험 플랜
              </h3>
              <p className="text-[12.5px] font-medium text-slate-500">
                매달 제공되는 기본 동화창작 도구가 무료로 가동 중입니다.
              </p>
              <div className="inline-flex items-center gap-2 mt-1 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/30 text-[11px] font-semibold text-indigo-700">
                <Sparkles size={11} className="text-indigo-500" />
                <span>기본형 월 5편 동화 빌드 제공</span>
              </div>
            </div>

            <button
              id="switch-to-compare-btn"
              type="button"
              onClick={() => setViewMode("compare")}
              className="relative z-10 self-start md:self-auto bg-slate-900 hover:bg-black text-[12px] text-white font-extrabold px-6 py-4 rounded-2xl transition-all duration-200 cursor-pointer text-center shadow-md active:scale-98 flex items-center justify-center gap-1.5"
            >
              <span>상세 플랜 비교하기</span>
              <ChevronRight
                shapeRendering="geometricPrecision"
                size={14}
                className="text-slate-400"
              />
            </button>
          </div>

          {/* Secondary billing details grid - with unique visual design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Next Payment Date */}
            <div className="bg-slate-50/70 rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  NEXT BILLING
                </div>
                <h4 className="text-xs font-bold text-slate-700">
                  다음 결제 예정일
                </h4>
                <div className="text-xl font-black text-slate-400 tracking-tight py-1">
                  —
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-400 border-t border-slate-200/30 pt-3">
                무료 체험 단계에서는 자동 연장 청구가 발생하지 않습니다.
              </p>
            </div>

            {/* Card 2: Estimated Billing Amount */}
            <div className="bg-slate-50/70 rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  ESTIMATED PRICE
                </div>
                <h4 className="text-xs font-bold text-slate-700">
                  이번 달 청구 원금
                </h4>
                <div className="text-xl font-black text-slate-400 tracking-tight py-1">
                  0원
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-400 border-t border-slate-200/30 pt-3">
                프리미엄 요금제로 전격 해금 시 매월 일정일에 청구됩니다.
              </p>
            </div>

            {/* Card 3: Payment Method */}
            <div className="bg-slate-50/70 rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  BILLING METHOD
                </div>
                <h4 className="text-xs font-bold text-slate-700">
                  등록된 지불 수단
                </h4>
                <div className="text-xs font-extrabold text-slate-300 py-2.5">
                  연결 수단 없음
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-400 border-t border-slate-200/30 pt-3">
                안전하게 암호화된 신용카드 및 간편 결제를 추가할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Premium Benefits - Custom Designed & High Quality */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <Crown size={15} className="text-amber-500 fill-amber-100" />
              <h3 className="text-[15px] font-black text-slate-800">
                아이의 상상력을 넓히는 프리미엄 가치
              </h3>
            </div>

            {/* Highly detailed custom benefit grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-indigo-50/40 to-white rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-3 relative group hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 mb-2">
                  <Sparkles size={18} />
                </div>
                <h4 className="text-[14px] font-extrabold text-slate-800">
                  무제한 AI 동화 창작
                </h4>
                <p className="text-[11.5px] leading-relaxed text-slate-500">
                  생성 편수에 지장이 없는 무한 엔진을 통해 아이가 직접 엮어내는
                  창의 문맥을 어떠한 중단과 딜레이도 없이 이어갈 수 있습니다.
                </p>
              </div>

              <div className="bg-gradient-to-b from-sky-50/40 to-white rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-3 relative group hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-100/80 flex items-center justify-center text-sky-600 mb-2">
                  <ImageIcon size={18} />
                </div>
                <h4 className="text-[14px] font-extrabold text-slate-800">
                  스킨 테마 및 50+ 캐릭터
                </h4>
                <p className="text-[11.5px] leading-relaxed text-slate-500">
                  그림체의 테두리 레이아웃 스키마뿐만 아니라 우주 탐험가, 전래
                  요정, 꿈꾸는 고양이 등 수십 가지의 동화 전용 페르소나가 전면
                  오픈됩니다.
                </p>
              </div>

              <div className="bg-gradient-to-b from-purple-50/40 to-white rounded-[24px] p-6 border border-slate-200/50 shadow-3xs space-y-3 relative group hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-600 mb-2">
                  <FileText size={18} />
                </div>
                <h4 className="text-[14px] font-extrabold text-slate-800">
                  명품 인쇄용 PDF 소장 패키지
                </h4>
                <p className="text-[11.5px] leading-relaxed text-slate-500">
                  만들어낸 세상에 단 하나뿐인 일러스트 동화책을 언제든지 화질
                  저하 없이 초대형 파일로 내보내 진짜 어린이 서재에 배치할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Elegant Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-xs font-bold">
            <button
              id="start-premium-link"
              type="button"
              onClick={() => setShowPreparationModal(true)}
              className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer hover:opacity-90 transition-all flex items-center gap-1"
            >
              <Crown size={12} className="fill-indigo-100" />
              <span>프리미엄 바로 해금하기</span>
            </button>

            <button
              id="compare-all-link"
              type="button"
              onClick={() => setViewMode("compare")}
              className="text-slate-400 hover:text-slate-600 underline cursor-pointer transition-all flex items-center gap-1"
            >
              <span>전체 명세 및 요금제 비교</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= SCREEN 2: 요금제 비교 (Detail Comparison View) ================= */
        <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
          {/* Header & Back Link with premium styling */}
          <div className="space-y-3">
            <button
              id="back-to-summary-link"
              type="button"
              onClick={() => setViewMode("summary")}
              className="group text-[11px] text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <ArrowLeft
                size={12}
                className="group-hover:-translate-x-0.5 transition-transform text-slate-400"
              />
              <span>구독 · 결제 설정으로 돌아가기</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black">
                Plan Pricing
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                아이를 위한 무한한 동화책 요금제 비교
              </h2>
            </div>
          </div>

          {/* Main Plan Comparison Cards Display - Highly designed with premium colors (Free vs Premium) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2">
            {/* 1. Free plan option card (Sleek Minimalist Slate) */}
            <div className="bg-slate-50/50 rounded-[28px] p-8 border border-slate-200 shadow-3xs flex flex-col justify-between space-y-8 transition-transform hover:scale-[1.005]">
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Standard
                  </div>
                  <h3 className="text-lg font-black text-slate-800">
                    무료 체험 기본형
                  </h3>
                  <p className="text-[12px] leading-relaxed text-slate-500">
                    가족당 제한된 횟수로 기본 동화 빌드 기능을 단순 체험
                    중입니다.
                  </p>
                </div>

                {/* Benefits checked bullets */}
                <ul className="space-y-3.5 pt-2 text-[12px] font-medium text-slate-600">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>월 최대 3편 동화 조립 및 저장</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>기본 캐릭터 일러스트 5개 한정</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>저용량 일반 해상도 PDF 내보내기</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>일람 화면 내 외부 광고 배너 노출</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-200/50 text-slate-500 text-[11.5px] font-extrabold py-3.5 px-4 rounded-xl text-center select-none border border-slate-200/60 shadow-3xs">
                현재 전격 이용 중
              </div>
            </div>

            {/* 2. Premium plan option card (Gorgeous Purple Glow & Dual-tone Gradient Banner) */}
            <div className="relative bg-slate-900 rounded-[28px] p-8 border-2 border-indigo-500 shadow-lg flex flex-col justify-between space-y-8 overflow-hidden transition-transform hover:scale-[1.01]">
              {/* Premium Glow effect in background */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl -ml-6 -mb-6 pointer-events-none" />

              {/* Recommended Badge */}
              <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                추천 · BEST
              </div>

              <div className="space-y-5 relative z-10">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Crown size={10} className="fill-indigo-400" /> Unlimited
                    Child Creator
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      프리미엄 무제한형
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      / 월 멤버십
                    </span>
                  </div>
                  <div className="text-xl font-bold text-indigo-300 tracking-tight mt-0.5">
                    월 9,900원
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed pt-1">
                    제약 조건을 모두 지워내 어떤 주제든 실시간으로 무한 창조하는
                    인공지능 스토리 홈서가입니다.
                  </p>
                </div>

                {/* Benefits lists with beautiful emerald/indigo checkpoints */}
                <ul className="space-y-3.5 pt-2 text-[12px] font-bold text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>이야기 창작 개수 무제한 평생 해제</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>
                      프리미엄 일러스트 캐릭터 50개 이상 완전 전면 지급
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>제작 완료본 고해상도 인쇄용 PDF 즉시 저장</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>배너 및 전면 팝업 광고 완전 무노출 청정 가동</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>독서 습관 분석 기반 AI 맞춤 테마 코칭 권장</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>보호자 전용 채널 및 피드백 신속 우선 회신</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                id="premium-get-started-btn"
                onClick={() => setShowPreparationModal(true)}
                className="relative z-10 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black py-4 rounded-xl transition-all duration-200 cursor-pointer text-center shadow-md active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Gem size={14} className="animate-pulse" />
                <span>프리미엄 챌린지 시작하기</span>
              </button>
            </div>
          </div>

          {/* Unique, non-GPT-like Premium Feature Spec-Grid: Styled visually as beautiful interactive comparison rowcards */}
          <div className="space-y-5 pt-8">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center justify-center md:justify-start gap-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>체크리스트 요약 및 플랜 자격 증명</span>
              </h3>
              <p className="text-[11.5px] text-slate-400 leading-relaxed">
                각 기능을 정밀 비교하여 보육 및 교육 목적에 꼭 맞는 탁월한 창조
                시스템을 결정해 보세요.
              </p>
            </div>

            {/* Custom specification listing by grouping categories */}
            <div className="space-y-6">
              {comparisonSpecs.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3">
                  {/* Category Header Label */}
                  <div className="text-[11px] font-black text-slate-400 bg-slate-100/50 py-1.5 px-3.5 rounded-lg inline-block">
                    {group.category}
                  </div>

                  {/* Rows Grid */}
                  <div className="space-y-2">
                    {group.features.map((feature, featureIdx) => (
                      <div
                        key={featureIdx}
                        className="bg-white hover:bg-slate-50/45 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-3xs transition-colors"
                      >
                        {/* Feature Information block */}
                        <div className="space-y-0.5 max-w-sm">
                          <div className="font-bold text-slate-800 text-[12.5px]">
                            {feature.name}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-relaxed">
                            {feature.desc}
                          </div>
                        </div>

                        {/* Comparative Badge status capsules */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[320px] items-center text-center">
                          {/* Free Status pill */}
                          <div className="bg-slate-100/70 border border-slate-200/40 py-2 px-3 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block scale-90">
                              FREE
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                              {feature.free}
                            </span>
                          </div>

                          {/* Premium Status pill */}
                          <div className="bg-indigo-50 border border-indigo-100/60 py-2 px-3 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-0.5 scale-90">
                              <Sparkle size={8} className="fill-indigo-400" />{" "}
                              PREMIUM
                            </span>
                            <span className="text-[11px] font-extrabold text-indigo-700 mt-0.5">
                              {feature.premium}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer disclaimer */}
            <p className="text-[10px] text-slate-400/80 text-center leading-relaxed max-w-lg mx-auto py-3">
              💡 결제 시 지불 파트너 승인 사정에 따라 소정의 카드 검증 수수료가
              일시 청구 및 자동 취소될 수 있습니다. 프리미엄 혜택은 환불 규정에
              근거하여 불이용 기간에 비례해 반환을 철저히 보징합니다.
            </p>
          </div>
        </div>
      )}

      {/* ================= ELEGANT POPUP MODAL: "아직 준비중" Feature Release Announcement ================= */}
      {showPreparationModal && (
        <div
          id="preparation-alert-modal"
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-[32px] w-full max-w-sm p-7 border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center space-y-5">
            {/* Close Cross button */}
            <button
              id="close-prep-modal-btn"
              type="button"
              onClick={() => setShowPreparationModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={15} />
            </button>

            {/* Warning Mascot/Design with pulsating halo */}
            <div className="relative w-14 h-14 bg-gradient-to-tr from-amber-50 to-amber-100/60 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-200/50 shadow-sm">
              <span className="absolute inset-0 rounded-full bg-amber-400/10 animate-ping duration-1000" />
              <Crown
                size={24}
                className="fill-amber-200/50 animate-pulse relative z-10"
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-slate-800 text-[16px] tracking-tight">
                서비스 정식 준비 중 🛠️
              </h4>
              <p className="text-[11.5px] text-slate-500 leading-relaxed px-1">
                현재 프리미엄 결제 모듈 연동 및 카드 지불 심사가 정식 등록
                절차에 따라 최종 진행 중입니다!
              </p>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-[10.5px] font-bold text-indigo-500 inline-block mt-1">
                🚀 다음 업데이트 시 바로 오픈될 예정입니다.
              </div>
            </div>

            {/* Accept / Confirm clean button */}
            <button
              type="button"
              id="accept-prep-modal-btn"
              onClick={() => setShowPreparationModal(false)}
              className="w-full bg-slate-800 hover:bg-black text-white text-xs font-extrabold py-3 rounded-xl transition-all duration-150 cursor-pointer text-center shadow-xs"
            >
              알림 받기 및 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
