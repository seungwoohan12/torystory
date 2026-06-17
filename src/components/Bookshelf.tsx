import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Calendar,
  BookOpen,
  Trash2,
} from "lucide-react";
import { FairyTale } from "../types";

interface BookshelfProps {
  tales: FairyTale[];
  onSelectTale: (tale: FairyTale) => void;
  onDeleteTale?: (id: string) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  tales,
  onSelectTale,
  onDeleteTale,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTheme, setFilterTheme] = useState<string>("all");
  const [filterOrigin, setFilterOrigin] = useState<
    "all" | "classic" | "custom"
  >("all");

  const themesList = ["우정", "지혜", "배려", "모험", "정직", "가족"];

  const filteredTales = tales.filter((tale) => {
    const matchesSearch =
      tale.titleKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tale.protagonist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tale.theme.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTheme = filterTheme === "all" || tale.theme === filterTheme;

    const matchesOrigin =
      filterOrigin === "all" ||
      (filterOrigin === "classic" && !tale.isCustom) ||
      (filterOrigin === "custom" && tale.isCustom);

    return matchesSearch && matchesTheme && matchesOrigin;
  });

  return (
    <div
      id="bookshelf-container"
      className="max-w-5xl mx-auto py-4 px-2 space-y-6"
    >
      {/* Search and Filters panel */}
      <div
        id="bookshelf-controls"
        className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-5"
      >
        {/* Real search bar */}
        <div id="search-bar-wrapper" className="relative w-full md:w-96">
          <input
            id="input-search-books"
            type="text"
            placeholder="동화책 제목이나 등장인물을 검색해 봐요!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 font-bold text-xs text-slate-700 pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7ECEC4]/30 focus:bg-white transition-all"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>

        {/* Filters select chips */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Theme select dropdown */}
          <select
            id="select-filter-theme"
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
            className="bg-slate-50 border border-slate-100 hover:border-slate-300 font-bold text-xs text-slate-600 px-4 py-3.5 rounded-2xl focus:outline-none cursor-pointer"
          >
            <option value="all">🎡 전체 교훈 주제</option>
            {themesList.map((th) => (
              <option key={th} value={th}>
                📚 {th} 도서
              </option>
            ))}
          </select>

          {/* S-1: Filter custom vs classics */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-inner">
            <button
              id="btn-filter-all-origin"
              onClick={() => setFilterOrigin("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterOrigin === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              전체
            </button>
            <button
              id="btn-filter-classic-origin"
              onClick={() => setFilterOrigin("classic")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterOrigin === "classic"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              공방 명작
            </button>
            <button
              id="btn-filter-custom-origin"
              onClick={() => setFilterOrigin("custom")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterOrigin === "custom"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              내 창작
            </button>
          </div>
        </div>
      </div>

      {/* Grid listing of Fairytales */}
      {filteredTales.length > 0 ? (
        <div
          id="bookshelf-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-300"
        >
          {filteredTales.map((tale) => {
            const hasCoverImg = tale.scenes?.[0]?.imageUrl;
            return (
              <div
                id={`book-card-${tale.id}`}
                key={tale.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:scale-103 transition-all duration-300 flex flex-col justify-between group relative h-[380px]"
              >
                {/* Visual Cover Header */}
                <div
                  id={`book-card-cover-${tale.id}`}
                  className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden"
                >
                  {hasCoverImg ? (
                    <img
                      src={tale.scenes[0].imageUrl}
                      alt={tale.titleKo}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#FF6B9D] to-[#7ECEC4] opacity-50 flex items-center justify-center">
                      <BookOpen size={48} className="text-white" />
                    </div>
                  )}

                  {/* Badge overlays */}
                  <div className="absolute top-3 left-3 bg-[#FF6B9D] text-white text-[9.5px] font-black px-2.5 py-1 rounded-full uppercase shadow-md leading-none">
                    {tale.theme}
                  </div>

                  {tale.isCustom && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-amber-300 text-[9.5px] font-black px-2.5 py-1 rounded-full uppercase shadow-md leading-none">
                      AI 제작
                    </div>
                  )}
                </div>

                {/* Cover Body descriptions */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400">
                      만 {tale.age}세 추천 • 주인공 {tale.protagonist}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-[#FF6B9D] transition-colors leading-snug break-all truncate-2-lines">
                      {tale.titleKo}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 flex items-center justify-between font-mono font-bold">
                      <span>{tale.scenes?.length || 5} Scenes</span>
                      <span className="flex items-center gap-0.5">
                        <Calendar size={10} /> {tale.createdAt}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-open-book-${tale.id}`}
                        onClick={() => onSelectTale(tale)}
                        className="flex-1 bg-[#7ECEC4]/15 hover:bg-[#7ECEC4] hover:text-white text-slate-800 px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <BookOpen size={13} />
                        <span>독서 대장 책열기</span>
                      </button>

                      {tale.isCustom && onDeleteTale && (
                        <button
                          id={`btn-delete-book-${tale.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm("이 맞춤 동화책을 진짜로 삭제할까요?")
                            ) {
                              onDeleteTale(tale.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white p-2.5 rounded-2xl transition-all cursor-pointer border border-rose-100 hover:border-transparent"
                          title="이 동화 삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Filter search results */
        <div
          id="books_empty_cover"
          className="bg-white border rounded-3xl p-16 text-center space-y-3.5 shadow-md max-w-lg mx-auto"
        >
          <BookOpen className="text-slate-300 mx-auto" size={48} />
          <div className="space-y-0.5">
            <h3 className="font-black text-base text-slate-700">
              해당하는 마법책을 찾지 못했어요
            </h3>
            <p className="text-xs text-slate-400">
              다른 키워드나 교안으로 다시 검색해 봐주세요.
            </p>
          </div>
          <button
            id="reset-bookshelf-filters"
            onClick={() => {
              setSearchTerm("");
              setFilterTheme("all");
              setFilterOrigin("all");
            }}
            className="bg-slate-100 hover:bg-slate-200 text-[#555] text-[10px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            모든 필터 초기화
          </button>
        </div>
      )}
    </div>
  );
};
