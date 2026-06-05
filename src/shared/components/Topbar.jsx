import { useSelector } from "react-redux";

import BellIcon from "../../assets/Icon/bellIcon.svg";


export default function Topbar() {
  const authUser = useSelector((state) => state.auth.user);

  const auth = JSON.parse(localStorage.getItem("auth_user"));
  const username = auth?.username;

  return (
    <header className="flex h-24 shrink-0 items-center gap-4  bg-[#0d0d10] px-8">
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

      <div className="flex items-center gap-2 pl-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2e3648] bg-[#1b2230] text-lg font-semibold text-white">
          {username?.charAt(0).toUpperCase()}
        </div>

        <div className="leading-tight">
          <div className="text-xl font-semibold text-[#edf0f7]">{username}</div>
          {/* <div className="text-xl text-[#8a93a8]">{role}</div> */}
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="#7f8798" strokeWidth="1.6" />
      <path
        d="m16 16 4.2 4.2"
        stroke="#7f8798"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

