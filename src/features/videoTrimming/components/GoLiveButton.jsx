export default function GoLiveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 hover:bg-red-700 text-white rounded-[20px] py-[2px] px-[7px] @lg:py-[3px] @lg:px-[9px] @2xl:py-[5px] @2xl:px-[14px] text-[9px] @lg:text-[10px] @2xl:text-[11px] font-bold cursor-pointer flex items-center gap-[3px] @2xl:gap-[5px] tracking-[0.4px] shadow-[0_0_10px_rgba(220,38,38,0.35)] transition-all duration-150 border-none"
    >
      <div className="w-[4px] h-[4px] @2xl:w-[6px] @2xl:h-[6px] rounded-full bg-white shrink-0" />
      Go Live
    </button>
  );
}
