import React, { useState } from "react";
import {
  User,
  LogIn,
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  ChevronDown,
  Check,
  UserPlus,
  Languages,
  Palette,
} from "lucide-react";
import { ChildProfile, UserSession } from "../types";

interface HeaderProps {
  session: UserSession;
  onSwitchProfile: (index: number) => void;
  onAddProfile: (profile: ChildProfile) => void;
  onOpenManagementLock: () => void;
  nightMode: boolean;
  setNightMode: (mode: boolean) => void;
  onLogout: () => void;
  onLogin: () => void;
  lang: "KO" | "EN";
  setLang: (lang: "KO" | "EN") => void;
  palette: number;
  setPalette: (palette: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onSwitchProfile,
  onAddProfile,
  onOpenManagementLock,
  nightMode,
  setNightMode,
  onLogout,
  onLogin,
  lang,
  setLang,
  palette,
  setPalette,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const activeProfile =
    session.profiles[session.activeProfileIndex] || session.profiles[0];

  const handleProfileSwitch = (idx: number) => {
    onSwitchProfile(idx);
    setProfileDropdownOpen(false);
  };

  const handleAddProfileClick = () => {
    setProfileDropdownOpen(false);
    onOpenManagementLock(); // Open safety lock then add profile inside Parent setting area
  };

  return (
    <header
      id="header-container"
      className={`h-20 flex-shrink-0 border-b-4 px-8 flex items-center justify-between transition-all duration-300 ${
        nightMode
          ? "bg-[#0B1528]/95 border-indigo-950/80 text-slate-100"
          : "bg-white border-[#FEE2E2] text-slate-800"
      }`}
    >
      {/* Title greeting for the child */}
      <div id="header-greeting" className="flex items-center gap-2">
        <h1 className="font-extrabold text-sm md:text-lg tracking-tight select-none flex items-baseline gap-1.5">
          <span>{lang === "KO" ? "✨ 반가워, " : "✨ Hello, "}</span>
          <span className="text-pink text-2xl font-black cute-font">
            {activeProfile.name}
          </span>
          <span className="text-slate-400 text-xs font-semibold">
            {lang === "KO"
              ? `(${activeProfile.age}살) 무엇을 들려줄까요?`
              : `(${activeProfile.age} yrs) What shall we read?`}
          </span>
        </h1>
      </div>

      {/* Control Widgets */}
      <div id="header-controls" className="flex items-center gap-4">
        {/* Language Selection Toggle */}
        <button
          id="header-lang-toggle"
          onClick={() => setLang(lang === "KO" ? "EN" : "KO")}
          className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 p-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-97"
        >
          <Languages size={15} className="text-mint" />
          <span>{lang === "KO" ? "English" : "한국어"}</span>
        </button>

        {/* Color Palette Selector Dropdown */}
        <div className="relative">
          <button
            id="header-palette-button"
            onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
            className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 p-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-97"
          >
            <Palette size={15} className="text-pink animate-pulse" />
            <span>{lang === "KO" ? "색상 테마" : "Themes"}</span>
          </button>

          {paletteDropdownOpen && (
            <div
              className={`absolute right-0 mt-2.5 w-48 rounded-2xl border p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                nightMode
                  ? "bg-[#0F223D] border-indigo-900 text-slate-100"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/10 mb-1">
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
                        : "hover:bg-slate-100/50 text-slate-500"
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

        {/* Toggle Sleep/Ambient Starry Night Mode */}
        <button
          id="toggle-night-mode"
          onClick={() => setNightMode(!nightMode)}
          className={`p-2.5 rounded-2xl flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
            nightMode
              ? "bg-indigo-950/60 border border-indigo-900 text-yellow-300 shadow-sm"
              : "bg-amber-50 text-slate-700 hover:bg-amber-100/70"
          }`}
          title="수면 연출 밤 모드 활성화"
        >
          {nightMode ? (
            <>
              <Moon
                size={16}
                className="fill-yellow-300 text-yellow-300 animate-pulse"
              />
              <span className="hidden sm:inline">Sleep ON</span>
            </>
          ) : (
            <>
              <Sun
                size={16}
                className="text-amber-500 animate-spin"
                style={{ animationDuration: "12s" }}
              />
              <span className="hidden sm:inline">Sleep OFF</span>
            </>
          )}
        </button>

        {/* Parent Center Gate validation Lock */}
        <button
          id="parent-lock-gate"
          onClick={onOpenManagementLock}
          className="bg-purple-50 text-purple-700 hover:bg-purple-100/50 p-2.5 rounded-2xl flex items-center gap-1 text-xs font-bold transition-all cursor-pointer border border-purple-200"
        >
          <ShieldAlert size={15} />
          <span className="hidden sm:inline">
            {lang === "KO" ? "부모 잠금" : "Parent Lock"}
          </span>
        </button>

        {/* Child Profile Switch Dropdown */}
        <div id="profile-dropdown-wrapper" className="relative">
          <button
            id="profile-dropdown-button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-50 transition-all cursor-pointer border border-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink to-mint flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
              {activeProfile.name[0]}
            </div>
            <span
              className={`text-xs font-extrabold hidden md:inline ${nightMode ? "text-slate-100" : "text-slate-700"}`}
            >
              {activeProfile.name}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2.5 w-56 rounded-2xl border p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                nightMode
                  ? "bg-[#0F223D] border-indigo-900 text-slate-100"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === "KO" ? "아이 프로필 선택" : "Switch Profile"}
              </div>
              <div className="space-y-1 my-1.5">
                {session.profiles.map((prof, idx) => (
                  <button
                    id={`switch-profile-${prof.name}`}
                    key={prof.name}
                    onClick={() => handleProfileSwitch(idx)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      idx === session.activeProfileIndex
                        ? "bg-mint/10 text-slate-800"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-[10px] items-center justify-center flex font-black text-slate-700">
                        {prof.name[0]}
                      </span>
                      <span
                        className={
                          idx === session.activeProfileIndex
                            ? nightMode
                              ? "text-slate-100"
                              : "text-slate-800"
                            : "text-slate-500"
                        }
                      >
                        {prof.name} ({prof.age}
                        {lang === "KO" ? "세" : " yrs"})
                      </span>
                    </div>
                    {idx === session.activeProfileIndex && (
                      <Check size={14} className="text-mint" />
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100/60 my-1"></div>

              <button
                id="add-profile-from-dropdown"
                onClick={handleAddProfileClick}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-pink hover:bg-rose-50/55 rounded-xl text-left transition-all cursor-pointer"
              >
                <UserPlus size={14} />
                <span>
                  {lang === "KO"
                    ? "새 아이 등록하기 (안심)"
                    : "Add Profile (Safe)"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* User Login/Logout status */}
        <div id="user-auth-indicator">
          {session.isLoggedIn ? (
            <button
              id="logout-button"
              onClick={onLogout}
              className={`p-2.5 rounded-full hover:bg-slate-50 flex items-center transition-all cursor-pointer ${
                nightMode ? "hover:bg-slate-800" : ""
              }`}
              title={lang === "KO" ? "로그아웃" : "Logout"}
            >
              <LogOut size={16} className="text-slate-400" />
            </button>
          ) : (
            <button
              id="login-button"
              onClick={onLogin}
              className="bg-slate-800 text-white hover:bg-pink text-xs font-extrabold px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <LogIn size={14} />
              <span>{lang === "KO" ? "로그인" : "Login"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
