import { useDispatch } from 'react-redux';
import { setDragging } from '../videoSlice';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';

export default function ClipRange({ inPoint, outPoint, duration }) {
  const dispatch   = useDispatch();
  const inPercent  = (inPoint  * 100).toFixed(3);
  const outPercent = (outPoint * 100).toFixed(3);
  const rangeWidth = ((outPoint - inPoint) * 100).toFixed(3);

  const startDrag = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setDragging(type));
  };

  return (
    <>
      {/* Highlighted range */}
      <div
        className="absolute top-0 bottom-0 border-2 border-blue-500 rounded-[3px] pointer-events-none shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
        style={{ left: `${inPercent}%`, width: `${rangeWidth}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(37,99,235,0.85)] text-blue-200 text-[10px] font-bold py-[3px] px-2 rounded whitespace-nowrap tabular-nums tracking-[0.3px]">
          {formatTime(inPoint * duration)} – {formatTime(outPoint * duration)}
        </div>
      </div>

      {/* In handle */}
      <div
        onMouseDown={startDrag('in')}
        className="absolute -top-[2px] -bottom-[2px] w-[5px] bg-blue-500 rounded-[3px] cursor-ew-resize z-20 shadow-[0_0_6px_rgba(59,130,246,0.6)] -translate-x-1/2"
        style={{ left: `${inPercent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
        <div
          className="absolute left-1/2 -translate-x-1/2 text-[9px] text-[#9ca3af] whitespace-nowrap"
          style={{ bottom: 'calc(100% + 3px)' }}
        >
          In
        </div>
      </div>

      {/* Out handle */}
      <div
        onMouseDown={startDrag('out')}
        className="absolute -top-[2px] -bottom-[2px] w-[5px] bg-blue-500 rounded-[3px] cursor-ew-resize z-20 shadow-[0_0_6px_rgba(59,130,246,0.6)] -translate-x-1/2"
        style={{ left: `${outPercent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
        <div
          className="absolute left-1/2 -translate-x-1/2 text-[9px] text-[#9ca3af] whitespace-nowrap"
          style={{ top: 'calc(100% + 3px)' }}
        >
          Out
        </div>
      </div>
    </>
  );
}
