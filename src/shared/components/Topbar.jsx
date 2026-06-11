import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BellIcon from "../../assets/Icon/bellIcon.svg";
import { logout } from "../../features/auth/authThunk";

export default function Topbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const menuRef   = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const authUser = useSelector((state) => state.auth.user);
  const username = authUser?.username || authUser?.name || "User";
  const email    = authUser?.email || "";
  const initial  = username.charAt(0).toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex h-24 shrink-0 items-center gap-4 bg-[#0d0d10] px-8">
      <label className="flex h-12 w-full max-w-[400px] items-center gap-2 rounded-[10px] border border-[#272c3b] bg-[#151720] px-3">
        <SearchIcon />
        <input
          className="h-full flex-1 bg-transparent text-[16px] text-[#e8ebf3] outline-none placeholder:text-[#70798d]"
          placeholder="Search streams, categories, or systems..."
        />
      </label>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-[#a7afc1] transition-colors hover:bg-white/5 hover:text-white"
      >
        <img src={BellIcon} alt="BellIcon" loading="lazy" />
        <span className="absolute right-[7px] top-[8px] h-2.5 w-2.5 rounded-full bg-[#7f8cff]" />
      </button>

      {/* User + logout dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 pl-1 rounded-[10px] px-2 py-1 transition-colors hover:bg-white/5 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2e3648] bg-indigo-600 text-lg font-semibold text-white">
            {initial}
          </div>
          <div className="leading-tight">
            <div className="text-xl font-semibold text-[#edf0f7]">{username}</div>
          </div>
          <ChevronIcon open={menuOpen} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 bg-[#1a1f2e] border border-[#2d3748] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2d3748]">
              <p className="text-sm font-semibold text-[#d1d5db] truncate">{username}</p>
              {email && <p className="text-xs text-[#6b7280] truncate mt-[2px]">{email}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-[10px] text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogoutIcon />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
      className={`text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="#7f8798" strokeWidth="1.6" />
      <path d="m16 16 4.2 4.2" stroke="#7f8798" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
