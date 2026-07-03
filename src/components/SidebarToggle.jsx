import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SidebarToggle({ isOpen, setIsOpen, isDarkTheme }) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed top-4 z-40 p-2.5 rounded-lg border transition-all shadow-xl hidden max-[1300px]:inline-flex ${
        isDarkTheme
          ? "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          : "bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
      } ${isOpen ? "left-[260px]" : "left-4"}`}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </button>
  );
}
