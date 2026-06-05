import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDragging,
  selectInPoint,
  selectOutPoint,
  selectDuration,
  selectCurrentTime,
  setDragging,
  setInPoint,
  setOutPoint,
  setCurrentTime,
} from "../videoSlice";
import {
  getFractionFromMouseEvent,
  formatTime,
  clamp,
} from "../../../shared/utils/formatTime/timeFormat";

import VideoPlayer from "../components/VideoPlayer";
import VolumeControl from "../components/VolumeControl";
import PlaybackControls from "../components/PlaybackControls";
import GoLiveButton from "../components/GoLiveButton";
import Timeline from "../components/Timeline";
import InOutSeekbar from "../components/InOutSeekbar";
import ThumbnailStrip from "../components/ThumbnailStrip";
import ClipsList from "../components/ClipsList";

import FullscreenIcon from "../../../assets/Icon/fullscreenIcon.svg";
import DownloadIcon from "../../../assets/Icon/downloadIcon.svg";
import CutIcon from "../../../assets/Icon/cutIcon.svg";

export default function VideoTrimming() {
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const videoRef = useRef(null);
  const tlBarRef = useRef(null);
  const thumbBarRef = useRef(null);

  const dragging = useSelector(selectDragging);
  const inPoint = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);
  const currentTime = useSelector(selectCurrentTime);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e) => {
      if (dragging === "playhead") {
        const frac = getFractionFromMouseEvent(e.clientX, tlBarRef.current);
        const t = frac * duration;
        if (videoRef.current) videoRef.current.currentTime = t;
        dispatch(setCurrentTime(t));
      } else if (dragging === "in") {
        const frac = getFractionFromMouseEvent(e.clientX, thumbBarRef.current);
        const max = outPoint != null ? outPoint - 0.02 : 1;
        dispatch(setInPoint(clamp(frac, 0, max)));
      } else if (dragging === "out") {
        const frac = getFractionFromMouseEvent(e.clientX, thumbBarRef.current);
        const min = inPoint != null ? inPoint + 0.02 : 0;
        dispatch(setOutPoint(clamp(frac, min, 1)));
      }
    };

    const onMouseUp = () => dispatch(setDragging(null));

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, duration, inPoint, outPoint, dispatch]);

  return (
    <>
      <div
        className="flex h-full overflow-hidden text-white bg-[#0d0d10]"
        // style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* LEFT: Editor */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 mx-8  h-[75%] py-4 px-4 bg-[#111318] rounded-[20px]">
          <VideoPlayer videoRef={videoRef} />

          {/* Controls bar */}
          <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] h-[70px] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center">
              <div className="text-[13px] font-semibold tabular-nums text-[#d1d5db] min-w-[112px]">
                {formatTime(currentTime)}{" "}
                <span className="text-[#4b5563]">/</span> {formatTime(duration)}
              </div>

              <VolumeControl videoRef={videoRef} />
            </div>
            <PlaybackControls videoRef={videoRef} />

            <div className="flex items-center gap-[5px]">
              <GoLiveButton />
              <IconBtn title="Download">
                <img src={DownloadIcon} alt="FullscreenIcon" loading="lazy" />
              </IconBtn>
              <IconBtn title="Cut" onClick={() => setShowEdit((o) => !o)} active={showEdit}>
                <img src={CutIcon} alt="CutIcon" loading="lazy" />
              </IconBtn>
              <IconBtn title="Fullscreen">
                <img src={FullscreenIcon} alt="FullscreenIcon" loading="lazy" />
              </IconBtn>
            </div>
          </div>

          <Timeline videoRef={videoRef} timelineBarRef={tlBarRef} />
          <InOutSeekbar />
          {showEdit && <ThumbnailStrip thumbBarRef={thumbBarRef} videoRef={videoRef} />}
        </div>

        {/* RIGHT: Clips */}
        <ClipsList />
      </div>
    </>
  );
}

function IconBtn({ children, title, onClick, active = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "bg-transparent border-none cursor-pointer w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-white/[0.08] hover:text-white",
        active ? "bg-white/[0.1] text-white" : "text-[#9ca3af]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
