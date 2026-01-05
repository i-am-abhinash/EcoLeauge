import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LearningPathPage from './pages/LearningPathPage';
import GamePage from './pages/GamePage';
import RecycleRouterGame from './pages/RecycleRouterGame';
import BadgesPage from './pages/BadgesPage';
import { useAuth } from './context/AuthContext';
import VideoPage from './pages/VideoPage';
import RecycleFlow from './pages/RecycleFlow';

const WASTE_MANIA_ID = "68ce80f664bf857de6b6800a";
const RECYCLE_ROUTER_ID = "68ce810f64bf857de6b6800b";
const RECYCLE_FLOW_ID = "68cf6d2664bf857de6b68077";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        {/* FIX: This route now redirects to the basic level */}
        <Route path="/" element={<Navigate to="/levels/basic" />} />
        <Route path="/levels/:level" element={<DashboardPage />} />
        <Route path="/intro/waste-management" element={<VideoPage />} />
        <Route path="/path/waste-management" element={<LearningPathPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path={`/game/${WASTE_MANIA_ID}`} element={<GamePage gameId={WASTE_MANIA_ID} />} />
        <Route path={`/game/${RECYCLE_ROUTER_ID}`} element={<RecycleRouterGame gameId={RECYCLE_ROUTER_ID} />} />
        <Route path={`/game/${RECYCLE_FLOW_ID}`} element={<RecycleFlow gameId={RECYCLE_FLOW_ID} />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;