import React from "react";
import {
  BookOpen,
  Sparkles,
  LayoutDashboard,
  Crown,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  Lock,
} from "lucide-react";
import { ChildProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeProfile: ChildProfile;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  subscriptionType: "free" | "premium";
  onOpenPaywall: () => void;
  lang: "KO" | "EN";
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  isCollapsed,
  setIsCollapsed,
  subscriptionType,
  onOpenPaywall,
  lang,
}) => {
  const menuItems = [
    {
      id: "create",
      label: lang === "KO" ? "동화 만들기" : "Create Story",
      icon: Sparkles,
      color: "text-rose-500 bg-rose-50",
    },
    {
      id: "bookshelf",
      label: lang === "KO" ? "내 마법책장" : "My Bookshelf",
      icon: BookOpen,
      color: "text-teal-500 bg-teal-50",
    },
    {
      id: "activities",
      label: lang === "KO" ? "놀이마당" : "Playroom",
      icon: Puzzle,
      color: "text-orange-500 bg-orange-50",
    },
    {
      id: "dashboard",
      label: lang === "KO" ? "아이 성장 분석" : "Growth Analytics",
      icon: LayoutDashboard,
      color: "text-purple-500 bg-purple-50",
    },
    {
      id: "safety",
      label: lang === "KO" ? "안전관리 설정" : "Safety Settings",
      icon: Lock,
      color: "text-indigo-500 bg-indigo-50",
    },
    {
      id: "subscription",
      label: lang === "KO" ? "프리미엄 구독" : "Premium Plan",
      icon: Crown,
      color: "text-amber-500 bg-amber-50",
    },
  ];

  return (
    <aside
      id="sidebar-container"
      className={`relative h-full bg-white border-r border-[#EBF1FA] flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapsible toggle trigger button */}
      <button
        id="toggle-sidebar"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-[#EBF1FA] rounded-full p-1 text-slate-400 hover:text-slate-600 shadow-md cursor-pointer z-50 flex items-center justify-center w-6 h-6"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand logo header */}
      <div
        id="sidebar-logo"
        className={`p-6 flex items-center gap-3 border-b-4 border-[#FEE2E2] ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="w-12 h-12 bg-pink rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
          <div
            className="w-6 h-6 bg-white rounded-full opacity-80 animate-ping"
            style={{ animationDuration: "3s" }}
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-pink cute-font tracking-tight leading-none flex items-center gap-1">
              토리동화{" "}
              <span className="text-mint text-xs font-bold font-sans">
                Tory Tale
              </span>
            </h1>
            <span className="text-[9px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-1">
              AI STORY STUDIO
            </span>
          </div>
        )}
      </div>

      {/* Tabs navigation menu */}
      <nav
        id="sidebar-nav"
        className="flex-1 p-4 space-y-3 mt-4 overflow-y-auto"
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          // Custom color mappings for active state of each distinct tab
          let activeStyleClass =
            "bg-slate-100 text-slate-800 border-2 border-slate-300";
          if (item.id === "create") {
            activeStyleClass =
              "bg-pink/10 text-pink border-2 border-pink shadow-sm scale-102 font-black";
          } else if (item.id === "bookshelf") {
            activeStyleClass =
              "bg-mint/10 text-[#5ABAD0] border-2 border-mint shadow-sm scale-102 font-black";
          } else if (item.id === "activities") {
            activeStyleClass =
              "bg-orange-50 text-orange-600 border-2 border-orange-400 shadow-sm scale-102 font-black";
          } else if (item.id === "dashboard") {
            activeStyleClass =
              "bg-lavender/10 text-purple-700 border-2 border-lavender shadow-sm scale-102 font-black";
          } else if (item.id === "safety") {
            activeStyleClass =
              "bg-indigo-50 text-indigo-700 border-2 border-indigo-400 shadow-sm scale-102 font-black";
          } else if (item.id === "subscription") {
            activeStyleClass =
              "bg-yellow/20 text-amber-800 border-2 border-yellow shadow-sm scale-102 font-black";
          }

          return (
            <button
              id={`sidebar-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? activeStyleClass
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-2 border-transparent"
              } ${isCollapsed ? "justify-center px-1" : ""}`}
            >
              <div
                className={`p-2 rounded-xl flex-shrink-0 ${isActive ? "bg-white/80" : item.color}`}
              >
                <IconComponent size={18} />
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.id === "subscription" &&
                    subscriptionType === "premium" && (
                      <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                        PRO
                      </span>
                    )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick profile info summary at footer */}
      <div id="sidebar-footer" className="p-4 border-t border-[#F4F9FF]">
        {!isCollapsed ? (
          <div className="bg-gradient-to-br from-[#FF6B9D]/5 to-[#C9B1FF]/5 p-3 rounded-2xl border border-[#FF6B9D]/10">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7ECEC4] to-[#C9B1FF] flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                {activeProfile.name[1] || activeProfile.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[#333] text-xs truncate">
                  {lang === "KO"
                    ? `${activeProfile.name} 책꽂이`
                    : `${activeProfile.name}'s Bookshelf`}
                </p>
                <p className="text-[10px] font-medium text-[#7CCEC4]">
                  {lang === "KO"
                    ? `${activeProfile.age}세 • ${activeProfile.gender === "male" ? "남자아이" : "여자아이"}`
                    : `${activeProfile.age} yrs • ${activeProfile.gender === "male" ? "Boy" : "Girl"}`}
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold">
                {lang === "KO" ? "구독형태" : "Status"}
              </span>
              <span
                className={`font-extrabold uppercase ${subscriptionType === "premium" ? "text-amber-500" : "text-slate-400"}`}
              >
                {subscriptionType === "premium"
                  ? "👑 Premium"
                  : lang === "KO"
                    ? "Free 멤버"
                    : "Free Member"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7ECEC4] to-[#C9B1FF] flex items-center justify-center text-white text-sm font-bold shadow-md">
              {activeProfile.name[0]}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
