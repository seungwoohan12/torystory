import React, { useState } from "react";
import { Shield, Lock, UserPlus, Check, Trash2 } from "lucide-react";
import { UserSession, ChildProfile, ParentSettings } from "../types";

interface SafetySettingsProps {
  session: UserSession;
  onUpdateSettings: (settings: ParentSettings) => void;
  onAddChildProfile: (profile: ChildProfile) => void;
  onDeleteChildProfile: (index: number) => void;
  onSwitchProfile: (idx: number) => void;
}

export const SafetySettings: React.FC<SafetySettingsProps> = ({
  session,
  onUpdateSettings,
  onAddChildProfile,
  onDeleteChildProfile,
  onSwitchProfile,
}) => {
  const activeProfile =
    session.profiles[session.activeProfileIndex] || session.profiles[0];

  // Settings states corresponding to mockup
  const [filterEnabled, setFilterEnabled] = useState(
    session.settings.filterEnabled,
  );
  const [filterIntensity, setFilterIntensity] = useState(
    session.settings.filterIntensity || "medium",
  );

  const [minAge, setMinAge] = useState(session.settings.ageRange?.min || 3);
  const [maxAge, setMaxAge] = useState(session.settings.ageRange?.max || 5);

  const [approvalRequired, setApprovalRequired] = useState(
    session.settings.approvalRequired,
  );
  const [externalApproval, setExternalApproval] = useState(true);
  const [approvalMethod, setApprovalMethod] = useState("app");

  // Preserved behind the scenes (not in settings view as requested)
  const [playlimit] = useState(session.settings.playtimeLimit || 30);
  const [limitEnabled] = useState(
    session.settings.playtimeLimitEnabled || false,
  );

  // New child profile form states
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState(5);
  const [newChildGender, setNewChildGender] = useState<"male" | "female">(
    "female",
  );
  const [newChildInterests, setNewChildInterests] = useState<string[]>([
    "동물",
    "꽃",
  ]);

  const handleInterestSelect = (interest: string) => {
    if (newChildInterests.includes(interest)) {
      setNewChildInterests(newChildInterests.filter((i) => i !== interest));
    } else {
      setNewChildInterests([...newChildInterests, interest]);
    }
  };

  const handleAddNewChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) {
      alert("아이의 이름을 적어 주세요.");
      return;
    }
    const freshProfile: ChildProfile = {
      name: newChildName,
      age: Number(newChildAge),
      gender: newChildGender,
      interests: newChildInterests,
      readingTendency: {
        length: "medium",
        speed: "medium",
        style: "balanced",
      },
    };
    onAddChildProfile(freshProfile);
    alert(
      `🎉 새 아이 프로필 [${newChildName}] 등록 완료! 상단 헤더에서 실시간 프로필 전환이 가능합니다.`,
    );
    setNewChildName("");
    setNewChildInterests(["동물", "꽃"]);
  };

  const saveUpdatedConfig = () => {
    onUpdateSettings({
      filterEnabled,
      filterIntensity,
      ageRange: { min: minAge, max: maxAge },
      approvalRequired,
      playtimeLimit: playlimit,
      playtimeLimitEnabled: limitEnabled,
    });
    alert("⚙️ 안전관리 설정이 저장되었습니다.");
  };

  return (
    <div
      id="safety-settings-view"
      className="max-w-6xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300"
    >
      {/* View Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-[19px] font-bold text-slate-800 tracking-tight select-none">
          안전 관리 설정
        </h2>
        <span className="text-xs text-slate-400 select-none">
          아이들이 안심하고 성장할 수 있는 동화 세상을 만듭니다.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT MAIN PANEL: Standard Safety Settings List (Matches Screenshot) ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Harmful Content Filter Card */}
          <div className="bg-white rounded-[16px] p-6 border border-slate-200/50 shadow-xs space-y-4">
            <div>
              <h3 className="text-[14px] font-bold text-slate-800">
                유해 콘텐츠 필터
              </h3>
              <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">
                부적절한 언어, 폭력적 표현, 선정적 내용을 자동으로 차단합니다.
              </p>
            </div>

            <div className="pt-2 space-y-4">
              {/* Filter Active Activation Toggle */}
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs font-medium text-slate-600">
                  필터 활성화
                </span>

                <button
                  type="button"
                  id="toggle-filter-enabled"
                  onClick={() => setFilterEnabled(!filterEnabled)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    filterEnabled ? "bg-[#1E293B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      filterEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Filter Intensity Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 block">
                  필터 강도
                </label>
                <div className="relative">
                  <select
                    id="select-filter-intensity"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(e.target.value as any)}
                    className="w-full bg-white border border-slate-200/80 text-slate-700 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none pr-10"
                  >
                    <option value="low">낮음 — 기본 필터만 적용</option>
                    <option value="medium">
                      보통 — 문맥 기반 유해 단어 변환
                    </option>
                    <option value="high">
                      높음 — 고성능 안전 세이프가드 가동
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Age Rating Settings Card */}
          <div className="bg-white rounded-[16px] p-6 border border-slate-200/50 shadow-xs space-y-4">
            <div>
              <h3 className="text-[14px] font-bold text-slate-800">
                연령 기준 설정
              </h3>
              <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">
                자녀의 연령에 맞는 콘텐츠만 표시됩니다. 슬라이더를 조절해 적절한
                연령 범위를 지정하세요.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4">
              {/* Min Age Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 block">
                  최소 연령
                </label>
                <div className="relative">
                  <select
                    id="select-min-age"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 text-slate-700 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none pr-10"
                  >
                    {[2, 3, 4, 5, 6].map((age) => (
                      <option key={age} value={age}>
                        {age}세
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Max Age Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 block">
                  최대 연령
                </label>
                <div className="relative">
                  <select
                    id="select-max-age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 text-slate-700 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none pr-10"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                      <option key={age} value={age}>
                        {age}세
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Parent Approval Gate Card */}
          <div className="bg-white rounded-[16px] p-6 border border-slate-200/50 shadow-xs space-y-4">
            <div>
              <h3 className="text-[14px] font-bold text-slate-800">
                부모 승인 게이트
              </h3>
              <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">
                자녀가 새로운 동화를 생성하거나 외부 콘텐츠를 불러올 때 보호자의
                승인을 요청합니다.
              </p>
            </div>

            <div className="pt-2 space-y-4">
              {/* Call Creation Approval Required */}
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs font-medium text-slate-600">
                  동화 생성 시 승인 요청
                </span>
                <button
                  type="button"
                  id="toggle-approval-required"
                  onClick={() => setApprovalRequired(!approvalRequired)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    approvalRequired ? "bg-[#1E293B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      approvalRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* External Imports Approval Required */}
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs font-medium text-slate-600">
                  외부 콘텐츠 불러오기 시 승인 요청
                </span>
                <button
                  type="button"
                  id="toggle-external-approval"
                  onClick={() => setExternalApproval(!externalApproval)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    externalApproval ? "bg-[#1E293B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      externalApproval ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Approval Method Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 block">
                  승인 방식
                </label>
                <div className="relative">
                  <select
                    id="select-approval-method"
                    value={approvalMethod}
                    onChange={(e) => setApprovalMethod(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 text-slate-700 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none pr-10"
                  >
                    <option value="app">앱 내 알림 승인</option>
                    <option value="email">이메일 인증(OTP)</option>
                    <option value="pin">부모 PIN 인증</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unified beautiful Save button */}
          <button
            type="button"
            id="btn-save-safety-changes"
            onClick={saveUpdatedConfig}
            className="w-full bg-[#1E293B] hover:bg-black text-[12px] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-xs text-center flex items-center justify-center gap-2 mt-4"
          >
            <Shield size={14} />
            <span>설정 저장하기</span>
          </button>
        </div>

        {/* ================= RIGHT SIDEBAR: Profiles, Sibling Synchronizer ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Family Members list */}
          <div className="bg-slate-50 rounded-[20px] p-5 border border-slate-200/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 block">
                등록된 자녀 프로필
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/30 px-2.5 py-1 rounded-full">
                총 {session.profiles.length}명
              </span>
            </div>

            <div className="space-y-2">
              {session.profiles.map((prof, idx) => {
                const isActive = idx === session.activeProfileIndex;
                return (
                  <div
                    key={idx}
                    id={`profile-card-item-${idx}`}
                    onClick={() => onSwitchProfile(idx)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? "bg-white border-slate-700/85 shadow-2xs font-extrabold"
                        : "bg-white/60 border-slate-200/60 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isActive
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prof.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-xs tracking-tight">
                          {prof.name} ({prof.age}세)
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          관심사: {prof.interests.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 select-none">
                          <Check size={10} strokeWidth={3} /> 선택됨
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChildProfile(idx);
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title={`${prof.name} 프로필 삭제`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 text-center select-none pt-1">
              💡 프로필을 클릭하면 즉시 해당 자녀의 홈서재로 변경됩니다.
            </p>
          </div>

          {/* Add Another Sibling form */}
          <div
            id="add-sibling-card"
            className="bg-white rounded-[20px] p-5 border border-slate-200/50 shadow-2xs space-y-4"
          >
            <div>
              <span className="text-[10px] font-bold text-indigo-500 block uppercase">
                가족 계정 동기화
              </span>
              <h4 className="text-[13px] font-bold text-slate-800 mt-0.5">
                새 자녀 프로필 추가
              </h4>
            </div>

            <form
              id="sidebar-add-child-form"
              onSubmit={handleAddNewChildSubmit}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 block">
                  아이 한글 이름
                </label>
                <input
                  id="sidebar-new-child-name"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="예: 김둘째, 소망"
                  className="w-full bg-slate-50 border border-slate-200/60 font-bold text-xs text-slate-700 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 block">
                    연령 (만 나이)
                  </label>
                  <select
                    id="sidebar-new-child-age"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200/60 font-bold text-xs text-slate-700 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9].map((a) => (
                      <option key={a} value={a}>
                        {a}세
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 block">
                    성별
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100/75 p-0.5 rounded-xl border border-slate-200/40">
                    <button
                      type="button"
                      id="sidebar-gender-female"
                      onClick={() => setNewChildGender("female")}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        newChildGender === "female"
                          ? "bg-white text-slate-800 shadow-3xs"
                          : "text-slate-400"
                      }`}
                    >
                      여아
                    </button>
                    <button
                      type="button"
                      id="sidebar-gender-male"
                      onClick={() => setNewChildGender("male")}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        newChildGender === "male"
                          ? "bg-white text-slate-800 shadow-3xs"
                          : "text-slate-400"
                      }`}
                    >
                      남아
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 block">
                  관심사 선택 (다중 선택 가능)
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    "공룡",
                    "동물",
                    "바다🐳",
                    "우주🚀",
                    "한옥🏡",
                    "요정요술",
                  ].map((interest) => {
                    const isSelected = newChildInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        id={`sidebar-interest-${interest}`}
                        key={interest}
                        onClick={() => handleInterestSelect(interest)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-800 border-slate-800 text-white shadow-3xs font-extrabold"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                id="btn-sidebar-submit-new-child"
                className="w-full bg-slate-800 hover:bg-black text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors duration-200 cursor-pointer text-center"
              >
                <UserPlus size={13} />
                <span>새 아이 맞춤 프로필 적용</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
