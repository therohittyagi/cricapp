import { useSelector } from 'react-redux';
import { selectInPoint, selectOutPoint, selectDuration } from '../videoSlice';
import { THUMB_COLORS } from '../../../shared/constants/tags';
import ThumbnailItem from './ThumbnailItem';
import ClipRange from './ClipRange';

const THUMB_COUNT = 22;
const THUMBNAILS = Array.from({ length: THUMB_COUNT }, (_, i) => ({
  id: i,
  color: THUMB_COLORS[i % THUMB_COLORS.length],
}));

export default function ThumbnailStrip({ thumbBarRef, thumbnails }) {
  const inPoint = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);

  const frames = thumbnails || THUMBNAILS;

  return (
    <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] pt-3 pb-3 shrink-0">
      <div ref={thumbBarRef} className="relative h-[62px] select-none">
        <div className="flex gap-[2px] h-full">
          {frames.map((thumb, i) => {
            const frac = i / frames.length;
            const inRange =
              inPoint != null &&
              outPoint != null &&
              frac >= inPoint &&
              frac <= outPoint;
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
    </div>
  );
}
