export default function ThumbnailItem({ color, isInRange, src }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[3px] overflow-hidden relative h-full"
      style={{ background: color, opacity: isInRange ? 1 : 0.45 }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover block" />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-0 left-[30%] right-[30%] h-[40%] bg-[rgba(22,101,52,0.5)] rounded-t-[2px]" />
        </>
      )}
    </div>
  );
}
