export default function VideoPreview({ previewUrl, title, resolution, fps }) {
  return (
    <div className="flex-1 bg-black flex flex-col min-h-0">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#13151e] border-b border-slate-800">
        <span className="text-sm text-slate-300 font-medium">{title}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {resolution} · {fps} FPS
          </span>
          <button className="text-slate-400 hover:text-white transition-colors" title="Fullscreen">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <img
          src={previewUrl}
          alt="Video preview"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}