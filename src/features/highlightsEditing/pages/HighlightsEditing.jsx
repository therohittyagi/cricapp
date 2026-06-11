import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipBrowser from "../components/ClipBrowser";
import { selectClips, selectMatchId } from "../../videoTrimming/videoSlice";
import {
  fetchMatchConfigThunk,
  fetchClipsListThunk,
} from "../../videoTrimming/videoThunk";
import VideoPreview from "../components/VideoPreview";

const DEFAULT_MATCH_ID = "CNO-20260608-ODI-INDPAK-U7UABG";

function mapClip(clip) {
  return {
    id: clip.id,
    title: clip.output_name || "clip.mp4",
    date: clip.created_at
      ? new Date(clip.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "",
    tags: clip.tags || [],
    tag: clip.tags?.[0] || "",
    thumbnail: clip.thumbnail_url || null,
    duration:
      clip.end_time != null && clip.start_time != null
        ? clip.end_time - clip.start_time
        : 0,
    url: clip.url || "",
    status: clip.status || "",
  };
}

export default function HighlightsEditing() {
  const dispatch = useDispatch();
  const matchId = useSelector(selectMatchId);
  const rawClips = useSelector(selectClips);
  const draggingClip = useRef(null);

  const [activeTab, setActiveTab] = useState("Clips");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedClip, setSelectedClip] = useState(null);

  // Fetch match config (to get matchId) then clips list
  useEffect(() => {
    dispatch(fetchMatchConfigThunk(DEFAULT_MATCH_ID));
  }, [dispatch]);

  useEffect(() => {
    if (!matchId) return;
    dispatch(fetchClipsListThunk(matchId));
  }, [matchId, dispatch]);

  const clips = rawClips.map(mapClip);

  const handleDragStart = (e, clip) => {
    draggingClip.current = clip;
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex h-screen bg-[#0f1117] text-white font-sans select-none overflow-hidden">
      <ClipBrowser
        activeTab={activeTab}
        onTabChange={setActiveTab}
        clips={clips}
        activeFilter={activeFilter}
        selectedClip={selectedClip}
        onFilterChange={setActiveFilter}
        onClipSelect={setSelectedClip}
        onDragStart={handleDragStart}
      />
      <div className="flex-1 flex items-center justify-center p-6">
        <VideoPreview
          previewUrl={selectedClip?.url || ""}
          title={selectedClip?.title || "Select a clip to preview"}
          resolution="1080P"
          fps={24}
        />
      </div>
    </div>
  );
}
