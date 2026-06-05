import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPlaying,
  selectDuration,
  selectCurrentTime,
  setCurrentTime,
  setIsPlaying,
} from "../videoSlice";
import { clamp } from "../../../shared/utils/formatTime/timeFormat";

import ForwardIcon from "../../../assets/Icon/forwardIcon.svg";
import RewindIcon from "../../../assets/Icon/rewindIcon.svg";
import PauseIcon from "../../../assets/Icon/pauseIcon.svg";
import PlayIcon from "../../../assets/Icon/playIcon.svg";

export default function PlaybackControls({ videoRef }) {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const duration = useSelector(selectDuration);
  const currentTime = useSelector(selectCurrentTime);

  const seek = (delta) => {
    const v = videoRef.current;
    const t = clamp(currentTime + delta, 0, duration);
    if (v) v.currentTime = t;
    dispatch(setCurrentTime(t));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      dispatch(setIsPlaying(false));
    } else {
      v.play().catch(() => {});
      dispatch(setIsPlaying(true));
    }
  };

  return (
    <div className="flex items-center justify-around gap-[3px] border border-[#374151] bg-[#1f2937] rounded-full w-[200px]">
      <button
        className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-10 h-10 rounded-md flex items-center justify-center transition-all duration-150"
        onClick={() => seek(-10)}
        title="Rewind 10s"
      >
        <img src={RewindIcon} alt="RewindIcon" loading="lazy" />
      </button>

      <button
        onClick={togglePlay}
        className=" text-white cursor-pointer w-10 h-10  flex items-center justify-center transition-all duration-150 hover:bg-[#374151]"
      >
        {isPlaying ? (
          <img src={PauseIcon} alt="PauseIcon" loading="lazy" />
        ) : (
          <img src={PlayIcon} alt="PlayIcon" loading="lazy" />
        )}
      </button>

      <button
        className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-10 h-10 rounded-md flex items-center justify-center transition-all duration-150"
        onClick={() => seek(30)}
        title="Forward 10s"
      >
        <img src={ForwardIcon} alt="ForwardIcon" loading="lazy" />
      </button>
    </div>
  );
}
