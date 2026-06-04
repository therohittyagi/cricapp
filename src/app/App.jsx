import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import VideoTrimming from "../features/videoTrimming/pages/VideoTrimming";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/trimming" replace />} />
        <Route path="/trimming" element={<VideoTrimming />} />
        <Route path="/services"    element={<div />} />
        <Route path="/highlights"  element={<div />} />
        <Route path="/publishing"  element={<div />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
