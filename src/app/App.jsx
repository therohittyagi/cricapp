import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import LogIn from "../features/auth/pages/LogIn";
import VideoTrimming from "../features/videoTrimming/pages/VideoTrimming";

function App() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/trimming" replace /> : <LogIn />
        }
      /> */}

      <Route
        path="/*"
        element={
          // isAuthenticated ? (
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/trimming" replace />} />
                <Route path="/trimming" element={<VideoTrimming />} />
                <Route path="/services" element={<div />} />
                <Route path="/highlights" element={<div />} />
                <Route path="/publishing" element={<div />} />
                <Route path="/config" element={<div />} />
              </Routes>
            </DashboardLayout>
          // ) : (
          //   <Navigate to="/login" replace />
          // )
        }
      />
    </Routes>
  );
}

export default App;
