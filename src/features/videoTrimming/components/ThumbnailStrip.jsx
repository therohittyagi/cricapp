import { useSelector } from 'react-redux';
import { selectInPoint, selectOutPoint, selectDuration } from '../videoSlice';
import { THUMB_COLORS } from '../../../shared/constants/tags';
import ThumbnailItem from './ThumbnailItem';
import ClipRange     from './ClipRange';

const THUMB_COUNT = 22;
const THUMBNAILS  = Array.from({ length: THUMB_COUNT }, (_, i) => ({ id: i, color: THUMB_COLORS[i % THUMB_COLORS.length] }));

export default function ThumbnailStrip({ thumbBarRef, thumbnails }) {
  const inPoint  = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);

  const frames     = thumbnails || THUMBNAILS;
  const inPercent  = (inPoint  * 100).toFixed(3);
  const rangeWidth = ((outPoint - inPoint) * 100).toFixed(3);

  return (
    <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] pt-[6px] pb-3 shrink-0">

      {/* Frames row + overlay */}
      <div ref={thumbBarRef} className="relative h-[62px] select-none">
        <div className="flex gap-[2px] h-full">
          {frames.map((thumb, i) => {
            const frac    = i / frames.length;
            const inRange = frac >= inPoint && frac <= outPoint;
            return (
              <ThumbnailItem
                key={thumb.id}
                color={thumb.color || THUMB_COLORS[i % THUMB_COLORS.length]}
                src={thumb.src}
                isInRange={inRange}
              />
            );
          })}
        </div>
        <ClipRange inPoint={inPoint} outPoint={outPoint} duration={duration} />
      </div>

      {/* Progress bar below strip */}
      <div className="mt-[7px] h-[3px] rounded-[2px] bg-[#1f2937] overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-[2px]"
          style={{ marginLeft: `${inPercent}%`, width: `${rangeWidth}%` }}
        />
      </div>
    </div>
  );
}
