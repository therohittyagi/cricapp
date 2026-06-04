export default function GoLiveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 hover:bg-red-700 text-white rounded-[20px] py-[5px] px-[14px] text-[11px] font-bold cursor-pointer flex items-center gap-[5px] tracking-[0.4px] shadow-[0_0_10px_rgba(220,38,38,0.35)] transition-all duration-150 border-none"
    >
      <div className="w-[6px] h-[6px] rounded-full bg-white shrink-0" />
      Go Live
    </button>
  );
}
