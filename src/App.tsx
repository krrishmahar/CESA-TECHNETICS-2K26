import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GamesPage from "./pages/GamesPage";
import WaitingListPage from "./pages/WaitingListPage";
import DarkMarkBountyPage from "./pages/DarkMarkBountyPage";
import AptitudeRound from './pages/AptitudeRound.tsx';
import GithubRound from './pages/GithubRound.tsx';
import HackathonSelection from './pages/HackathonSelection.tsx';

function App() {
  return (
    <Router>
      <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/aptitude-round" element={<AptitudeRound />} />
          <Route path="/github-round" element={<GithubRound />} />
          <Route path="/hackathon-selection" element={<HackathonSelection />} />
          <Route path="/waiting-list" element={<WaitingListPage />} />
          <Route path="/dark-mark-bounty" element={<DarkMarkBountyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
