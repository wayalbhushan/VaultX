import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LearnMore from "./pages/LearnMore";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import SecretsPage from "./pages/SecretsPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageTransition>
        <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950">
          <Routes>
            {/* Public Layout with Navbar & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/get-started" element={<GetStarted />} />
            </Route>

            {/* Protected Dashboard Layout (NO public Navbar collision) */}
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
