import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GamesPage from "./pages/GamesPage";
import WaitingListPage from "./pages/WaitingListPage";
import DarkMarkBountyPage from "./pages/DarkMarkBountyPage";
import AptitudeRound from './pages/AptitudeRound.tsx';
import GithubRound from './pages/GithubRound.tsx';
import HackathonSelection from './pages/HackathonSelection.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import GameProtectedRoute from "./components/GameProtectedRoute";

function App() {
  return (
    <Router>
      <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/games" element={<GamesPage />} />
          
          <Route path="/aptitude-round" element={
            <GameProtectedRoute requiredRoundId="1">
              <AptitudeRound />
            </GameProtectedRoute>
          } />
          
          <Route path="/github-round" element={
            <GameProtectedRoute requiredRoundId="2">
              <GithubRound />
            </GameProtectedRoute>
          } />
          
          <Route path="/hackathon-selection" element={
            <GameProtectedRoute requiredRoundId="3">
              <HackathonSelection />
            </GameProtectedRoute>
          } />

          <Route path="/dark-mark-bounty" element={
            <GameProtectedRoute requiredRoundId="4">
              <DarkMarkBountyPage />
            </GameProtectedRoute>
          } />

          <Route path="/waiting-list" element={<WaitingListPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
