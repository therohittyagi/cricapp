import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authThunk";
import Logo from "../../assets/images/cglogo.svg";

const NAV_ITEMS = [
  { label: "Services", to: "/services", icon: HomeIcon },
  { label: "Live Trimming", to: "/trimming", icon: ScissorsIcon },
  { label: "Highlights Editing", to: "/highlights", icon: ScissorsIcon },
  { label: "Configuration", to: "/config", icon: SettingsIcon },
];

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10.2V19h11V10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2 19v-4.2h3.6V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 12.5 18.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 11.5 18.5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="5" r="2.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="19" r="2.25" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 12a7.1 7.1 0 0 0-.1-1l2-1.5-2-3.5-2.4.8a7.6 7.6 0 0 0-1.6-.9L14.5 3h-5L8.1 5.9a7.6 7.6 0 0 0-1.6.9l-2.4-.8-2 3.5 2 1.5a7.1 7.1 0 0 0 0 2L2.1 13.6l2 3.5 2.4-.8c.5.4 1 .7 1.6 1l.9 2.9h5l.9-2.9c.6-.3 1.1-.6 1.6-1l2.4.8 2-3.5-2-1.5c.1-.3.1-.6.1-.9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
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

function ChevronIcon({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
      className={`shrink-0 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

export default function Sidebar() {
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
    <aside className="
      flex min-h-screen shrink-0 flex-col
      border-r border-[#1f2330]
      bg-[#111318]
      shadow-[-1px_0_0_rgba(255,255,255,0.02)_inset]
      w-20 sm:w-24 md:w-[15%] min-w-[220px]
    ">
      {/* Logo */}
      <div className="flex items-start justify-center md:justify-start gap-3 px-5 pt-5">
        <div className="pt-4">
          <img src={Logo} alt="Logo" className="w-full h-10 object-contain" />
        </div>
      </div>

      {/* Nav label */}
      <div className="hidden md:block px-5 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#50576a]">
        Main Menu
      </div>

      {/* Nav items */}
      <nav aria-label="Main navigation" className="mt-3 flex flex-col gap-2 px-2 md:px-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center justify-center md:justify-start gap-3 rounded-[10px] px-3 md:px-4 py-3 text-lg font-bold transition-colors",
                isActive
                  ? "bg-[#1c202e] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                  : "text-[#a1a8ba] hover:bg-[#181c28] hover:text-white",
              ].join(" ")
            }
          >
            <span className="shrink-0"><Icon /></span>
            <span className="hidden md:block font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile — pinned to bottom */}
      <div className="mt-auto px-2 md:px-4 pb-4 relative" ref={menuRef}>
        <div className="border-t border-[#1f2330] mb-3" />

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 transition-colors hover:bg-[#181c28] cursor-pointer"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initial}
          </div>
          <div className="hidden md:flex min-w-0 flex-1 flex-col text-left">
            <span className="text-sm font-semibold text-[#edf0f7] truncate">{username}</span>
            {email && <span className="text-xs text-[#6b7280] truncate">{email}</span>}
          </div>
          <span className="hidden md:block">
            <ChevronIcon open={menuOpen} />
          </span>
        </button>

        {menuOpen && (
          <div className="absolute bottom-[calc(100%-4px)] left-2 right-2 z-50 overflow-hidden rounded-[10px] border border-[#2d3748] bg-[#1a1f2e] shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
            <div className="border-b border-[#2d3748] px-4 py-3">
              <p className="truncate text-sm font-semibold text-[#d1d5db]">{username}</p>
              {email && <p className="mt-[2px] truncate text-xs text-[#6b7280]">{email}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-[10px] text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
            >
              <LogoutIcon />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
