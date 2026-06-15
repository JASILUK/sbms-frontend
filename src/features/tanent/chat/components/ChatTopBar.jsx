// components/ChatTopBar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Users,
  MessageCircle,
  Building2,
  FolderKanban,
  X,
  ChevronRight,
} from "lucide-react";

import NewChatModal from "./NewChatModal";

const FILTERS = [
  { key: "all", label: "All", short: "All", icon: MessageCircle },
  { key: "direct", label: "Direct", short: "Direct", icon: Users },
  { key: "group", label: "Groups", short: "Groups", icon: Users },
  { key: "department", label: "Departments", short: "Departments", icon: Building2 },
  { key: "project", label: "Projects", short: "Projects", icon: FolderKanban },
];

export default function ChatTopBar({
  onSelectConversation,
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const isSearching = search.length > 0;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    const raf = requestAnimationFrame(checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      cancelAnimationFrame(raf);
    };
  }, [checkScroll]);

  const scrollRight = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 120, behavior: "smooth" });
  }, []);

  const scrollLeft = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -120, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback((e, direction) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      direction === "left" ? scrollLeft() : scrollRight();
    }
  }, [scrollLeft, scrollRight]);

  const clearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="relative bg-white @container">
      {/* ═══════════════════════════════════════
          SEARCH + NEW CHAT ROW
          ═══════════════════════════════════════ */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Search — takes all available space */}
          <div
            className={`
              group flex-1 flex items-center gap-2.5
              bg-slate-50 hover:bg-slate-100/80
              border border-slate-200/80
              rounded-xl
              px-3 py-2
              transition-all duration-200
              min-w-0
              focus-within:bg-white focus-within:border-violet-300/60 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
              ${isSearching ? "bg-white border-violet-300/60 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]" : ""}
            `}
          >
            <Search
              className={`
                w-4 h-4 flex-shrink-0 transition-colors
                ${isSearching ? "text-violet-500" : "text-slate-400"}
              `}
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              aria-label="Search conversations"
              className="bg-transparent outline-none text-[13px] w-full min-w-0 text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {isSearching && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex-shrink-0 p-1 rounded-full hover:bg-slate-200/80 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* New Chat — compact, always visible */}
          <button
            onClick={() => setOpen(true)}
            className="
              flex-shrink-0
              w-9 h-9
              flex items-center justify-center
              rounded-xl
              bg-violet-500 hover:bg-violet-600
              text-white
              shadow-md shadow-violet-500/20
              active:scale-95
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-1
            "
            title="New chat"
            aria-label="Start new chat"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FILTERS — Scrollable with arrow indicators
          ═══════════════════════════════════════ */}
      <div className="relative px-3 pb-3">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            onKeyDown={(e) => handleKeyDown(e, "left")}
            aria-label="Scroll filters left"
            className="
              absolute left-1 top-1/2 -translate-y-1/2 z-20
              w-6 h-6
              flex items-center justify-center
              rounded-full bg-white
              shadow-md border border-slate-200/60
              text-slate-500 hover:text-violet-500
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/30
            "
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}

        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />
        )}

        {/* Filters container */}
        <div
          ref={scrollRef}
          role="tablist"
          aria-label="Conversation filters"
          className="flex items-center gap-1 overflow-x-auto scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const active = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                role="tab"
                aria-selected={active}
                aria-label={`Filter by ${filter.label}`}
                className={`
                  relative flex items-center gap-1
                  px-2.5 py-[5px]
                  rounded-lg
                  text-[11px] font-semibold
                  whitespace-nowrap
                  transition-all duration-150
                  active:scale-95
                  flex-shrink-0
                  focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-1
                  ${active
                    ? "bg-violet-500 text-white shadow-sm shadow-violet-500/20"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/60"
                  }
                `}
              >
                <Icon
                  className={`
                    w-3 h-3
                    ${active ? "text-white/90" : "text-slate-400"}
                  `}
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden="true"
                />
                {/* 
                  Container query responsive labels:
                  - Show SHORT label by default (narrow sidebar)
                  - Show FULL label when container is at least 200px wide

                  Tailwind v4 syntax: @min-[200px]:inline (arbitrary container query)
                  OR use @sm:inline (24rem = 384px default)

                  For finer control at ~240px, use @min-[240px]:
                */}
                <span className="hidden @min-[200px]:inline">{filter.label}</span>
                <span className="@min-[200px]:hidden">{filter.short}</span>
              </button>
            );
          })}
        </div>

        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            onKeyDown={(e) => handleKeyDown(e, "right")}
            aria-label="Scroll filters right"
            className="
              absolute right-1 top-1/2 -translate-y-1/2 z-20
              w-6 h-6
              flex items-center justify-center
              rounded-full bg-white
              shadow-md border border-slate-200/60
              text-slate-500 hover:text-violet-500
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/30
            "
          >
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-slate-100 mx-3" />

      {/* Modal */}
      {open && (
        <NewChatModal
          onClose={() => setOpen(false)}
          onSelectConversation={onSelectConversation}
        />
      )}
    </div>
  );
}