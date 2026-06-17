import React, { useState, useEffect } from "react";
import { generateStory } from "./services/storyPipeline";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { Header } from "./components/Header";
import { FairyTaleBuilder } from "./components/FairyTaleBuilder";
import { StoryProgress } from "./components/StoryProgress";
import { StoryViewer } from "./components/StoryViewer";
import { PlayRoom } from "./components/PlayRoom";
import { Dashboard } from "./components/Dashboard";
import { SafetySettings } from "./components/SafetySettings";
import { Bookshelf } from "./components/Bookshelf";
import { Paywall } from "./components/Paywall";
import {
  FairyTale,
  UserSession,
  ReadingHistory,
  ChildProfile,
  ParentSettings,
} from "./types";
import { initialProfiles, defaultSettings, defaultFairytales } from "./data";
import {
  ShieldAlert,
  Check,
  X,
  Sparkles,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("create");
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [initialBuildType, setInitialBuildType] = useState<
    "home" | "selective" | "conversational"
  >("home");
  const [lang, setLang] = useState<"KO" | "EN">("KO");
  const [palette, setPalette] = useState<number>(0);

  useEffect(() => {
    document.body.classList.remove(
      "theme-palette-0",
      "theme-palette-1",
      "theme-palette-2",
      "theme-palette-3",
    );
    document.body.classList.add(`theme-palette-${palette}`);
  }, [palette]);

  // Core global user session
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    parentName: "박세화",
    parentEmail: "hsu235@gmail.com",
    subscriptionType: "free", // free or premium
    profiles: initialProfiles,
    activeProfileIndex: 0,
    history: [
      {
        taleId: "classic-1",
        title: "토끼와 별빛 숲 (추천)",
        readAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
        durationSeconds: 512,
        completed: true,
        percentageRead: 100,
        activitiesCompleted: {
          comprehension: true,
          emotion: true,
          creative: true,
          vocabulary: true,
        },
        childAnswers: {
          comprehensionText:
            "블링이의 다친 날개를 구해줄 수 있어서 정말 기뻤어요.",
          selectedEmotion: "기쁨",
          creativeText: "반딧불이 요정과 한옥 밤길을 반짝반짝 산책하고 싶어요.",
          creativeEmotion: "😆",
          vocabularyQuizAnswers: ["사계절 푸른 나무", "엉덩이에서 가볍게 빛을 내는 곤충"],
        },
      },
      {
        taleId: "classic-4",
        title: "토끼와 거북이",
        readAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
        durationSeconds: 380,
        completed: true,
        percentageRead: 100,
        activitiesCompleted: {
          comprehension: true,
          emotion: true,
          creative: false,
          vocabulary: true,
        },
        childAnswers: {
          comprehensionText:
            "거북이가 성실히 달려서 마침내 정상에서 쉬던 토끼를 이겼어요.",
          selectedEmotion: "감동",
          creativeText: "",
          creativeEmotion: "🧐",
          vocabularyQuizAnswers: ["바다와 뭍에 살고 느릿느릿 숨쉬는 동물"],
        },
      },
    ],
    settings: defaultSettings,
  });

  // Local storage and dynamic fairy tale shelf (Classic + custom)
  const [tales, setTales] = useState<FairyTale[]>(defaultFairytales);

  // Incremental custom counts to restrict free tier
  const [customStoryCount, setCustomStoryCount] = useState<number>(0);

  // Active reading / story workshop states
  const [activeReadingTale, setActiveReadingTale] = useState<FairyTale | null>(
    null,
  );
  const [underConstructionConfig, setUnderConstructionConfig] = useState<
    any | null
  >(null);
  const [isCakingProgress, setIsCakingProgress] = useState<boolean>(false);

  // Screen-time play timer limits
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [screentimeBlocked, setScreentimeBlocked] = useState<boolean>(false);

  // Sibling register lock gate dialog modal
  const [showParentLock, setShowParentLock] = useState<boolean>(false);
  const [mathProblem, setMathProblem] = useState<{
    numStatus: string;
    answerNum: number;
  }>({ numStatus: "8 + 7", answerNum: 15 });
  const [userInputMath, setUserInputMath] = useState<string>("");
  const [targetSuccessAction, setTargetSuccessAction] = useState<string>("");

  // Periodical screen timer lock monitor
  useEffect(() => {
    const clockInterval = setInterval(() => {
      if (session.settings.playtimeLimitEnabled && !screentimeBlocked) {
        setElapsedSeconds((prev) => {
          const limitSeconds = session.settings.playtimeLimit * 60;
          if (prev >= limitSeconds) {
            setScreentimeBlocked(true);
            clearInterval(clockInterval);
          }
          return prev + 1;
        });
      }
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [
    session.settings.playtimeLimitEnabled,
    session.settings.playtimeLimit,
    screentimeBlocked,
  ]);

  // Launch Child lock gate verification code
  const triggerParentCenterGate = (action: string) => {
    // Produce random easy math puzzle
    const n1 = Math.floor(Math.random() * 8) + 4;
    const n2 = Math.floor(Math.random() * 8) + 4;
    setMathProblem({
      numStatus: `${n1} + ${n2}`,
      answerNum: n1 + n2,
    });
    setUserInputMath("");
    setTargetSuccessAction(action);
    setShowParentLock(true);
  };

  const handleMathResolve = () => {
    if (Number(userInputMath) === mathProblem.answerNum) {
      setShowParentLock(false);

      // Perform matching routing success action
      if (targetSuccessAction === "dashboard") {
        setActiveTab("dashboard");
      } else if (targetSuccessAction === "addProfile") {
        setActiveTab("dashboard"); // Go to parental central
        setTimeout(() => {
          const secTab = document.getElementById("parent-tab-security");
          if (secTab) secTab.click();
        }, 150);
      }
    } else {
      alert("⚠️ 정답이 틀렸어요! 부모 동반인지 다시 한 번 확인해 주세요.");
      setUserInputMath("");
    }
  };

  // Profile switching handler
  const handleProfileSwitch = (idx: number) => {
    setSession((prev) => ({
      ...prev,
      activeProfileIndex: idx,
    }));
    // Reset specific states
    setElapsedSeconds(0);
    setScreentimeBlocked(false);
  };

  // Sibling profile registration handler
  const handleAddChildProfile = (prof: ChildProfile) => {
    setSession((prev) => ({
      ...prev,
      profiles: [...prev.profiles, prof],
      activeProfileIndex: prev.profiles.length, // switch to new brother
    }));
  };

  const handleDeleteChildProfile = (indexToDelete: number) => {
    if (session.profiles.length <= 1) {
      alert("⚠️ 최소 한 명의 자녀 프로필은 등록되어 있어야 합니다.");
      return;
    }

    const profileName = session.profiles[indexToDelete]?.name || "자녀";
    if (!confirm(`정말로 [${profileName}] 프로필을 삭제하시겠습니까?`)) {
      return;
    }

    setSession((prev) => {
      const updatedProfiles = prev.profiles.filter(
        (_, idx) => idx !== indexToDelete,
      );

      // Determine new active profile index
      let newActiveIndex = prev.activeProfileIndex;
      if (indexToDelete === prev.activeProfileIndex) {
        newActiveIndex = 0;
      } else if (indexToDelete < prev.activeProfileIndex) {
        newActiveIndex = prev.activeProfileIndex - 1;
      }

      return {
        ...prev,
        profiles: updatedProfiles,
        activeProfileIndex: newActiveIndex,
      };
    });
  };

  // Safe configuration updating
  const handleUpdateSettings = (settings: ParentSettings) => {
    setSession((prev) => ({
      ...prev,
      settings: settings,
    }));
    // Synchronously adjust limit alerts if time is expanded
    const secondsNow = elapsedSeconds;
    if (secondsNow < settings.playtimeLimit * 60) {
      setScreentimeBlocked(false);
    }
  };

  // Story Building lifecycle trigger from F-Builder
  const handleGenerateStoryLaunch = async (config: {
    protagonist: string;
    age: number;
    theme: string;
    style: string;
    extraKorean: boolean;
  }) => {
    // 1. Check quote limits for Free tiers
    if (session.subscriptionType === "free" && customStoryCount >= 1) {
      triggerQuotaReachedAlert();
      return;
    }

    setUnderConstructionConfig(config);
    setIsCakingProgress(true); // Enter SCREEN 3 Progress Loader
  };

  const handleProgressLoaderComplete = async () => {
    setIsCakingProgress(false);
    if (!underConstructionConfig) return;

    try {
      const storyData = await generateStory(
        underConstructionConfig,
        (step, label) => {
          console.log(`[${step}/6] ${label}`);
        },
      );
      setTales([storyData, ...tales]);
      setCustomStoryCount((prev) => prev + 1);
      setActiveReadingTale(storyData);
      setActiveTab("reader");
    } catch (err: any) {
      console.error(err);
      alert("동화책 생성 중 오류가 발생했어요: " + err.message);
    }
  };

  const triggerQuotaReachedAlert = () => {
    const goSub = confirm(
      "👑 [안내] 무료 회원은 세션당 AI 동화책을 최대 1권 구우실 수 있습니다.\n무제한 창작 패스 멤버십(월 14,900원) 결제 페이지로 가시겠습니까?",
    );
    if (goSub) {
      setActiveTab("subscription");
    }
  };

  const handlePostPlaySave = (answers: any) => {
    // Record history
    if (!activeReadingTale) return;
    const freshRecord: ReadingHistory = {
      taleId: activeReadingTale.id,
      title: activeReadingTale.titleKo,
      readAt: new Date().toLocaleString("ko-KR"),
      durationSeconds: 120, // simulated
      completed: true,
      percentageRead: 100,
      activitiesCompleted: {
        comprehension: !!answers.comprehensionText,
        emotion: !!answers.selectedEmotion,
        creative: !!answers.creativeText,
        vocabulary: true,
      },
      childAnswers: answers,
    };

    setSession((prev) => ({
      ...prev,
      history: [freshRecord, ...prev.history],
    }));

    // Return to playroom beautifully
    setActiveReadingTale(null);
    setActiveTab("activities");
  };

  if (!session.isLoggedIn) {
    return (
      <LandingPage
        onLogin={() =>
          setSession((prev) => ({
            ...prev,
            isLoggedIn: true,
            parentName: "박세화",
          }))
        }
        onExperience={(mode) => {
          setInitialBuildType(mode);
          setSession((prev) => ({
            ...prev,
            isLoggedIn: true,
            parentName: "손님(체험 중)",
          }));
          setActiveTab("create");
        }}
        nightMode={nightMode}
        setNightMode={setNightMode}
        lang={lang}
        setLang={setLang}
        palette={palette}
        setPalette={setPalette}
      />
    );
  }

  return (
    <div
      id="toridongwha-app-shell"
      className={`flex h-screen font-sans antialiased overflow-hidden transition-colors duration-500 ${
        nightMode ? "bg-[#070B14] text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* 1. Left Sidebar Navigation rail */}
      <Sidebar
        activeTab={
          activeTab === "reader" || activeTab === "playroom"
            ? "bookshelf"
            : activeTab
        }
        setActiveTab={setActiveTab}
        activeProfile={
          session.profiles[session.activeProfileIndex] || session.profiles[0]
        }
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        subscriptionType={session.subscriptionType}
        onOpenPaywall={() => setActiveTab("subscription")}
        lang={lang}
      />

      {/* 2. Main content spread canvas */}
      <main
        id="main-canvas"
        className="flex-1 flex flex-col overflow-hidden relative outline-none"
      >
        {/* Dynamic Screentime auto-blocking system lock panel */}
        {screentimeBlocked && (
          <div
            id="screentime-blocked-curtain"
            className="absolute inset-0 bg-[#0B1528] z-[100] flex flex-col items-center justify-center p-8 text-center text-white select-none"
          >
            <Clock size={56} className="text-pink animate-bounce mb-4" />
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-black text-[#FFD93D] tracking-tight">
                앗! 약속 시간이 끝났어요! ⏰
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                아이의 눈 피로 예방과 좋은 수면을 위해 오늘의{" "}
                <strong>시간차단막</strong>이 켜졌습니다.
              </p>
              <p className="text-[11px] text-slate-400">
                내일 더 신나게 토리친구와 보물섬을 떠나 봐요.
              </p>

              <div className="pt-6 border-t border-slate-700/60 mt-4 flex justify-center">
                <button
                  id="screentime-parent-bypass"
                  onClick={() => triggerParentCenterGate("dashboard")}
                  className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-pink text-xs font-black px-6 py-3 rounded-2xl cursor-pointer"
                >
                  부모님 동반 확인 (시간 연장)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header menu bar */}
        <Header
          session={session}
          onSwitchProfile={handleProfileSwitch}
          onAddProfile={handleAddChildProfile}
          onOpenManagementLock={() => triggerParentCenterGate("dashboard")}
          nightMode={nightMode}
          setNightMode={setNightMode}
          onLogout={() =>
            setSession((prev) => ({ ...prev, isLoggedIn: false }))
          }
          onLogin={() => setSession((prev) => ({ ...prev, isLoggedIn: true }))}
          lang={lang}
          setLang={setLang}
          palette={palette}
          setPalette={setPalette}
        />

        {/* Routing content box renderer */}
        <div
          id="scrollable-view-viewport"
          className="flex-1 p-6 overflow-y-auto relative"
        >
          {isCakingProgress ? (
            /* SCREEN 3: 6-stage AI story notebook synthesis pipeline loader */
            <StoryProgress onComplete={handleProgressLoaderComplete} />
          ) : activeTab === "reader" && activeReadingTale ? (
            /* SCREEN 4: Cozy Reader */
            <StoryViewer
              tale={activeReadingTale}
              nightMode={nightMode}
              onGoToActivities={() => setActiveTab("playroom")}
              onClose={() => {
                setActiveReadingTale(null);
                setActiveTab("bookshelf");
              }}
            />
          ) : activeTab === "playroom" && activeReadingTale ? (
            /* SCREEN 5: Activities Playroom Playground */
            <PlayRoom
              tale={activeReadingTale}
              onActivitySave={handlePostPlaySave}
              onClose={() => {
                setActiveReadingTale(null);
                setActiveTab("activities");
              }}
            />
          ) : activeTab === "create" ? (
            /* SCREEN 2-A & B: Selective and Conversational Story Builders (and default Dashboard Home) */
            <FairyTaleBuilder
              activeProfile={
                session.profiles[session.activeProfileIndex] ||
                session.profiles[0]
              }
              initialBuildType={initialBuildType}
              onGenerate={handleGenerateStoryLaunch}
              tales={tales}
              onSelectTale={(tale) => {
                setActiveReadingTale(tale);
                setActiveTab("reader");
              }}
              subscriptionType={session.subscriptionType}
              onOpenPaywall={() => setActiveTab("subscription")}
              lang={lang}
            />
          ) : activeTab === "bookshelf" ? (
            /* SCREEN 1-A: Books catalog library */
            <Bookshelf
              tales={tales}
              onSelectTale={(tale) => {
                setActiveReadingTale(tale);
                setActiveTab("reader");
              }}
              onDeleteTale={(id) => {
                setTales(tales.filter((t) => t.id !== id));
              }}
            />
          ) : activeTab === "activities" ? (
            /* SCREEN 5-Bridge: Multi-tales Play activities selection bridge page */
            <div
              id="multi-activities-bridge"
              className="max-w-5xl mx-auto py-2 px-2 space-y-6 animate-in fade-in duration-300"
            >
              <div className="border-b pb-4 border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  🧩 토리동화 마법 놀이마당
                </h2>
                <p className="text-xs text-slate-400">
                  책을 읽은 뒤 낱말 복습 게임과 마음 칭찬 퀴즈를 풀며 어휘력을
                  재미있게 완성해 보세요!
                </p>
              </div>

              {tales.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {tales.map((tale) => (
                    <div
                      key={tale.id}
                      className="bg-white rounded-3xl p-5 border-2 border-[#EBF1FA] hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-56 group text-left"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-105 transition-transform">
                          <Sparkles size={20} className="fill-orange-50" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {tale.protagonist}의 모험
                          </span>
                          <h4 className="text-sm font-black text-slate-800 line-clamp-1 mt-0.5">
                            {tale.titleKo}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            동물 친구와의 약속과 교훈적인 생각이 가득 찼던
                            마법동화 속 놀이터입니다.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveReadingTale(tale);
                          setActiveTab("playroom");
                        }}
                        className="w-full bg-slate-800 hover:bg-orange-500 hover:text-white text-orange-300 hover:shadow-md py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        퀴즈 놀이터 입장 🎮
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-warmbg border-4 border-dashed border-orange-100 rounded-[32px]">
                  <span className="text-lg block mb-1">
                    🦫 아직 지은 동화책이 없어요!
                  </span>
                  <span className="text-xs text-slate-400">
                    새 동화를 다 짓고 나면 즐거운 오대수 퀴즈와 낱말공부가
                    여기에 생겨나요.
                  </span>
                </div>
              )}
            </div>
          ) : activeTab === "dashboard" ? (
            /* SCREEN 6: Parent Care center child metrics analytics */
            <Dashboard session={session} />
          ) : activeTab === "safety" ? (
            /* SCREEN 6-B: Sibling management & Screen-time lock controls */
            <SafetySettings
              session={session}
              onUpdateSettings={handleUpdateSettings}
              onAddChildProfile={handleAddChildProfile}
              onDeleteChildProfile={handleDeleteChildProfile}
              onSwitchProfile={handleProfileSwitch}
            />
          ) : activeTab === "subscription" ? (
            /* SCREEN 1-D: Premium pricing package */
            <Paywall
              currentSubscription={session.subscriptionType}
              onUpgradeSuccess={() =>
                setSession((prev) => ({ ...prev, subscriptionType: "premium" }))
              }
            />
          ) : (
            <div className="text-center py-16">
              <span className="text-slate-400">화면 준비 중...</span>
            </div>
          )}
        </div>
      </main>

      {/* 3. Toddler-proof Parent Security Lock Gate Overlay Dialog Modal */}
      {showParentLock && (
        <div
          id="parent-lock-overlay"
          className="fixed inset-0 bg-[#090E1A]/85 backdrop-blur-md z-[200] flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200 text-slate-800">
            <button
              id="close-parent-lock"
              onClick={() => setShowParentLock(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto border border-purple-100">
                <ShieldAlert className="text-purple-600" size={24} />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                부모님 동반 확인
              </h3>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                장난꾸러기 유아들의 오작동을 차단하기 위한 한글 키즈
                보호벽입니다.
                <br />
                아래 수수께끼 산수 정답을 쓰고 문을 열어 주세요.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border p-4 rounded-2xl text-center">
                <span className="text-rose-400 text-[10px] font-bold block uppercase tracking-wider mb-1">
                  정답을 구하세요
                </span>
                <span className="text-2xl font-black text-slate-700 tracking-widest">
                  {mathProblem.numStatus} = ?
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  id="parent-math-input"
                  type="number"
                  value={userInputMath}
                  onChange={(e) => setUserInputMath(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleMathResolve();
                  }}
                  placeholder="숫자 정답 기입"
                  className="w-full bg-slate-50 border border-slate-100 font-extrabold text-[#333] px-4 py-3.5 rounded-2xl text-center focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-base focus:bg-white"
                  autoFocus
                />
              </div>

              <button
                id="submit-parent-math"
                onClick={handleMathResolve}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-indigo-100"
              >
                지킴이 보안문 해제 🔓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
