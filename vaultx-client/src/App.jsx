import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LearnMore from "./pages/LearnMore";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import SecretsPage from "./pages/SecretsPage";
import ActivityPage from "./pages/ActivityPage";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageTransition>
        <div className="bg-gray-950 text-green-400 min-h-screen">
          <Navbar />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/get-started" element={<GetStarted />} />

            {/* Protected branch */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/secrets" element={<SecretsPage />} />
              <Route path="/dashboard/activity" element={<ActivityPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </div>
      </PageTransition>
    </Router>
  );
}
