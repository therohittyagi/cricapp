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
  selectLoading,
  setDragging,
  setCurrentTime,
  setInPoint,
  setOutPoint,
  resetInOut,
} from "../videoSlice";
import {
  getFractionFromMouseEvent,
  formatTime,
} from "../../../shared/utils/formatTime/timeFormat";
import { fetchMatchConfigThunk, loadHlsThunk, saveClipThunk } from "../videoThunk";
import { goToLive } from "../services/hlsService";

const DEFAULT_MATCH_ID = 'CNO-20260608-ODI-INDPAK-U7UABG';

import VideoPlayer from "../components/VideoPlayer";
import MatchInfo from "../components/MatchInfo";
import VolumeControl from "../components/VolumeControl";
import PlaybackControls from "../components/PlaybackControls";
import GoLiveButton from "../components/GoLiveButton";
import Timeline from "../components/Timeline";
import ClipForm from "../components/ClipForm";
import ClipsList from "../components/ClipsList";
import ClipPlayer from "../components/ClipPlayer";
import Toast, { useToast } from "../../../shared/components/Toast";

import FullscreenIcon from "../../../assets/Icon/fullscreenIcon.svg";
import DownloadIcon from "../../../assets/Icon/downloadIcon.svg";
import CutIcon from "../../../assets/Icon/cutIcon.svg";

export default function VideoTrimming() {
  const dispatch = useDispatch();
  const { matchId } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showClipModal, setShowClipModal] = useState(false);
  const [activeClip, setActiveClip] = useState(null);
  const videoRef = useRef(null);
  const tlBarRef = useRef(null);
  const { toast, showToast, hideToast } = useToast();

  const dragging     = useSelector(selectDragging);
  const duration     = useSelector(selectDuration);
  const currentTime  = useSelector(selectCurrentTime);
  const inPoint      = useSelector(selectInPoint);
  const outPoint     = useSelector(selectOutPoint);
  const hlsUrl       = useSelector(selectHlsUrl);
  const hlsReady     = useSelector(selectHlsReady);
  const loading      = useSelector(selectLoading);

  const handleSave = async () => {
    const result = await dispatch(saveClipThunk());
    setShowClipModal(false);
    setShowEdit(false);
    dispatch(resetInOut());
    const payload = result?.payload;
    if (payload) {
      showToast({
        message: payload.msg || 'Clip saved successfully',
        type: payload.status === 'success' ? 'success' : 'error',
      });
    }
  };

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
      <div className="flex h-screen overflow-hidden text-white bg-[#0d0d10] px-8 py-4 gap-4">
        {/* LEFT: Editor */}
        <div className="flex-[3] min-w-0 flex flex-col overflow-hidden px-4 py-4 bg-[#111318] rounded-[20px] @container">
          <MatchInfo action={
            <GoLiveButton onClick={() => {
              const t = goToLive(videoRef.current);
              if (t != null) dispatch(setCurrentTime(t));
              dispatch(fetchMatchConfigThunk(matchId || DEFAULT_MATCH_ID));
            }} />
          } />
          <VideoPlayer videoRef={videoRef} compact={showClipModal} />

          {/* Controls bar */}
          <div className={`bg-[#111318] border-t border-[#1f2937] px-2 @lg:px-3 @2xl:px-[14px] flex items-center justify-between gap-1 @2xl:gap-2 shrink-0 ${showClipModal ? 'h-[44px]' : 'h-[50px] @lg:h-[60px] @2xl:h-[70px]'}`}>
            <div className="flex items-center gap-1">
              <div className="text-[10px] @lg:text-[11px] @2xl:text-[13px] font-semibold tabular-nums text-[#d1d5db] @lg:min-w-[80px] @2xl:min-w-[112px]">
                {formatTime(currentTime)}{" "}
                <span className="text-[#4b5563]">/</span> {formatTime(duration)}
              </div>

              <VolumeControl videoRef={videoRef} />
            </div>
            <PlaybackControls videoRef={videoRef} />

            <div className="flex items-center gap-[3px] @2xl:gap-[5px]">
              <IconBtn title="Download">
                <img src={DownloadIcon} alt="DownloadIcon" loading="lazy" className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]" />
              </IconBtn>
              <IconBtn title="Cut" onClick={() => setShowEdit((o) => !o)} active={showEdit}>
                <img src={CutIcon} alt="CutIcon" loading="lazy" className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]" />
              </IconBtn>
              <IconBtn title="Fullscreen">
                <img src={FullscreenIcon} alt="FullscreenIcon" loading="lazy" className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]" />
              </IconBtn>
            </div>
          </div>

          <Timeline videoRef={videoRef} timelineBarRef={tlBarRef} showInOut={showEdit} compact={showClipModal} />

          {/* Inline Save Clip form */}
          {showClipModal && (
            <div className="border-t border-[#1f2937] flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-3 pt-2 pb-1 shrink-0">
                <h3 className="text-white font-semibold text-[13px] tracking-[-0.2px]">Save Clip</h3>
                <button
                  onClick={() => setShowClipModal(false)}
                  className="text-[#6b7280] hover:text-white w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.08] transition-colors text-xs leading-none"
                >
                  ✕
                </button>
              </div>
              <ClipForm
                onCancel={() => setShowClipModal(false)}
                onSave={handleSave}
                loading={loading}
              />
            </div>
          )}
        </div>

        {/* MIDDLE: Clips grid — shrinks to flex-[4] when clip player opens */}
        <ClipsList
          activeClip={activeClip}
          setActiveClip={setActiveClip}
          className={activeClip ? 'flex-[4]' : 'flex-[7]'}
        />

        {/* RIGHT: Clip player — same flex-[3] as left editor for pixel-identical width */}
        {activeClip && (
          <div className="flex-[3] min-w-0 flex flex-col overflow-hidden bg-[#111318] rounded-[20px] @container px-4 py-4">
            <ClipPlayer clip={activeClip} onClose={() => setActiveClip(null)} />
          </div>
        )}
      </div>
      <Toast toast={toast} onClose={hideToast} />
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
        "bg-transparent border-none cursor-pointer w-5 h-5 @lg:w-[26px] @lg:h-[26px] @2xl:w-8 @2xl:h-8 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-white/[0.08] hover:text-white",
        active ? "bg-white/[0.1] text-white" : "text-[#9ca3af]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
