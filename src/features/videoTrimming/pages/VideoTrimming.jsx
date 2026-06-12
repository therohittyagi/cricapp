import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectDragging,
  selectDuration,
  selectCurrentTime,
  selectInPoint,
  selectOutPoint,
  selectHlsUrl,
  selectHlsReady,
  setDragging,
  setCurrentTime,
  resetInOut,
} from "../videoSlice";
import {
  getFractionFromMouseEvent,
  formatTime,
} from "../../../shared/utils/formatTime/timeFormat";
import { fetchMatchConfigThunk, loadHlsThunk } from "../videoThunk";
import { goToLive } from "../services/hlsService";

const DEFAULT_MATCH_ID = 'CNO-20260608-ODI-INDPAK-U7UABG';

import VideoPlayer from "../components/VideoPlayer";
import VolumeControl from "../components/VolumeControl";
import PlaybackControls from "../components/PlaybackControls";
import GoLiveButton from "../components/GoLiveButton";
import Timeline from "../components/Timeline";
import InOutSeekbar from "../components/InOutSeekbar";
import ClipModal from "../components/ClipModal";
import ClipsList from "../components/ClipsList";

import FullscreenIcon from "../../../assets/Icon/fullscreenIcon.svg";
import DownloadIcon from "../../../assets/Icon/downloadIcon.svg";
import CutIcon from "../../../assets/Icon/cutIcon.svg";

export default function VideoTrimming() {
  const dispatch = useDispatch();
  const { matchId } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showClipModal, setShowClipModal] = useState(false);
  const videoRef = useRef(null);
  const tlBarRef = useRef(null);

  const dragging     = useSelector(selectDragging);
  const duration     = useSelector(selectDuration);
  const currentTime  = useSelector(selectCurrentTime);
  const inPoint      = useSelector(selectInPoint);
  const outPoint     = useSelector(selectOutPoint);
  const hlsUrl       = useSelector(selectHlsUrl);
  const hlsReady     = useSelector(selectHlsReady);

  // Step 1: fetch match config (URL param takes priority, else use default)
  useEffect(() => {
    dispatch(fetchMatchConfigThunk(matchId || DEFAULT_MATCH_ID));
  }, [matchId, dispatch]);

  // Step 2: load HLS once URL is ready and player hasn't initialised yet
  useEffect(() => {
    if (hlsUrl && videoRef.current && !hlsReady) {
      dispatch(loadHlsThunk(videoRef.current));
    }
  }, [hlsUrl, hlsReady, dispatch]);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e) => {
      if (dragging === "playhead") {
        const frac = getFractionFromMouseEvent(e.clientX, tlBarRef.current);
        const t = frac * duration;
        if (videoRef.current) videoRef.current.currentTime = t;
        dispatch(setCurrentTime(t));
      }
    };

    const onMouseUp = () => dispatch(setDragging(null));

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, duration, dispatch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && inPoint != null && outPoint != null) {
        setShowClipModal(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inPoint, outPoint]);

  return (
    <>
      <div
        className="flex h-screen overflow-hidden text-white bg-[#0d0d10]"
        // style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* LEFT: Editor */}
        <div className="flex flex-1 self-start flex-col overflow-hidden mx-8 py-4 px-4 bg-[#111318] rounded-[20px] ">
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
              <GoLiveButton onClick={() => {
                const t = goToLive(videoRef.current);
                if (t != null) dispatch(setCurrentTime(t));
              }} />
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
          {showEdit && <InOutSeekbar videoRef={videoRef} />}
        </div>

        {/* RIGHT: Clips */}
        <ClipsList />
      </div>

      {showClipModal && (
        <ClipModal
          onClose={() => setShowClipModal(false)}
          onSaved={() => {
            setShowClipModal(false);
            setShowEdit(false);
            dispatch(resetInOut());
          }}
        />
      )}
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
