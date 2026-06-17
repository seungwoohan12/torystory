import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Check,
  Flame,
  Star,
  Compass,
  Paintbrush,
  BookOpen,
} from "lucide-react";

interface StoryProgressProps {
  onComplete: () => void;
}

const STEPS = [
  {
    id: 1,
    label: "소재 분석 및 아이 성향 매핑",
    icon: Compass,
    detail: "아이의 나이와 관심사를 어루만져 마법 캐릭터를 성기게 배치해요.",
  },
  {
    id: 2,
    label: "기승전결 기틀 및 따스한 국문 윤문",
    icon: Star,
    detail: "정교한 감성 플롯에 맞춰 꼬마 아이를 품을 동화 구성을 짜요.",
  },
  {
    id: 3,
    label: "씬 분할 및 5대 글로벌 다국어 고윤 번역",
    icon: Flame,
    detail: "영어, 일본어, 중국어, 스페인어 번역을 동시 설계해요.",
  },
  {
    id: 4,
    label: "어린이 화풍 일러스트 프롬프트 정밀 보정",
    icon: Paintbrush,
    detail: "DALL·E 전용 최적 조화 좌표계와 색감 코드를 인코딩합니다.",
  },
  {
    id: 5,
    label: "영유아 전용 동화책 삽화 렌더링 진행",
    icon: Sparkles,
    detail: "파스텔 수채 화풍의 아름다운 풍경과 동화를 그려 올립니다.",
  },
  {
    id: 6,
    label: "이해·감정·창의·어휘 4종 교육 놀이마당 설계",
    icon: BookOpen,
    detail: "동화 내용을 기반으로 맞춤 놀이마당 퀴즈와 플래시 카드를 조립해요.",
  },
];

export const StoryProgress: React.FC<StoryProgressProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Elegant progressing simulator that takes around 5 seconds total.
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 900);

    const percentInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(percentInterval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
      });
    }, 45);

    return () => {
      clearInterval(stepInterval);
      clearInterval(percentInterval);
    };
  }, [onComplete]);

  return (
    <div
      id="story-progress-container"
      className="max-w-2xl mx-auto py-8 text-center space-y-8 px-4"
    >
      {/* Upper cute load animation */}
      <div className="relative inline-block">
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF6B9D] via-[#FFD93D] to-[#7ECEC4] flex items-center justify-center animate-spin"
          style={{ animationDuration: "5s" }}
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Sparkles
              className="text-[#FF6B9D] fill-[#FF6B9D] animate-bounce"
              size={32}
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-6 h-6 bg-[#C9B1FF] rounded-full text-white flex items-center justify-center animate-ping">
          <Star size={10} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          토리가 마법 동화를 열심히 굽고 있어요! 🧁
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          6단계 AI 파이프라인 가동 중 • {percent}% 완성
        </p>
      </div>

      {/* Real Percent bar */}
      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-200/40">
        <div
          id="progress-bar-fill"
          className="h-full bg-gradient-to-r from-[#FF6B9D] via-[#FFD93D] to-[#7ECEC4] rounded-full transition-all duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Six Pipeline List steps */}
      <div
        id="pipeline-steps-list"
        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/30 text-left space-y-4"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#7ECEC4]">
          토리 독서 공방 실시간 공정표
        </span>

        <div className="space-y-3 mt-2">
          {STEPS.map((step) => {
            const stepIcon = React.createElement(step.icon, { size: 14 });
            const isCompleted = currentStep > step.id || percent === 100;
            const isActive = currentStep === step.id && percent < 100;

            return (
              <div
                id={`pipeline-step-${step.id}`}
                key={step.id}
                className={`flex items-start gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#7ECEC4]/5 border-[#7ECEC4]/15 opacity-70"
                    : isActive
                      ? "bg-gradient-to-r from-[#FF6B9D]/5 to-[#FFD93D]/5 border-[#FF6B9D] scale-102"
                      : "bg-white border-transparent opacity-40"
                }`}
              >
                {/* Stage status bullet indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-[#7ECEC4] text-white"
                      : isActive
                        ? "bg-[#FF6B9D] text-white animate-pulse"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-black flex items-center gap-2 ${
                      isActive ? "text-slate-800" : "text-slate-600"
                    }`}
                  >
                    <span className="opacity-70">{stepIcon}</span>
                    <span>{step.label}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed truncate mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
