import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";

const LogIn = lazy(() => import("../features/auth/pages/LogIn"));
const VideoTrimming = lazy(
  () => import("../features/videoTrimming/pages/VideoTrimming"),
);
const HighlightsEditing = lazy(
  () => import("../features/highlightsEditing/pages/HighlightsEditing"),
);


function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/trimming" replace /> : <LogIn />
          }
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/trimming" replace />}
                    />
                    <Route
                      path="/trimming/:matchId"
                      element={<VideoTrimming />}
                    />
                    <Route path="/trimming" element={<VideoTrimming />} />
                    <Route path="/services" element={<div />} />
                    <Route path="/highlights" element={<HighlightsEditing />} />
                    <Route path="/publishing" element={<div />} />
                    <Route path="/config" element={<div />} />
                  </Routes>
                </Suspense>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
