export default function Topbar({
  user = { name: "Laxmi Srivastava", role: "Admin", initials: "LS" },
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#212634] bg-[#0f1016] px-5">
      <label className="flex h-[34px] w-full max-w-[344px] items-center gap-2 rounded-[10px] border border-[#272c3b] bg-[#151720] px-3">
        <SearchIcon />

        <input
          className="h-full flex-1 bg-transparent text-[12px] text-[#e8ebf3] outline-none placeholder:text-[#70798d]"
          placeholder="Search streams, categories, or systems..."
        />
      </label>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#a7afc1] transition-colors hover:bg-white/5 hover:text-white"
      >
        <BellIcon />

        <span className="absolute right-[7px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#7f8cff]" />
      </button>

      <div className="flex items-center gap-2 pl-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e3648] bg-[#1b2230] text-[11px] font-semibold text-white">
          {user.initials}
        </div>

        <div className="leading-tight">
          <div className="text-[12px] font-medium text-[#edf0f7]">
            {user.name}
          </div>

          <div className="text-[10px] text-[#8a93a8]">{user.role}</div>
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

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-5.8V11a6 6 0 0 0-4.7-5.8V4.8a1.3 1.3 0 1 0-2.6 0v.4A6 6 0 0 0 6 11v4.2L4.6 16.6V18h14.8v-1.4L18 15.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
