import { NavLink } from "react-router-dom";
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

export default function Sidebar() {
  return (
    <aside className="
      flex min-h-screen shrink-0 flex-col
      border-r border-[#1f2330]
      bg-[#111318]
      shadow-[-1px_0_0_rgba(255,255,255,0.02)_inset]
      w-20 sm:w-24 md:w-[15%] min-w-[220px]
    ">
      <div className="flex items-start justify-center md:justify-start gap-3 px-5 pt-5">
        <div className="pt-4">
          <img src={Logo} alt="Logo" className="w-full h-[100px] object-contain" />
        </div>
      </div>

      <div className="hidden md:block px-5 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#50576a]">
        Main Menu
      </div>

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
    </aside>
  );
}
